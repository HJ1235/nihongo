# NihonGO

일본어 기초 학습을 위한 웹 기반 학습 플랫폼입니다.  
히라가나/가타카나 학습, 퀴즈, 진도 관리, 오답노트, 공지사항, 관리자 회원 관리 기능을 제공합니다.

## 배포 URL

| 구분 | URL |
| --- | --- |
| Frontend | https://nihongo-plum-chi.vercel.app |
| Backend | https://nihongo-backend-hsca.onrender.com |
| Frontend Production 예정 | https://nihongotest.shop |
| Backend Production 예정 | https://api.nihongotest.shop |
| 보유 도메인 | `nihongotest.shop` |

## 프로젝트 소개

NihonGO는 일본어 입문자가 문자와 기본 단어를 반복 학습할 수 있도록 만든 학습 서비스입니다.  
사용자는 히라가나/가타카나를 학습하고 퀴즈를 풀며, 정답 여부에 따라 진도와 오답노트가 자동으로 관리됩니다.

운영 관점에서는 공지사항, 공지 상단 고정, 회원 정지/활성화, 관리자 페이지를 제공하여 서비스 관리 기능까지 확장했습니다.

## 주요 기능

### 인증

- 회원가입
- 로그인
- JWT 기반 인증
- 정지 회원 로그인 차단

### 학습

- 히라가나 학습
- 가타카나 학습
- 랜덤 퀴즈
- 학습 진도 관리
- 오답노트 자동 저장
- 오답 복습 퀴즈
- 대시보드
- JLPT N5 단어 학습
- JLPT N5 단어 퀴즈

### 운영 및 관리자

- 공지사항 목록/상세 조회
- 공지사항 작성/수정/삭제
- 공지사항 상단 고정
- 회원 목록 조회
- 회원 상세 조회
- 회원 정지
- 회원 활성화
- 관리자 페이지

## 기술 스택

### Frontend

| 기술 | 설명 |
| --- | --- |
| React | 사용자 인터페이스 구현 |
| Vite | 프론트엔드 빌드 도구 |
| TypeScript | 정적 타입 기반 개발 |
| React Router | 페이지 라우팅 |
| Axios | API 통신 |

### Backend

| 기술 | 설명 |
| --- | --- |
| Spring Boot 4 Snapshot | 백엔드 애플리케이션 프레임워크 |
| Java 21 | 백엔드 개발 언어 |
| Spring Security | 인증/보안 처리 |
| JWT | 토큰 기반 인증 |
| Spring Data JPA | 데이터 접근 계층 |
| Swagger / OpenAPI | API 문서화 |

### Database

| 기술 | 설명 |
| --- | --- |
| Neon PostgreSQL | 배포 환경 PostgreSQL 데이터베이스 |
| PostgreSQL Docker | 로컬 개발용 데이터베이스 |

### Infra

| 기술 | 설명 |
| --- | --- |
| Vercel | Frontend 배포 |
| Render | Backend 배포 |
| Neon | PostgreSQL 운영 DB |

## 시스템 아키텍처

```text
User
  |
  v
Vercel
React + Vite + TypeScript
  |
  | HTTPS / REST API
  v
Render
Spring Boot + Spring Security + JWT
  |
  | JDBC
  v
Neon PostgreSQL
```

로컬 개발 환경에서는 Frontend가 `localhost:5173`, Backend가 `localhost:8080`, PostgreSQL이 Docker Compose 기반 `localhost:5432`에서 실행됩니다.

## ERD

현재 ERD 문서는 준비 중입니다.

TODO:

- users
- kana_lessons
- user_lesson_progress
- wrong_notes
- words
- notices

## API 문서

Swagger UI:

```text
https://nihongo-backend-hsca.onrender.com/swagger-ui.html
```

OpenAPI JSON:

```text
https://nihongo-backend-hsca.onrender.com/v3/api-docs
```

## 대표 API

### Auth

| Method | Endpoint | 설명 |
| --- | --- | --- |
| POST | `/api/users/signup` | 회원가입 |
| POST | `/api/users/login` | 로그인 |
| GET | `/api/users/me` | 내 정보 조회 |

### Learning

| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/api/lessons` | 히라가나/가타카나 학습 목록 |
| GET | `/api/lessons/{lessonId}` | 학습 상세 조회 |
| GET | `/api/quiz/random` | 랜덤 퀴즈 조회 |
| POST | `/api/quiz/answer` | 퀴즈 답안 제출 |
| GET | `/api/progress` | 학습 진도 조회 |
| GET | `/api/wrong-notes` | 오답노트 조회 |

### Words

| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/api/words?level=N5` | JLPT N5 단어 목록 |
| GET | `/api/word-quiz/random?level=N5` | 단어 랜덤 퀴즈 |
| POST | `/api/word-quiz/answer` | 단어 퀴즈 답안 제출 |

### Notices

| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/api/notices` | 공지사항 목록 |
| GET | `/api/notices/{id}` | 공지사항 상세 |
| POST | `/api/admin/notices` | 관리자 공지 작성 |
| PUT | `/api/admin/notices/{id}` | 관리자 공지 수정 |
| DELETE | `/api/admin/notices/{id}` | 관리자 공지 삭제 |

### Admin Users

| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/api/admin/users` | 회원 목록 조회 |
| GET | `/api/admin/users/{id}` | 회원 상세 조회 |
| PATCH | `/api/admin/users/{id}/suspend` | 회원 정지 |
| PATCH | `/api/admin/users/{id}/activate` | 회원 활성화 |

