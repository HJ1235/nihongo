# Architecture

NihonGO는 학습 서비스 기능과 운영 기능을 분리해 구성한 AI 기반 일본어 학습 플랫폼입니다.

## 전체 구조

```text
User
  |
  v
React + TypeScript + Vite
  |
  v
Spring Boot API
  |
  v
Neon PostgreSQL
```

현재 운영 배포:

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL
- Domain: `nihongotest.shop`
- API Domain: `api.nihongotest.shop`

Kubernetes 이전 준비 구조:

```text
GitHub Repository
  |
  v
GitHub Actions
  |
  v
GHCR
  |
  v
Kubernetes
  |
  v
ArgoCD
```

## Frontend

Frontend는 React, TypeScript, Vite로 구성했습니다.

주요 화면:

- 로그인/회원가입
- 대시보드
- AI 교정
- 추천 학습
- 공지사항
- 관리자 대시보드

API 통신은 공통 `apiClient`를 사용하며 JWT 인증 구조를 유지합니다.

## Backend

Backend는 Spring Boot 기반 REST API로 구성했습니다.

주요 모듈:

- `user`: 회원가입, 로그인, 사용자 정보, 학습 모드
- `correction`: AI 교정, 교정 기록, 교정 통계
- `recommendation`: 목적별 추천 학습
- `lesson`, `quiz`, `progress`, `wrongnote`: 학습 기능
- `notice`: 공지사항
- `admin`: 관리자 기능
- `global`: 공통 응답, 인증, 예외 처리, 설정

## AI Correction Architecture

```text
CorrectionService
  |
  v
CorrectionGenerator
  |
  +-- MockCorrectionGenerator
  +-- OpenAiCorrectionGenerator
  +-- GeminiCorrectionGenerator
```

환경변수로 Provider를 선택합니다.

```text
AI_CORRECTION_PROVIDER=mock | openai | gemini
```

OpenAI 사용 시 OpenAI Responses API를 호출합니다. API key가 없거나 호출 실패, quota 부족, 응답 파싱 실패가 발생하면 Mock Provider로 fallback합니다.

## Recommendation Architecture

추천 학습은 현재 rule-based mock 데이터로 구성했습니다.

```text
User.learningMode
  |
  v
RecommendationService
  |
  v
ModeRecommendationResponse
```

향후 DB 기반 콘텐츠 추천으로 전환하기 쉽도록 Service 계층으로 분리했습니다.

## Kubernetes Architecture

```text
Ingress-NGINX
  |
  v
Service: nihongo-backend
  |
  v
Deployment: nihongo-backend
  |
  v
Pod: Spring Boot container
```

Backend container는 GHCR private registry image를 사용합니다. Kubernetes에서는 `imagePullSecrets`로 GHCR 인증을 처리합니다.

## AWS EKS Target Architecture

Terraform으로 AWS EKS 이전 설계를 준비했습니다.

```text
VPC
├─ Public Subnet x2
├─ Private App Subnet x2
├─ Private DB Subnet x2
├─ NAT Gateway x1 for dev
└─ EKS Managed Node Group
```

현재는 개인 개발용 dev 환경 기준으로 비용을 줄인 구성입니다. 운영 환경에서는 NAT Gateway와 Node Group을 AZ별 고가용성 기준으로 확장해야 합니다.
