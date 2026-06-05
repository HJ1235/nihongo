# NihonGO Kubernetes Migration

NihonGO 백엔드(Spring Boot)를 Kubernetes로 이전하기 위한 1단계 준비 문서입니다.

현재 운영 구조는 다음과 같습니다.

- Frontend: Vercel 유지
- Backend: Render 운영 유지
- Database: Neon PostgreSQL 유지
- AI: OpenAI/Gemini 외부 API 유지
- Frontend Domain: `https://nihongotest.shop`
- Backend Domain: `https://api.nihongotest.shop`

1단계에서는 실제 Kubernetes 적용 없이 백엔드 컨테이너 이미지와 Kubernetes manifest를 준비합니다.

## 생성 파일

```text
backend/
├── Dockerfile
└── .dockerignore

k8s/
└── backend/
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── configmap.example.yaml
    └── secret.example.yaml
```

## Backend Dockerfile

백엔드는 Java 21 기반 멀티 스테이지 Dockerfile로 빌드합니다.

- build stage: Gradle `bootJar`
- runtime stage: Java 21 JRE
- 실행 파일: `/app/app.jar`
- 앱 포트: `8080`

```powershell
cd backend
docker build -t nihongo-backend:local .
```

실제 운영 이미지 예시:

```text
ghcr.io/your-org/nihongo-backend:latest
```

`k8s/backend/deployment.yaml`의 image 값은 실제 GHCR 또는 Docker Hub 이미지 주소로 교체해야 합니다.

## Docker 이미지 빌드 및 로컬 실행 검증

Kubernetes에 배포하기 전에 동일한 Dockerfile로 이미지를 빌드하고, 로컬 컨테이너에서 `/api/health`가 정상 응답하는지 확인합니다.

### 1. 이미지 빌드

Windows PowerShell 기준:

```powershell
cd C:\Dev\Nihongo
docker build -t nihongo-backend:local -f backend/Dockerfile backend
```

빌드가 성공하면 로컬 Docker 이미지 목록에서 `nihongo-backend:local`을 확인할 수 있습니다.

```powershell
docker images nihongo-backend
```

### 2. 로컬 PostgreSQL로 실행

로컬 PostgreSQL을 사용하는 경우 `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`은 실제 로컬 환경값으로 바꿔 실행합니다. 아래 예시는 placeholder이며, 실제 비밀값은 문서나 커밋에 남기지 않습니다.

```powershell
docker run --name nihongo-backend-local `
  -p 8080:8080 `
  -e SPRING_PROFILES_ACTIVE=prod `
  -e PORT=8080 `
  -e DB_URL="jdbc:postgresql://host.docker.internal:5432/nihongo" `
  -e DB_USERNAME="<local-db-username>" `
  -e DB_PASSWORD="<local-db-password>" `
  -e JWT_SECRET="<jwt-secret-at-least-32-characters>" `
  -e CORS_ALLOWED_ORIGINS="http://localhost:5173,https://nihongotest.shop" `
  -e AI_CORRECTION_PROVIDER=mock `
  nihongo-backend:local
```

로컬 DB가 Docker Compose로 실행 중이고 같은 Docker network에 붙여야 하는 경우에는 `--network <network-name>`을 추가하고 `DB_URL`의 host를 해당 PostgreSQL 서비스명으로 바꿉니다.

### 3. Neon PostgreSQL로 실행

Neon PostgreSQL을 사용하는 경우 Neon 콘솔의 JDBC URL을 `DB_URL`에 넣습니다. 실제 접속 정보는 로컬 PowerShell 변수나 별도 비밀 관리 방식으로 주입하고, 명령 예시에는 placeholder만 둡니다.

```powershell
docker run --name nihongo-backend-local `
  -p 8080:8080 `
  -e SPRING_PROFILES_ACTIVE=prod `
  -e PORT=8080 `
  -e DB_URL="jdbc:postgresql://<neon-host>/<database>?sslmode=require" `
  -e DB_USERNAME="<neon-username>" `
  -e DB_PASSWORD="<neon-password>" `
  -e JWT_SECRET="<jwt-secret-at-least-32-characters>" `
  -e CORS_ALLOWED_ORIGINS="http://localhost:5173,https://nihongotest.shop" `
  -e AI_CORRECTION_PROVIDER=mock `
  nihongo-backend:local
```

OpenAI 실서비스 교정까지 로컬 컨테이너에서 확인하려면 다음 환경변수를 추가합니다. API quota 부족이나 호출 실패가 발생하면 기존 Mock fallback이 동작합니다.

```powershell
  -e AI_CORRECTION_PROVIDER=openai `
  -e OPENAI_API_KEY="<openai-api-key>" `
  -e OPENAI_CORRECTION_MODEL=gpt-5.2 `
  -e OPENAI_BASE_URL="https://api.openai.com/v1" `
```

### 4. Health Check 확인

컨테이너가 실행되면 새 PowerShell 창에서 health endpoint를 확인합니다.

```powershell
Invoke-RestMethod http://localhost:8080/api/health
```

정상 응답 예시:

```json
{
  "success": true,
  "message": null,
  "data": "OK"
}
```

로그 확인:

```powershell
docker logs -f nihongo-backend-local
```

중지 및 삭제:

```powershell
docker stop nihongo-backend-local
docker rm nihongo-backend-local
```

