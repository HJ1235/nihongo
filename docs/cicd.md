# CI/CD

NihonGO backend는 GitHub Actions, Docker, GHCR, Kubernetes manifest 자동 갱신을 조합해 배포 준비 파이프라인을 구성했습니다.

## 목표

- backend 코드 변경 시 Docker image 자동 빌드
- GHCR에 `latest`와 short SHA 태그 push
- push된 short SHA image를 pull 검증
- Kubernetes Deployment image tag를 short SHA로 자동 변경
- 변경된 manifest를 GitHub Actions bot이 main 브랜치에 commit/push
- ArgoCD가 Git 변경을 감지해 Kubernetes에 자동 반영

## Workflow 파일

```text
.github/workflows/backend-docker-ghcr.yml
```

## Trigger

```yaml
on:
  push:
    branches:
      - main
    paths:
      - "backend/**"
      - ".github/workflows/backend-docker-ghcr.yml"
  workflow_dispatch:
```

`k8s/backend/deployment.yaml` 변경 commit은 workflow trigger path에 포함하지 않습니다. 자동 commit 메시지에도 `[skip ci]`를 포함해 불필요한 반복 실행을 방지합니다.

## 권한

```yaml
permissions:
  contents: write
  packages: write
```

- `contents: write`: deployment manifest 자동 commit/push
- `packages: write`: GHCR image push

별도 Personal Access Token은 사용하지 않고 `GITHUB_TOKEN`을 사용합니다.

## Image Tag 전략

```text
ghcr.io/hj1235/nihongo-backend:latest
ghcr.io/hj1235/nihongo-backend:${SHORT_SHA}
```

`SHORT_SHA`는 workflow 시작 시 `GITHUB_SHA` 앞 7자리로 한 번만 생성하고, Docker push와 manifest update에 같은 값을 사용합니다.

## 배포 흐름

```text
1. backend 코드 변경
2. main 브랜치 push
3. GitHub Actions 실행
4. Docker build
5. GHCR push latest + short SHA
6. docker pull로 short SHA image 검증
7. deployment.yaml image tag를 short SHA로 변경
8. GitHub Actions bot이 manifest commit/push
9. ArgoCD가 Git 변경 감지
10. Kubernetes rollout
```

## Manifest 자동 갱신

workflow는 `k8s/backend/deployment.yaml`의 backend image line만 변경합니다.

```yaml
image: ghcr.io/hj1235/nihongo-backend:<short-sha>
```

자동 commit 메시지:

```text
chore: update backend image to <short-sha> [skip ci]
```

## 확인 명령어

GitHub Actions 완료 후 로컬에서 다음 명령으로 image tag 변경을 확인합니다.

```powershell
git pull origin main
git log --oneline -5
Get-Content k8s/backend/deployment.yaml
```

Kubernetes 상태 확인:

```powershell
kubectl -n nihongo get deploy,svc,pod
kubectl -n nihongo describe deploy nihongo-backend
kubectl -n nihongo logs -l app=nihongo-backend --tail=100
```

Service 확인:

```powershell
kubectl -n nihongo port-forward svc/nihongo-backend 8080:80
Invoke-RestMethod http://localhost:8080/api/health
```

## Secret 관리 원칙

- 실제 DB URL, DB password, JWT secret, OpenAI API key는 Git에 커밋하지 않습니다.
- `k8s/backend/secret.local.yaml`은 로컬 적용 전용입니다.
- GitOps 대상 manifest에는 Secret example을 포함하지 않습니다.
- 운영 환경에서는 External Secrets, Sealed Secrets, 클라우드 Secret Manager 연동을 고려합니다.
