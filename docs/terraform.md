# Terraform

NihonGO는 Docker Desktop Kubernetes에서 AWS EKS로 이전할 수 있도록 Terraform 기반 인프라 설계를 준비했습니다.

현재 Terraform은 개인 개발 및 포트폴리오 검증용 `dev` 환경 기준입니다. 기능 검증은 가능하게 유지하되, 상시 비용이 큰 리소스는 최소화했습니다.

## 디렉터리 구조

```text
infra/terraform/
├─ versions.tf
├─ provider.tf
├─ variables.tf
├─ locals.tf
├─ main.tf
├─ iam.tf
├─ security_groups.tf
├─ eks.tf
├─ outputs.tf
└─ terraform.tfvars.example
```

## 기본 변수

```text
project_name = "nihongo"
environment  = "dev"
region       = "ap-northeast-2"
```

공통 이름 prefix:

```text
nihongo-dev
```

## 네트워크 설계

```text
VPC: 10.20.0.0/16

Public Subnet
├─ ap-northeast-2a: 10.20.1.0/24
└─ ap-northeast-2c: 10.20.2.0/24

Private App Subnet
├─ ap-northeast-2a: 10.20.11.0/24
└─ ap-northeast-2c: 10.20.12.0/24

Private DB Subnet
├─ ap-northeast-2a: 10.20.21.0/24
└─ ap-northeast-2c: 10.20.22.0/24
```

생성 리소스:

- VPC
- Internet Gateway
- Public Route Table
- Private App Route Table
- Private DB Route Table
- NAT Gateway
- Elastic IP

## 비용 최적화 설계

개인 개발용 dev 환경에서는 NAT Gateway를 1개만 사용합니다.

```text
Private App Subnet A/C
Private DB Subnet A/C
  |
  v
Single NAT Gateway in public-a
```

이 방식은 비용을 줄일 수 있지만 NAT Gateway가 위치한 AZ에 장애가 발생하면 private subnet의 외부 egress가 영향을 받을 수 있습니다.

## EKS 설계

생성 리소스:

- EKS Cluster
- EKS Cluster IAM Role
- Managed Node Group
- Node Group IAM Role
- Cluster Security Group
- Node Security Group
- OIDC Provider

설정:

```text
EKS Version: 1.33
Endpoint: public endpoint enabled
Node Group instance: t3.medium
Node Group desired: 1
Node Group min: 1
Node Group max: 2
Subnet: Private App Subnet
```

## 운영 환경 전환 기준

운영 환경으로 전환할 때는 아래 항목을 강화합니다.

- NAT Gateway를 AZ별 1개씩 생성
- 각 Private Subnet을 같은 AZ의 NAT Gateway로 라우팅
- Managed Node Group desired/min을 2 이상으로 조정
- AWS Load Balancer Controller 추가
- Route53, ACM 기반 HTTPS 구성
- External Secrets 또는 Sealed Secrets 도입
- Prometheus, Grafana, Loki 기반 관측성 구성

## 실행 전 확인

`terraform apply` 전에는 반드시 plan과 예상 비용을 확인합니다.

```powershell
cd infra/terraform
terraform fmt
terraform validate
terraform plan
```

현재 문서화 단계에서는 `terraform apply`를 실행하지 않습니다.

## 출력값

주요 output:

- `vpc_id`
- `public_subnet_ids`
- `private_subnet_ids`
- `private_db_subnet_ids`
- `nat_gateway_ids`
- `eks_cluster_name`
- `eks_cluster_endpoint`
- `eks_oidc_provider_arn`

## Secret 관리

Terraform 파일에는 실제 Secret 값을 넣지 않습니다.

- AWS Access Key
- DB URL
- DB password
- JWT secret
- OpenAI API key

이 값들은 로컬 환경변수, CI secret, 클라우드 Secret Manager 등 별도 경로로 관리합니다.
