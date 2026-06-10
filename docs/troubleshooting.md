# Troubleshooting

NihonGO를 Docker, Kubernetes, ArgoCD, GitHub Actions, GHCR, OpenAI와 연동하면서 해결한 주요 문제를 정리합니다.

## GHCR Private Registry 인증 문제

### 증상

Kubernetes Pod가 GHCR private image를 pull하지 못하고 `ImagePullBackOff` 상태가 되었습니다.

### 원인

Deployment가 private registry image를 사용하지만 Kubernetes namespace에 image pull secret이 연결되어 있지 않았습니다.

### 해결

Deployment에 `imagePullSecrets`를 추가했습니다.

```yaml
spec:
  template:
    spec:
      imagePullSecrets:
        - name: ghcr-pull-secret
```

실제 registry credential은 Kubernetes Secret으로 별도 생성하며 Git에 커밋하지 않습니다.

## Short SHA ImagePullBackOff

### 증상

`deployment.yaml`은 short SHA tag로 변경되었지만, 해당 tag image를 Kubernetes가 pull하지 못했습니다.

### 원인

Docker push에 사용한 tag와 manifest에 기록한 tag가 일치하지 않거나, push 완료 전에 manifest가 변경될 수 있는 구조였습니다.

### 해결

GitHub Actions에서 `SHORT_SHA`를 workflow 시작 시 한 번만 생성하고 모든 step에서 동일하게 사용했습니다. 또한 `docker pull ghcr.io/hj1235/nihongo-backend:${SHORT_SHA}` 검증이 성공한 경우에만 `deployment.yaml`을 갱신하도록 변경했습니다.

## ArgoCD가 Secret을 Placeholder로 되돌리는 문제

### 증상

실제 Secret을 수동으로 수정하면 잠시 정상 동작했지만, ArgoCD sync 이후 다시 placeholder 값으로 돌아갔습니다.

### 원인

GitOps 대상 경로에 placeholder Secret manifest가 포함되면 ArgoCD가 이를 실제 상태로 복구합니다.

### 해결

`k8s/backend/kustomization.yaml`에서 실제 Secret 파일과 example Secret 파일을 제외했습니다. GitOps는 Deployment와 Service만 관리하고, 실제 Secret은 클러스터에 별도로 적용합니다.

## Service Port Forward 오류

### 증상

```text
Pod does not have a named port 'http'
```

### 원인

Service가 `targetPort: http`를 사용했지만 live Pod의 container port에 `name: http`가 없거나 이전 live state와 manifest가 섞여 있었습니다.

### 해결

Service를 숫자 기반 targetPort로 안정화했습니다.

```yaml
ports:
  - name: http
    port: 80
    targetPort: 8080
```

## OpenAI Responses API 파싱 오류

### 증상

Spring `RestClient`가 OpenAI 응답을 `JsonNode`로 바로 변환하는 과정에서 message conversion 오류가 발생했습니다.

### 원인

응답 구조가 복잡하고 converter가 `JsonNode`를 직접 구성하지 못했습니다.

### 해결

응답을 먼저 `String`으로 받고 `ObjectMapper.readTree()`로 명시적으로 파싱했습니다. 또한 OpenAI 4xx/5xx 응답 status와 body를 로그로 남기되 API Key와 Authorization header는 로그에 남기지 않도록 했습니다.

## Mock 교정 품질 문제

### 증상

MockCorrectionGenerator가 일본어 문장 끝에 무조건 `です`를 붙여 `来ましたです` 같은 잘못된 표현을 만들었습니다.

### 원인

이미 `です`, `ます`, `ました`, `ません`으로 끝나는 문장에 대한 예외 처리가 없었습니다.

### 해결

정중체 종결 표현이 이미 있는 문장에는 `です`를 추가하지 않도록 수정했습니다. 워킹홀리데이의 전입신고 문맥은 자연스러운 창구 표현으로 별도 처리했습니다.

## Docker Desktop Kubernetes와 Ingress-NGINX

### 내용

Docker Desktop Kubernetes 환경에서도 Ingress-NGINX를 설치하고 `api.nihongotest.shop` host 기반 Ingress manifest를 준비했습니다.

로컬 검증 시에는 hosts 파일 또는 DNS 설정이 필요하며, TLS는 아직 적용하지 않았습니다.
