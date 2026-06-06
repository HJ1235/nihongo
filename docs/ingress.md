# NihonGO Ingress

Docker Desktop Kubernetes 환경에서 NihonGO backend를 `api.nihongotest.shop` 도메인으로 접근하기 위한 Ingress 설정 문서입니다.

## 전제 조건

- Docker Desktop Kubernetes 활성화
- Kubernetes context: `docker-desktop`
- Namespace: `nihongo`
- Backend Service:
  - name: `nihongo-backend`
  - port: `80`
- Domain: `api.nihongotest.shop`

## Ingress-NGINX 설치

Docker Desktop Kubernetes에서 ingress-nginx controller를 설치합니다.

```powershell
kubectl config use-context docker-desktop
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/cloud/deploy.yaml
```

Controller Pod가 준비될 때까지 확인합니다.

```powershell
kubectl get pods -n ingress-nginx
kubectl wait --namespace ingress-nginx `
  --for=condition=ready pod `
  --selector=app.kubernetes.io/component=controller `
  --timeout=180s
```

## Backend Ingress 적용

Ingress manifest:

```text
k8s/ingress/backend-ingress.yaml
```

적용:

```powershell
kubectl apply -f k8s/ingress/backend-ingress.yaml
```

확인:

```powershell
kubectl -n nihongo get ingress
kubectl -n nihongo describe ingress nihongo-backend
```

## 로컬 도메인 연결

Docker Desktop Kubernetes에서 로컬 테스트를 할 경우 `hosts` 파일에 도메인을 연결합니다.

관리자 권한 PowerShell 또는 편집기로 아래 파일을 수정합니다.

```text
C:\Windows\System32\drivers\etc\hosts
```

예시:

```text
127.0.0.1 api.nihongotest.shop
```

## 동작 확인

```powershell
Invoke-RestMethod http://api.nihongotest.shop/api/health
```

정상 응답 예시:

```json
{
  "success": true,
  "message": null,
  "data": "OK"
}
```

## 참고

- 현재 manifest에는 TLS 설정을 포함하지 않습니다.
- AWS/EKS 전용 annotation은 사용하지 않습니다.
- Secret은 생성하지 않습니다.
- 운영 환경에서 HTTPS를 적용할 때는 별도 TLS 정책을 설계합니다.
