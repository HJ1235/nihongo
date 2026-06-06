output "project_name" {
  description = "Project name."
  value       = var.project_name
}

output "environment" {
  description = "Deployment environment."
  value       = var.environment
}

output "region" {
  description = "AWS region."
  value       = var.region
}

output "name_prefix" {
  description = "Common resource name prefix."
  value       = local.name_prefix
}

output "common_tags" {
  description = "Common tags applied through the AWS provider default tags."
  value       = local.common_tags
}

output "vpc_id" {
  description = "VPC ID."
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs."
  value       = [for subnet in aws_subnet.public : subnet.id]
}

output "private_subnet_ids" {
  description = "Private subnet IDs."
  value       = [for subnet in aws_subnet.private : subnet.id]
}

output "private_db_subnet_ids" {
  description = "Private DB subnet IDs."
  value       = [for subnet in aws_subnet.private_db : subnet.id]
}

output "nat_gateway_ids" {
  description = "NAT Gateway IDs."
  value       = [for nat_gateway in aws_nat_gateway.main : nat_gateway.id]
}
