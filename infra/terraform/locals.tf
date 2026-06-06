locals {
  name_prefix      = "${var.project_name}-${var.environment}"
  eks_cluster_name = "${local.name_prefix}-eks"

  public_subnets = {
    public-a = {
      availability_zone = "${var.region}a"
      cidr_block        = "10.20.1.0/24"
    }
    public-c = {
      availability_zone = "${var.region}c"
      cidr_block        = "10.20.2.0/24"
    }
  }

  private_subnets = {
    private-a = {
      availability_zone = "${var.region}a"
      cidr_block        = "10.20.11.0/24"
    }
    private-c = {
      availability_zone = "${var.region}c"
      cidr_block        = "10.20.12.0/24"
    }
  }

  private_db_subnets = {
    private-db-a = {
      availability_zone = "${var.region}a"
      cidr_block        = "10.20.21.0/24"
    }
    private-db-c = {
      availability_zone = "${var.region}c"
      cidr_block        = "10.20.22.0/24"
    }
  }

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
