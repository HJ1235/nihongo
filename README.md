# NihonGO

NihonGO는 히라가나와 가타카나를 학습하고, 퀴즈와 오답 복습을 통해 일본어 문자를 반복해서 익히는 일본어 학습 플랫폼입니다.

백엔드는 Spring Boot 기반 REST API로 구성되어 있으며 JWT 인증, 학습 진행률, 오답노트, Swagger API 문서를 제공합니다. 프론트엔드는 Vite + React + TypeScript 기반으로 모바일 우선 UI와 카드형 학습 경험을 제공합니다.

## 주요 기능

- 회원가입 및 로그인
- JWT 기반 인증
- 내 정보 조회
- 히라가나/가타카나 학습 목록 조회
- 랜덤 퀴즈 출제
- 정답 시 학습 진행률 자동 저장
- 오답 시 오답노트 자동 저장
- 오답 복습 퀴즈
- 복습 정답 시 오답노트 자동 삭제
- 학습 진행률 조회
- 대시보드 요약
- Swagger UI 기반 API 문서 및 테스트
- 프론트엔드 로고 적용 및 반응형 UI

## 기술 스택

### Backend

| 구분 | 기술 |
| --- | --- |
| Language | Java 21 |
| Framework | Spring Boot 3.x |
| Security | Spring Security, JWT |
| Database | PostgreSQL |
| ORM | Spring Data JPA, Hibernate |
| Validation | Bean Validation |
| API Docs | springdoc-openapi, Swagger UI |
| Build | Gradle |

### Frontend

| 구분 | 기술 |
| --- | --- |
| Build Tool | Vite |
| UI | React, TypeScript |
| Routing | React Router |
| HTTP Client | Axios |
| Styling | Tailwind CSS, shadcn/ui 스타일 컴포넌트 |

### Infra

| 구분 | 기술 |
| --- | --- |
| Database Runtime | Docker Compose |
| DB Image | PostgreSQL 17 |

## 아키텍처 구조

```text
Client
  |
  | HTTP / JSON
  v
Frontend (Vite + React + TypeScript)
  |
  | Axios API Client
  v
Backend (Spring Boot REST API)
  |
  | Spring Security + JWT
  |
  | Spring Data JPA
  v
PostgreSQL 17 (Docker Compose)
```

인증이 필요한 API는 `Authorization: Bearer <accessToken>` 헤더를 사용합니다. 로그인과 회원가입, 헬스체크, Swagger 문서 경로는 인증 없이 접근할 수 있습니다.

## 폴더 구조

```text
Nihongo/
├─ backend/
│  ├─ src/main/java/com/nihongo/backend/
│  │  ├─ dashboard/
│  │  ├─ domain/
│  │  ├─ global/
│  │  │  ├─ config/
│  │  │  ├─ exception/
│  │  │  ├─ response/
│  │  │  └─ security/
│  │  ├─ health/
│  │  ├─ lesson/
│  │  ├─ progress/
│  │  ├─ quiz/
│  │  ├─ user/
│  │  └─ wrongnote/
│  ├─ src/main/resources/
│  └─ build.gradle
├─ frontend/
│  ├─ public/
│  │  └─ logo.png
│  ├─ src/
│  │  ├─ api/
│  │  ├─ auth/
│  │  ├─ components/
│  │  └─ pages/
│  ├─ package.json
│  └─ vite.config.ts
├─ infra/
│  └─ docker/
│     └─ docker-compose.yml
└─ README.md
```

## 실행 방법

### 1. PostgreSQL 실행

```powershell
cd infra/docker
docker compose up -d
```

PostgreSQL 컨테이너 정보:

| 항목 | 값 |
| --- | --- |
| Container | `nihongo-postgres` |
| Image | `postgres:17` |
| Port | `5432:5432` |
| Database | `nihongo` |
| Username | `nihongo` |
| Password | `<local-db-password>` |

### 2. Backend 실행

```powershell
cd backend
.\gradlew.bat bootRun
```

빌드 확인:

```powershell
cd backend
.\gradlew.bat build
```

기본 실행 주소:

```text
http://localhost:8080
```

### 3. Frontend 실행

```powershell
cd frontend
npm install
npm run dev
```

빌드 확인:

```powershell
cd frontend
npm run build
```

기본 실행 주소:

```text
http://localhost:5173
```

## 환경 변수 또는 설정 정보

현재 개발 환경 설정은 `backend/src/main/resources/application-dev.yml`에 정의되어 있습니다.

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/<database>
    username: nihongo
    password: <local-db-password>
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

프론트엔드는 Axios API 클라이언트를 통해 백엔드 API와 통신합니다. 개발 서버 기본 포트는 `5173`이며, 백엔드 CORS 설정에서 `http://localhost:5173` 접근을 허용합니다.

## API 문서 URL

백엔드 실행 후 아래 주소로 Swagger 문서에 접근할 수 있습니다.

| 구분 | URL |
| --- | --- |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |
| OpenAPI JSON | `http://localhost:8080/v3/api-docs` |

Swagger UI 우측 상단의 `Authorize` 버튼을 통해 JWT Bearer 토큰을 입력하면 인증이 필요한 API도 테스트할 수 있습니다.