## 화면 구성

| 화면 | 경로 | 설명 |
| --- | --- | --- |
| Login | `/login` | 로그인 |
| Signup | `/signup` | 회원가입 |
| Dashboard | `/dashboard` | 학습 요약 |
| Lessons | `/lessons` | 히라가나/가타카나 학습 |
| Quiz | `/quiz` | 문자 퀴즈 |
| Words | `/words` | JLPT N5 단어 학습 |
| Word Quiz | `/word-quiz` | JLPT N5 단어 퀴즈 |
| Progress | `/progress` | 학습 진도 |
| Wrong Notes | `/wrong-notes` | 오답노트 |
| Admin | `/admin` | 관리자 대시보드 |
| Admin Notices | `/admin/notices` | 공지사항 관리 |
| Admin Users | `/admin/users` | 회원 관리 |

## 로컬 실행 방법

### 1. PostgreSQL 실행

```powershell
cd infra/docker
docker compose up -d
```

### 2. Backend 실행

```powershell
cd backend
.\gradlew.bat bootRun
```

macOS/Linux:

```bash
cd backend
./gradlew bootRun
```

Backend 기본 주소:

```text
http://localhost:8080
```

### 3. Frontend 실행

```powershell
cd frontend
npm install
npm run dev
```

Frontend 기본 주소:

```text
http://localhost:5173
```

## 환경 변수

### Backend

운영 환경에서는 실제 값이 코드에 포함되지 않도록 환경변수로 관리합니다.

```text
SPRING_PROFILES_ACTIVE=prod
DB_URL=<Neon JDBC URL>
DB_USERNAME=<Neon username>
DB_PASSWORD=<Neon password>
JWT_SECRET=<production-jwt-secret>
CORS_ALLOWED_ORIGINS=https://nihongotest.shop,https://www.nihongotest.shop,https://nihongo-plum-chi.vercel.app
```

### Frontend

Local:

```text
VITE_API_BASE_URL=http://localhost:8080
```

Preview / current deployment:

```text
VITE_API_BASE_URL=https://nihongo-backend-hsca.onrender.com
```

Production custom domain:

```text
VITE_API_BASE_URL=https://api.nihongotest.shop
```

## 배포 환경

### Frontend

- Platform: Vercel
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable:

```text
VITE_API_BASE_URL=https://api.nihongotest.shop
```

### Backend

- Platform: Render
- Runtime: Docker
- Dockerfile: `backend/Dockerfile`
- Profile: `prod`

### Database

- Platform: Neon
- Database: PostgreSQL
- SSL: `sslmode=require`

## 운영 도메인 연결 계획

실제 DNS 레코드 값은 Vercel/Render 대시보드에서 제공하는 값을 기준으로 입력합니다. DNS 대상값은 코드에 하드코딩하지 않습니다.

1. Vercel 프로젝트에 `nihongotest.shop` 도메인 추가
2. DNS에서 `nihongotest.shop`을 Vercel이 안내하는 값으로 연결
3. Render Backend 서비스에 `api.nihongotest.shop` 커스텀 도메인 추가
4. DNS에서 `api.nihongotest.shop`을 Render가 안내하는 값으로 연결
5. Render에서 Custom Domain Verify 완료 확인
6. `https://nihongotest.shop`, `https://api.nihongotest.shop` HTTPS 접속 확인
7. Vercel 환경변수 `VITE_API_BASE_URL`을 `https://api.nihongotest.shop`으로 변경
8. Render 환경변수 `CORS_ALLOWED_ORIGINS`에 `https://nihongotest.shop`, `https://www.nihongotest.shop`, `https://nihongo-plum-chi.vercel.app` 반영
9. Vercel/Render 재배포
10. 회원가입, 로그인, 공지사항, 관리자 API 동작 테스트

## 빌드 확인

### Backend

```powershell
cd backend
.\gradlew.bat build
```

### Frontend

```powershell
cd frontend
npm run build
```

## 개발 진행 상태

- 인증 기능 구현 완료
- JWT 인증 구현 완료
- 히라가나/가타카나 학습 구현 완료
- 퀴즈/오답노트/진도 관리 구현 완료
- JLPT N5 단어 학습 구현 완료
- 공지사항 기능 구현 완료
- 관리자 회원 관리 구현 완료
- 사용자 정지/활성화 기능 구현 완료
- Render / Vercel / Neon 배포 설정 완료

## 향후 계획

- JLPT N5~N1 콘텐츠 확장
- 단어 관리 기능 고도화
- 학습 통계 및 리포트 기능
- 관리자 기능 강화
- 공지사항 에디터 개선
- 사용자 권한 기반 라우팅 고도화
- ERD 문서화
- `nihongotest.shop` 도메인 연결

## 프로젝트 의의

NihonGO는 단순 CRUD를 넘어 인증, 학습 흐름, 진도 관리, 오답 관리, 운영자 기능, 배포 환경까지 포함한 풀스택 프로젝트입니다.

특히 다음 항목을 중점적으로 구현했습니다.

- JWT 기반 인증 흐름
- 사용자 상태 기반 로그인 차단
- 관리자 권한 검증
- 학습 데이터 자동 seed
- 사용자별 진도와 오답 데이터 관리
- 프론트엔드/백엔드 분리 배포
- 환경변수 기반 운영 설정
