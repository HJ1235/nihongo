# Local HTTPS Verification

이 문서는 Docker Desktop Kubernetes에서 NihonGO backend HTTPS 구조를 self-signed 인증서로 검증하는 절차를 정리합니다.

자세한 Ingress 설정은 [Ingress-NGINX 문서](ingress.md)를 참고하세요.

## 검증 목표

- `http://api.nihongotest.shop/api/health` 요청이 308 redirect 없이 동작하는지 확인
- `https://api.nihongotest.shop/api/health` 요청이 self-signed TLS로 동작하는지 확인
- ingress-nginx TLS termination 구조 검증
- 운영 인증서 없이 로컬 HTTPS 흐름만 확인

## 로컬 테스트 기준

Vercel 프론트와 브라우저는 self-signed 인증서를 신뢰하지 않습니다. 따라서 로그인 같은 실제 기능 테스트는 HTTP 기준으로 진행합니다.

Ingress에는 다음 annotation을 추가해 HTTP 요청이 HTTPS로 강제 redirect 되지 않도록 합니다.

```yaml
nginx.ingress.kubernetes.io/ssl-redirect: "false"
nginx.ingress.kubernetes.io/force-ssl-redirect: "false"
```

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

Invoke-RestMethod http://api.nihongotest.shop/api/health
Invoke-WebRequest https://api.nihongotest.shop/api/health -SkipCertificateCheck
```