## 주요 API 목록

### Health

| Method | Endpoint | 설명 | 인증 |
| --- | --- | --- | --- |
| GET | `/api/health` | 서버 상태 확인 | 불필요 |

### User

| Method | Endpoint | 설명 | 인증 |
| --- | --- | --- | --- |
| POST | `/api/users/signup` | 회원가입 | 불필요 |
| POST | `/api/users/login` | 로그인 및 JWT 발급 | 불필요 |
| GET | `/api/users/me` | 내 정보 조회 | 필요 |

### Lessons

| Method | Endpoint | 설명 | 인증 |
| --- | --- | --- | --- |
| GET | `/api/lessons` | 학습 목록 조회, `type=HIRAGANA/KATAKANA` 필터 지원 | 필요 |
| GET | `/api/lessons/{lessonId}` | 학습 단건 조회 | 필요 |

### Quiz

| Method | Endpoint | 설명 | 인증 |
| --- | --- | --- | --- |
| GET | `/api/quiz/random` | 랜덤 퀴즈 조회 | 필요 |
| GET | `/api/quiz/review/random` | 오답 복습 퀴즈 조회 | 필요 |
| POST | `/api/quiz/answer` | 퀴즈 답안 제출 | 필요 |

### Progress

| Method | Endpoint | 설명 | 인증 |
| --- | --- | --- | --- |
| GET | `/api/progress` | 완료한 학습 목록 조회 | 필요 |
| POST | `/api/progress/complete` | 학습 완료 처리 | 필요 |

### Dashboard

| Method | Endpoint | 설명 | 인증 |
| --- | --- | --- | --- |
| GET | `/api/dashboard` | 전체 학습 현황 요약 | 필요 |

### Wrong Notes

| Method | Endpoint | 설명 | 인증 |
| --- | --- | --- | --- |
| GET | `/api/wrong-notes` | 오답노트 목록 조회 | 필요 |
| DELETE | `/api/wrong-notes/{lessonId}` | 오답노트 삭제 | 필요 |

## 화면 구성

| 화면 | 경로 | 설명 |
| --- | --- | --- |
| LoginPage | `/login` | 로그인 화면, 로고 및 브랜드 문구 표시 |
| SignupPage | `/signup` | 회원가입 화면, 로고 및 브랜드 문구 표시 |
| DashboardPage | `/dashboard` | 전체 학습 수, 완료 수, 진행률 요약 |
| LessonsPage | `/lessons` | 히라가나/가타카나 학습 카드 목록 |
| QuizPage | `/quiz` | 랜덤 퀴즈 풀이 |
| Review Quiz | `/quiz/review` | 오답노트 기반 복습 퀴즈 |
| WrongNotesPage | `/wrong-notes` | 오답 문자 목록과 삭제 |
| ProgressPage | `/progress` | 학습 진행률과 완료 목록 |
| AppLayout | 공통 레이아웃 | 헤더, 내비게이션, 사용자 메뉴 |

## 개발 진행 상태

- Backend REST API 구현 완료
- JWT 인증 및 Security 설정 완료
- PostgreSQL Docker Compose 설정 완료
- Frontend 주요 페이지 구현 완료
- 로고 적용 완료
- Swagger API 문서 적용 완료
- Backend build 성공
- Frontend build 성공

## 향후 개선사항

- Refresh Token 도입
- 사용자별 목표 학습량 및 streak 기능
- 관리자용 학습 데이터 관리 기능
- JLPT 레벨별 콘텐츠 확장
- 단어/문장 학습 모드 추가
- 테스트 코드 보강
- 배포 환경용 Dockerfile 및 CI/CD 구성
- 운영 환경용 환경 변수 분리
- API 응답 에러 코드 표준화

## 트러블슈팅

### npm.ps1 실행 정책 문제

Windows PowerShell에서 `npm` 실행 시 아래와 같은 오류가 발생할 수 있습니다.

```text
npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

해결 방법:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

또는 `npm.cmd`를 직접 실행할 수 있습니다.

```powershell
npm.cmd install
npm.cmd run dev
```

### PostgreSQL 계정 문제

백엔드 실행 시 DB 인증 오류가 발생하면 Docker Compose 설정과 `application.yml`의 값이 같은지 확인합니다.

```text
Database: nihongo
Username: nihongo
Password: <local-db-password>
Port: 5432
```

컨테이너 상태 확인:

```powershell
docker ps
docker logs nihongo-postgres
```

기존 컨테이너에 다른 계정 정보가 남아 있다면 컨테이너와 볼륨을 정리한 뒤 다시 실행합니다.

```powershell
cd infra/docker
docker compose down -v
docker compose up -d
```

### CORS 문제

프론트엔드에서 API 호출 시 CORS 오류가 발생하면 백엔드 CORS 허용 Origin을 확인합니다.

현재 개발 환경에서 허용된 Origin:

```text
http://localhost:3000
http://localhost:5173
```

프론트엔드 개발 서버가 다른 포트에서 실행 중이면 `SecurityConfig`의 CORS 설정에 해당 Origin을 추가해야 합니다.

## 빌드 명령어 요약

```powershell
# Backend
cd backend
.\gradlew.bat build

# Frontend
cd frontend
npm run build
```
