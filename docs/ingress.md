# Ingress-NGINX and Local HTTPS

NihonGO backend를 Docker Desktop Kubernetes 환경에서 `api.nihongotest.shop` 도메인으로 접근하기 위한 Ingress 설정 문서입니다.

현재 목적은 포트폴리오용 HTTPS 구조 검증입니다. 실제 운영 인증서가 아닌 self-signed TLS 인증서를 사용하며, Let's Encrypt, cert-manager, Route53, ACM은 아직 사용하지 않습니다.

## 현재 환경

- Kubernetes: Docker Desktop Kubernetes
- Ingress Controller: ingress-nginx
- Namespace: `nihongo`
- Backend Service: `nihongo-backend`
- Service Port: `80`
- Host: `api.nihongotest.shop`
- hosts 설정: `api.nihongotest.shop -> 127.0.0.1`

## Ingress Manifest

파일:

```text
k8s/ingress/backend-ingress.yaml
```

핵심 설정:

```yaml
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - api.nihongotest.shop
      secretName: nihongo-backend-tls
  rules:
    - host: api.nihongotest.shop
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nihongo-backend
                port:
                  number: 80
```

`nihongo-backend-tls` Secret은 Git에 커밋하지 않고 로컬 Kubernetes 클러스터에 직접 생성합니다.

## Self-Signed 인증서 생성

PowerShell에서 OpenSSL을 사용할 수 있는 환경 기준입니다.

```powershell
mkdir .local-certs
openssl req -x509 -nodes -days 365 `
  -newkey rsa:2048 `
  -keyout .local-certs\api.nihongotest.shop.key `
  -out .local-certs\api.nihongotest.shop.crt `
  -subj "/CN=api.nihongotest.shop/O=NihonGO Local"
```

생성되는 인증서와 키 파일은 Git에 커밋하지 않습니다.

`.gitignore`에는 다음 확장자를 제외하도록 설정합니다.

```text
*.crt
*.key
*.pem
```

## Kubernetes TLS Secret 생성

생성한 인증서와 키를 Kubernetes TLS Secret으로 등록합니다.

```powershell
kubectl -n nihongo create secret tls nihongo-backend-tls `
  --cert=.local-certs\api.nihongotest.shop.crt `
  --key=.local-certs\api.nihongotest.shop.key
```

이미 Secret이 있으면 삭제 후 다시 생성합니다.

```powershell
kubectl -n nihongo delete secret nihongo-backend-tls
kubectl -n nihongo create secret tls nihongo-backend-tls `
  --cert=.local-certs\api.nihongotest.shop.crt `
  --key=.local-certs\api.nihongotest.shop.key
```

## Ingress TLS 적용

이 문서 작업에서는 `kubectl apply`를 실행하지 않습니다. 실제 로컬 검증 시에는 아래 명령으로 적용합니다.

```powershell
kubectl apply -f k8s/ingress/backend-ingress.yaml
kubectl -n nihongo get ingress
kubectl -n nihongo describe ingress nihongo-backend
```

## HTTPS 테스트

PowerShell:

```powershell
Invoke-WebRequest https://api.nihongotest.shop/api/health -SkipCertificateCheck
```

브라우저:

```text
https://api.nihongotest.shop/api/health
```

정상 응답 예시:

```json
{
  "success": true,
  "message": null,
  "data": "OK"
}
```

## Self-Signed 인증서 경고

브라우저는 공인 CA가 서명하지 않은 self-signed 인증서를 신뢰하지 않습니다. 따라서 로컬 HTTPS 테스트 시 보안 경고가 표시됩니다.

이 경고는 로컬 검증 환경에서는 정상적인 현상입니다. 운영 환경에서는 self-signed 인증서를 사용하지 않습니다.

## 운영 전환 방향

AWS EKS 운영 환경에서는 다음 중 하나로 전환합니다.

- EKS + AWS Load Balancer Controller + ALB + ACM 인증서
- Ingress-NGINX + cert-manager + DNS-01 challenge

운영 인증서와 DNS 설정은 Terraform 또는 별도 GitOps manifest로 분리해 관리합니다.
