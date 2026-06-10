# GitOps

NihonGO는 Kubernetes manifest를 Git에 선언하고 ArgoCD가 이를 감시하는 GitOps 흐름을 구성했습니다.

## 목표

- Kubernetes 상태를 Git repository에 선언
- 수동 `kubectl apply` 의존도를 줄이고 Git 변경을 배포 기준으로 사용
- image tag 변경 이력을 Git commit으로 추적
- ArgoCD self-heal로 drift를 복구

## ArgoCD Application

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: nihongo-backend
  namespace: argocd
spec:
  source:
    repoURL: https://github.com/HJ1235/nihongo.git
    targetRevision: main
    path: k8s/backend
  destination:
    server: https://kubernetes.default.svc
    namespace: nihongo
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## GitOps 대상 리소스

`k8s/backend/kustomization.yaml`은 GitOps 대상 리소스만 포함합니다.

- `deployment.yaml`
- `service.yaml`

Secret local 파일은 포함하지 않습니다.

## Secret 처리 방식

`nihongo-backend-secret`은 Deployment가 참조하지만 GitOps가 생성하거나 덮어쓰지 않습니다.

원칙:

- 실제 Secret 값은 Git에 커밋하지 않습니다.
- `secret.local.yaml`은 로컬 적용 전용입니다.
- `secret.example.yaml`은 placeholder 예시만 제공합니다.
- ArgoCD Application path에 실제 Secret manifest를 포함하지 않습니다.

## Image Update 흐름

```text
GitHub Actions
  |
  v
GHCR push
  |
  v
deployment.yaml image tag update
  |
  v
Git commit
  |
  v
ArgoCD sync
```

Deployment image는 short SHA tag를 사용합니다.

```yaml
image: ghcr.io/hj1235/nihongo-backend:<short-sha>
```

## 운영 확인 명령어

```powershell
kubectl -n argocd get app
kubectl -n nihongo get deploy,svc,pod
kubectl -n nihongo describe deploy nihongo-backend
```

ArgoCD CLI 사용 시:

```powershell
argocd app get nihongo-backend
argocd app sync nihongo-backend
argocd app wait nihongo-backend --health
```

## 설계 포인트

- Git이 배포 상태의 source of truth가 됩니다.
- Secret은 GitOps에서 분리해 보안 사고 가능성을 줄였습니다.
- image tag를 short SHA로 고정해 `latest` 캐시 문제와 배포 추적 문제를 줄였습니다.
- ArgoCD 자동 sync와 self-heal을 통해 drift를 복구할 수 있습니다.
