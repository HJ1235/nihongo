# NihonGO

일본 취업, 워킹홀리데이, JLPT 학습자를 위한 AI 기반 일본어 학습 플랫폼입니다.

NihonGO는 일본어 문장 교정, 목적별 추천 학습, 상황별 실습, 학습 기록 관리, 관리자 운영 기능을 하나의 서비스 흐름으로 구성한 포트폴리오 프로젝트입니다. 현재 서비스는 Vercel과 Render 기반으로 운영하며, Docker, Kubernetes, ArgoCD, GitHub Actions, Terraform을 통해 클라우드 네이티브 이전 구조까지 설계했습니다.

## 프로젝트 소개

### 배포 URL

| 구분 | URL |
| --- | --- |
| Frontend | https://nihongotest.shop |
| Backend API | https://api.nihongotest.shop |
| Swagger | https://api.nihongotest.shop/swagger-ui.html |

### 핵심 목표

- 일본어 학습자의 문장을 자연스러운 일본어로 교정
- 일본 취업, 워킹홀리데이, 일상생활, JLPT 목적별 학습 추천
- 추천 학습에서 실습 문장을 작성하고 AI 교정으로 이어지는 학습 플로우 제공
- 관리자 통계와 회원 관리 기능을 포함한 운영 기능 구현
- CI/CD, GitOps, Kubernetes, Terraform 기반 배포 전환 경험 문서화

## 주요 기능

### 인증 및 사용자

- 회원가입 및 로그인
- JWT 기반 인증
- 사용자 학습 목적 모드 변경
- 로그인 사용자 기준 데이터 조회

### AI 일본어 교정

- 일본어 문장 교정 요청
- 교정 결과와 설명 제공
- 교정 기록 저장 및 조회
- 사용자별 교정 통계 제공
- Mock, OpenAI, Gemini 확장 구조 기반 Correction Provider 설계
- OpenAI 호출 실패 시 Mock 교정으로 fallback

### 추천 학습

- 학습 목적 모드: 일반, 일본 취업, 워킹홀리데이, 일상생활, JLPT
- 모드별 추천 콘텐츠 제공
- 추천 항목별 상황 설명, 필수 표현, 예시 대화, 실습 문제 제공
- 실습 답안을 AI 교정 페이지로 연계

### 관리자 기능

- 공지사항 관리
- 회원 목록 및 상세 조회
- 회원 정지 및 활성화
- 관리자 통계 대시보드
- 전체 회원, 활성 회원, 정지 회원, 공지, 교정 수 집계

## 시스템 아키텍처

```text
User
  |
  v
React + TypeScript + Vite (Vercel)
  |
  v
Spring Boot API (Render)
  |
  v
Neon PostgreSQL

Spring Boot API
  |
  v
Correction Provider
  |
  +-- MockCorrectionGenerator
  +-- OpenAiCorrectionGenerator
  +-- GeminiCorrectionGenerator structure
```

Kubernetes 이전 준비 구조:

```text
GitHub Actions
  |
  v
GHCR Private Registry
  |
  v
Kubernetes Deployment / Service / Ingress
  |
  v
ArgoCD GitOps Sync
```

자세한 내용은 [Architecture 문서](docs/architecture.md)를 참고하세요.

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Backend | Spring Boot, Spring Security, Spring Data JPA, Java 21 |
| Database | Neon PostgreSQL |
| Auth | JWT |
| AI | Mock Provider, OpenAI Responses API, Gemini Provider 확장 구조 |
| Deploy | Vercel, Render |
| Container | Docker, GHCR |
| Kubernetes | Deployment, Service, Ingress-NGINX, ArgoCD |
| CI/CD | GitHub Actions |
| IaC | Terraform |
| Cloud Design | AWS EKS, VPC, Subnet, NAT Gateway, Managed Node Group |

## CI/CD 파이프라인

Backend 변경이 `main` 브랜치에 반영되면 GitHub Actions가 Docker 이미지를 빌드하고 GHCR에 `latest`와 short SHA 태그로 push합니다. 이후 workflow가 `k8s/backend/deployment.yaml`의 image tag를 short SHA로 갱신하고 자동 commit/push합니다.

```text
backend code push
  -> GitHub Actions
  -> Docker build
  -> GHCR push
  -> deployment.yaml image tag update
  -> Git commit
  -> ArgoCD sync
  -> Kubernetes rollout
```

자세한 내용은 [CI/CD 문서](docs/cicd.md)를 참고하세요.

## GitOps 구조

ArgoCD Application은 현재 repository의 `k8s/backend` 경로를 감시합니다. Secret은 GitOps 대상에서 제외하고, Deployment는 클러스터에 별도로 생성된 `nihongo-backend-secret`을 참조합니다.

자세한 내용은 [GitOps 문서](docs/gitops.md)를 참고하세요.

## Terraform 인프라 설계

AWS EKS 이전을 위한 Terraform 기본 설계를 준비했습니다. 현재는 개인 개발 및 포트폴리오 검증용 dev 환경이므로 비용을 줄이기 위해 NAT Gateway 1개, Managed Node 1대 기준으로 설계했습니다.

운영 전환 시에는 NAT Gateway를 AZ별로 분리하고, Node Group desired/min을 2 이상으로 조정하는 고가용성 구성이 필요합니다.

자세한 내용은 [Terraform 문서](docs/terraform.md)를 참고하세요.

## 프로젝트 구조

```text
Nihongo/
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ contexts/
│  │  └─ pages/
│  └─ package.json
├─ backend/
│  ├─ src/main/java/com/nihongo/backend/
│  │  ├─ admin/
│  │  ├─ correction/
│  │  ├─ domain/
│  │  ├─ lesson/
│  │  ├─ notice/
│  │  ├─ quiz/
│  │  ├─ recommendation/
│  │  └─ user/
│  ├─ Dockerfile
│  └─ build.gradle
├─ k8s/
│  ├─ backend/
│  ├─ ingress/
│  └─ argocd/
├─ infra/
│  └─ terraform/
├─ docs/
└─ .github/workflows/
```

## 문서

- [Architecture](docs/architecture.md)
- [API 명세](docs/api.md)
- [ERD](docs/erd.md)
- [CI/CD](docs/cicd.md)
- [GitOps](docs/gitops.md)
- [Terraform](docs/terraform.md)
- [Ingress-NGINX](docs/ingress.md)
- [Troubleshooting](docs/troubleshooting.md)

## 트러블슈팅 경험

- GHCR private image pull을 위한 `imagePullSecrets` 구성
- short SHA tag 불일치로 인한 `ImagePullBackOff` 원인 분석
- ArgoCD sync가 placeholder Secret을 재생성하던 문제 해결
- Service `targetPort`와 Pod named port 불일치 문제 해결
- OpenAI Responses API 응답 파싱 문제 해결
- Docker Desktop Kubernetes에서 Ingress-NGINX 검증

자세한 내용은 [Troubleshooting 문서](docs/troubleshooting.md)를 참고하세요.

## 향후 개선 계획

- OpenAI 운영 사용량 및 비용 모니터링
- Gemini Provider 활성화
- 추천 학습 콘텐츠 DB 기반 전환
- 교정 분석 리포트 고도화
- AWS EKS 실제 배포 검증
- External Secrets 또는 Sealed Secrets 기반 Secret 관리
- Route53, ACM, AWS Load Balancer Controller 구성
- Prometheus, Grafana, Loki 기반 관측성 구성
