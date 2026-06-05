# NihonGO

일본 취업, 워킹홀리데이, JLPT 학습자를 위한 AI 기반 일본어 학습 플랫폼입니다.

NihonGO는 기초 일본어 학습부터 상황별 실습, AI 문장 교정, 학습 기록 관리까지 제공하는 웹 서비스입니다. 사용자는 자신의 학습 목적에 맞는 모드를 선택하고, 일본 취업이나 워킹홀리데이처럼 실제 상황에 가까운 표현을 연습할 수 있습니다.

## 핵심 특징

- AI 일본어 교정
- 일본 취업 모드
- 워킹홀리데이 모드
- 상황별 실습
- 관리자 운영 기능

## 배포 URL

| 구분 | URL |
| --- | --- |
| Frontend | https://nihongotest.shop |
| Backend | https://api.nihongotest.shop |
| Swagger | https://api.nihongotest.shop/swagger-ui.html |

## 기술 스택

### Frontend

- React
- TypeScript
- Vite

### Backend

- Spring Boot
- Java 21
- JWT

### Database

- Neon PostgreSQL

### Deployment

- Vercel
- Render

### AI

- MockCorrectionGenerator
- OpenAiCorrectionGenerator
- GeminiCorrectionGenerator 확장 구조
- 환경변수 기반 Provider 선택
- OpenAI 실패 시 Mock fallback

## 주요 기능

### 인증

- 회원가입
- 로그인
- JWT 인증

### 학습

- Lessons
- Quiz
- Progress
- Wrong Notes

### AI

- 일본어 교정
- 교정 기록
- 교정 통계

### 추천 학습

- 일본 취업
- 워킹홀리데이
- 일상생활
- JLPT

### 운영

- 공지사항
- 회원 제재
- 관리자 대시보드

## 프로젝트 구조

```text
Nihongo/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── styles.css
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/main/java/com/nihongo/backend/
│   │   ├── admin/
│   │   ├── correction/
│   │   ├── domain/
│   │   ├── global/
│   │   ├── lesson/
│   │   ├── notice/
│   │   ├── quiz/
│   │   ├── recommendation/
│   │   └── user/
│   ├── src/main/resources/
│   └── build.gradle
├── infra/
├── docs/
└── render.yaml
```

## 문서

- [ERD 문서](docs/erd.md)
- [API 명세](docs/api.md)

## 아키텍처 개요

```text
React (Vercel)
      ↓
Spring Boot (Render)
      ↓
Neon PostgreSQL
```

### AI 교정 구조

```text
AI 교정 요청
      ↓
Correction Provider
      ↓
Mock / OpenAI / Gemini
```

CorrectionGenerator 인터페이스를 기준으로 Mock, OpenAI, Gemini Provider를 분리했습니다. API Key가 없거나 Provider가 mock으로 설정된 경우 MockCorrectionGenerator로 동작하며, 실제 AI 요청 실패 시에도 Mock 결과로 fallback할 수 있도록 구성했습니다.

현재 NihonGO는 OpenAI Responses API 기반 실제 일본어 교정을 지원합니다. `AI_CORRECTION_PROVIDER=openai`와 `OPENAI_API_KEY`가 Render 환경변수에 설정되어 있으면 GPT 기반 교정 결과를 생성하며, API 키가 없거나 quota 부족, 모델 오류, 응답 파싱 실패 등으로 호출에 실패하면 MockCorrectionGenerator 결과로 자동 대체됩니다.

## 주요 화면

### 로그인

이미지 예정

### 추천 학습

이미지 예정

### AI 교정

이미지 예정

### 관리자 대시보드

이미지 예정

## 실행 방법

### Backend

```powershell
cd backend
.\gradlew.bat build
.\gradlew.bat bootRun
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

## 환경 변수

### Backend

```text
SPRING_PROFILES_ACTIVE=prod
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
CORS_ALLOWED_ORIGINS=https://nihongotest.shop
AI_CORRECTION_PROVIDER=mock
OPENAI_API_KEY=
OPENAI_CORRECTION_MODEL=gpt-5.2
OPENAI_BASE_URL=https://api.openai.com/v1
GEMINI_API_KEY=
```

`AI_CORRECTION_PROVIDER`는 `mock`, `openai`, `gemini` 중 하나로 설정합니다. 실제 OpenAI API Key는 코드나 문서에 저장하지 않고 Render 환경변수에만 등록합니다.

### Frontend

```text
VITE_API_BASE_URL=https://api.nihongotest.shop
```

## 향후 개선 계획

- OpenAI 운영 안정화
- Gemini Provider 활성화
- 관리자 통계 확장
- 학습 추천 고도화
- 교정 분석 리포트

## 프로젝트 의의

NihonGO는 단순한 문자 학습 서비스를 넘어, 일본 취업과 워킹홀리데이처럼 목적이 분명한 학습자를 위한 실습형 일본어 학습 경험을 목표로 합니다. 인증, 학습 기록, AI 교정, 추천 학습, 관리자 운영 기능까지 하나의 서비스 흐름으로 구성해 실제 서비스에 가까운 구조로 구현했습니다.
