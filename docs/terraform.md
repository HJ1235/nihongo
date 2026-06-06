# NihonGO Terraform

NihonGO의 AWS 이전을 준비하기 위한 Terraform 인프라 문서입니다.

현재 Terraform 구성은 개인 개발 및 포트폴리오 검증용 `dev` 환경을 기준으로 비용을 줄이는 방향으로 설계합니다. 실제 운영 환경으로 전환할 때는 고가용성 구성을 다시 강화해야 합니다.

## 현재 Dev 구성

- Region: `ap-northeast-2`
- VPC CIDR: `10.20.0.0/16`
- Public Subnet: 2개
- Private App Subnet: 2개
- Private DB Subnet: 2개
- NAT Gateway: 1개
- EKS Cluster: 1개
- Managed Node Group: `t3.medium`
- Node Group size: desired `1`, min `1`, max `2`

## 비용 최적화 기준

개인 개발 환경에서는 항상 켜져 있는 리소스를 최소화합니다.

- NAT Gateway는 2개 대신 1개만 사용합니다.
- Managed Node Group은 기본 1대만 실행합니다.
- Auto Scaling 상한은 2대로 제한합니다.
- Route53, ACM, AWS Load Balancer Controller, ArgoCD, 모니터링 스택은 Terraform에서 아직 생성하지 않습니다.

## 고가용성 전환 기준

운영 환경에서는 아래처럼 강화하는 것을 권장합니다.

- NAT Gateway를 AZ별로 1개씩 생성합니다.
- 각 Private Subnet은 같은 AZ의 NAT Gateway로 라우팅합니다.
- Managed Node Group desired/min을 2 이상으로 설정합니다.
- Ingress, TLS, DNS, 모니터링, 로그 수집 구성을 별도 모듈로 추가합니다.

현재 dev 구성은 비용을 줄이는 대신 NAT Gateway가 있는 AZ에 장애가 발생하면 private subnet의 외부 egress가 영향을 받을 수 있습니다.

## 주의사항

- `terraform apply` 전에는 반드시 예상 비용을 확인합니다.
- 실제 Secret, DB URL, API Key는 Terraform 파일에 넣지 않습니다.
- `terraform.tfvars`는 로컬 환경 값만 관리하고 공개 저장소에 민감 정보를 커밋하지 않습니다.
