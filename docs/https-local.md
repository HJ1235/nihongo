# Local HTTPS Verification

이 문서는 Docker Desktop Kubernetes에서 NihonGO backend HTTPS 구조를 self-signed 인증서로 검증하는 절차를 정리합니다.

자세한 Ingress 설정은 [Ingress-NGINX 문서](ingress.md)를 참고하세요.

## 검증 목표

- `https://api.nihongotest.shop/api/health` 요청 확인
- ingress-nginx TLS termination 구조 검증
- 운영 인증서 없이 로컬 HTTPS 흐름만 확인

## 주의사항

- self-signed 인증서는 운영용이 아닙니다.
- 인증서 파일은 Git에 커밋하지 않습니다.
- Kubernetes TLS Secret은 로컬 클러스터에 직접 생성합니다.
- Let's Encrypt, cert-manager, Route53, ACM은 아직 사용하지 않습니다.

## 빠른 검증 명령

```powershell
mkdir .local-certs
openssl req -x509 -nodes -days 365 `
  -newkey rsa:2048 `
  -keyout .local-certs\api.nihongotest.shop.key `
  -out .local-certs\api.nihongotest.shop.crt `
  -subj "/CN=api.nihongotest.shop/O=NihonGO Local"

kubectl -n nihongo create secret tls nihongo-backend-tls `
  --cert=.local-certs\api.nihongotest.shop.crt `
  --key=.local-certs\api.nihongotest.shop.key

kubectl apply -f k8s/ingress/backend-ingress.yaml
Invoke-WebRequest https://api.nihongotest.shop/api/health -SkipCertificateCheck
```
