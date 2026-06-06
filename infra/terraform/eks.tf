resource "aws_eks_cluster" "main" {
  name     = local.eks_cluster_name
  version  = "1.33"
  role_arn = aws_iam_role.eks_cluster.arn

  vpc_config {
    subnet_ids              = [for subnet in aws_subnet.private : subnet.id]
    security_group_ids      = [aws_security_group.eks_cluster.id]
    endpoint_public_access  = true
    endpoint_private_access = false
  }

  tags = {
    Name = local.eks_cluster_name
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster
  ]
}

data "tls_certificate" "eks" {
  url = aws_eks_cluster.main.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "eks" {
  url             = aws_eks_cluster.main.identity[0].oidc[0].issuer
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.eks.certificates[0].sha1_fingerprint]

  tags = {
    Name = "${local.name_prefix}-eks-oidc"
  }
}

resource "aws_launch_template" "eks_node" {
  name_prefix = "${local.name_prefix}-eks-node-"

  vpc_security_group_ids = [aws_security_group.eks_nodes.id]

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name = "${local.name_prefix}-eks-node"
    }
  }

  tags = {
    Name = "${local.name_prefix}-eks-node-template"
  }
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${local.name_prefix}-managed-nodes"
  node_role_arn   = aws_iam_role.eks_node.arn
  subnet_ids      = [for subnet in aws_subnet.private : subnet.id]
  instance_types  = ["t3.medium"]

  scaling_config {
    desired_size = 1
    min_size     = 1
    max_size     = 2
  }

  launch_template {
    id      = aws_launch_template.eks_node.id
    version = "$Latest"
  }

  tags = {
    Name = "${local.name_prefix}-managed-nodes"
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_node_worker,
    aws_iam_role_policy_attachment.eks_node_cni,
    aws_iam_role_policy_attachment.eks_node_ecr
  ]
}