### 5. 실패 원인별 체크리스트

| 증상 | 확인할 항목 |
| --- | --- |
| `docker build` 실패 | Docker Desktop 실행 여부, 네트워크 연결, Gradle wrapper 권한, `backend/Dockerfile` 경로 |
| `port is already allocated` | 로컬 8080 사용 프로세스 확인 또는 `-p 18080:8080`처럼 호스트 포트 변경 |
| 컨테이너 즉시 종료 | `docker logs nihongo-backend-local`로 Spring Boot 시작 실패 원인 확인 |
| DB 연결 실패 | `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, Neon `sslmode=require`, 로컬 DB host 설정 확인 |
| JWT 관련 오류 | `JWT_SECRET` 길이와 값 주입 여부 확인 |
| `/api/health` 연결 실패 | 컨테이너 실행 여부, `PORT=8080`, `-p 8080:8080`, Spring Boot startup 완료 여부 확인 |
| CORS 오류 | `CORS_ALLOWED_ORIGINS`에 Vercel/로컬 프론트 주소가 포함되어 있는지 확인 |
| OpenAI 교정 실패 | `AI_CORRECTION_PROVIDER`, `OPENAI_API_KEY`, quota, model 값 확인. 실패 시 Mock fallback 로그 확인 |

## Kubernetes 리소스

### Deployment

파일: `k8s/backend/deployment.yaml`

주요 설정:

- `app: nihongo-backend`
- `replicas: 2`
- `containerPort: 8080`
- `envFrom`으로 ConfigMap/Secret 주입
- `/api/health` 기반 readinessProbe/livenessProbe
- 기본 resource request/limit 포함

### Service

파일: `k8s/backend/service.yaml`

주요 설정:

- type: `ClusterIP`
- service port: `80`
- targetPort: `http` (`8080`)

### Ingress

파일: `k8s/backend/ingress.yaml`

주요 설정:

- host: `api.nihongotest.shop`
- path: `/`
- service: `nihongo-backend:80`
- cert-manager TLS 설정 예시는 주석으로 포함

Ingress Controller는 예시로 NGINX Ingress를 가정했습니다. 사용하는 클러스터 환경에 따라 annotation은 조정할 수 있습니다.

## 환경변수

### ConfigMap

파일: `k8s/backend/configmap.example.yaml`

비밀값이 아닌 운영 설정을 관리합니다.

```yaml
SPRING_PROFILES_ACTIVE: "prod"
PORT: "8080"
AI_CORRECTION_PROVIDER: "mock"
OPENAI_CORRECTION_MODEL: "gpt-5.2"
OPENAI_BASE_URL: "https://api.openai.com/v1"
CORS_ALLOWED_ORIGINS: "https://nihongotest.shop,https://www.nihongotest.shop"
```

OpenAI 실서비스 교정을 사용하려면 `AI_CORRECTION_PROVIDER`를 `openai`로 변경하고 Secret에 `OPENAI_API_KEY`를 설정합니다.

### Secret

파일: `k8s/backend/secret.example.yaml`

실제 비밀값은 커밋하지 않습니다. 예시 파일에는 placeholder만 둡니다.

```yaml
DB_URL: "jdbc:postgresql://<neon-host>/<database>?sslmode=require"
DB_USERNAME: "<neon-username>"
DB_PASSWORD: "<neon-password>"
JWT_SECRET: "<jwt-secret-at-least-32-characters>"
OPENAI_API_KEY: "<openai-api-key>"
```

실제 운영 Secret은 클러스터에서 직접 생성하거나, Sealed Secrets, External Secrets Operator, GitHub Actions secrets 같은 별도 비밀 관리 방식을 사용합니다.

## 적용 순서 예시

아래 명령은 예시입니다. 1단계에서는 실제 apply를 수행하지 않습니다.

```powershell
kubectl apply -f k8s/backend/configmap.yaml
kubectl apply -f k8s/backend/secret.yaml
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml
kubectl apply -f k8s/backend/ingress.yaml
```

## 마이그레이션 체크리스트

- Backend Docker 이미지 빌드 성공
- 이미지 레지스트리 push 완료
- `deployment.yaml` image 주소 교체
- Neon PostgreSQL 접속 정보 Secret 등록
- `JWT_SECRET` 운영값 등록
- OpenAI 사용 시 `OPENAI_API_KEY` 등록
- Ingress Controller 설치 확인
- TLS 인증서 발급 방식 결정
- DNS `api.nihongotest.shop`을 Kubernetes Ingress endpoint로 전환
- 전환 전 Render 백엔드 유지
- 전환 후 `/api/health`, 로그인, AI 교정, 관리자 API smoke test

## 주의사항

- 실제 비밀값은 Kubernetes manifest 예시 파일에 넣지 않습니다.
- Frontend는 Vercel을 유지하므로 `CORS_ALLOWED_ORIGINS`에 `https://nihongotest.shop`을 포함해야 합니다.
- Database는 Neon PostgreSQL을 유지하므로 별도 StatefulSet이나 PVC를 만들지 않습니다.
- OpenAI API는 외부 API로 유지하며, quota 부족이나 호출 실패 시 기존 Mock fallback 구조가 동작합니다.
- Render 배포는 Kubernetes 전환이 검증될 때까지 유지합니다.
