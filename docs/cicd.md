# NihonGO CI/CD

NihonGO backend는 GitHub Actions, GHCR, ArgoCD를 이용해 GitOps 방식으로 배포합니다.

## 전체 흐름

1. `backend/**` 코드 변경 후 `main` 브랜치에 push
2. GitHub Actions 실행
3. Backend Docker image 빌드
4. GHCR에 `latest`와 short SHA 태그 push
5. `k8s/backend/deployment.yaml`의 image 태그를 short SHA로 변경
6. GitHub Actions bot이 변경된 manifest를 main 브랜치에 commit/push
7. ArgoCD가 Git 변경을 감지
8. Kubernetes에 새 backend image 자동 배포

## Workflow

파일:

```text
.github/workflows/backend-docker-ghcr.yml
```

트리거:

- `main` 브랜치 push
- `backend/**` 변경
- `.github/workflows/backend-docker-ghcr.yml` 변경
- `workflow_dispatch` 수동 실행

자동 commit으로 인한 무한 반복은 workflow path filter로 방지합니다. GitHub Actions가 커밋하는 파일은 `k8s/backend/deployment.yaml`이며, 해당 경로는 workflow trigger path에 포함되어 있지 않습니다.

## 권한

```yaml
permissions:
  contents: write
  packages: write
```

`contents: write`는 deployment manifest 자동 commit/push에 사용합니다. `packages: write`는 GHCR image push에 사용합니다.

## Registry

- Registry: GHCR
- Image: `ghcr.io/hj1235/nihongo-backend`
- Authentication: `GITHUB_TOKEN`
- 별도 PAT는 사용하지 않습니다.

```yaml
username: ${{ github.actor }}
password: ${{ secrets.GITHUB_TOKEN }}
```

## Image Tags

GitHub Actions는 아래 두 태그를 push합니다.

```text
ghcr.io/hj1235/nihongo-backend:latest
ghcr.io/hj1235/nihongo-backend:${SHORT_SHA}
```

예시:

```text
ghcr.io/hj1235/nihongo-backend:a1b2c3d
```

## Kubernetes Manifest Update

Docker image push가 성공하면 workflow가 [k8s/backend/deployment.yaml](../k8s/backend/deployment.yaml)의 image 라인을 short SHA 태그로 변경합니다.

변경 전 예시:

```yaml
image: ghcr.io/hj1235/nihongo-backend:latest
```

변경 후 예시:

```yaml
image: ghcr.io/hj1235/nihongo-backend:a1b2c3d
```

자동 commit 메시지:

```text
chore: update backend image to a1b2c3d
```

commit author:

```text
github-actions[bot]
```

## ArgoCD

ArgoCD Application은 현재 repository의 `k8s/backend` 경로를 감시합니다.

- Repository: `HJ1235/nihongo`
- Path: `k8s/backend`
- Namespace: `nihongo`

ArgoCD는 deployment image tag 변경 commit을 감지하고 Kubernetes backend Deployment를 자동 동기화합니다.

## Secret 관리

실제 비밀값은 Git에 커밋하지 않습니다.

- `k8s/backend/secret.local.yaml`은 로컬 apply 전용이며 `.gitignore`에 포함되어 있습니다.
- `k8s/backend/secret.example.yaml`은 placeholder 예시만 포함합니다.
- Neon DB URL, DB password, JWT secret, OpenAI API key는 GitHub Actions workflow나 문서에 저장하지 않습니다.

## 확인 명령어

GitHub Actions 실행 후 image tag commit 확인:

```powershell
git pull origin main
git log --oneline -5
Get-Content k8s/backend/deployment.yaml
```

ArgoCD 상태 확인:

```powershell
argocd app get nihongo-backend
argocd app sync nihongo-backend
argocd app wait nihongo-backend --health
```

Kubernetes 상태 확인:

```powershell
kubectl -n nihongo get deploy,svc,pod
kubectl -n nihongo describe deploy nihongo-backend
kubectl -n nihongo logs -l app=nihongo-backend --tail=100
```

서비스 확인:

```powershell
kubectl -n nihongo port-forward svc/nihongo-backend 8080:80
Invoke-RestMethod http://localhost:8080/api/health
```
