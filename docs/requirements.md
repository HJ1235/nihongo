# NihonGo 요구사항 정의서 v1

## 1. 프로젝트 개요

### 프로젝트명

NihonGo

### 프로젝트 목적

한국인 일본어 학습자를 대상으로 AI 기반 일본어 학습 서비스를 제공한다.

사용자는 번역, 첨삭, 원어민 표현 추천, JLPT 수준 분석 기능을 이용하여 일본어 학습 효율을 높일 수 있다.

### 서비스 목표

* 실제 운영 가능한 SaaS 구축
* AI 기반 일본어 학습 서비스 제공
* 회원 기반 서비스 운영
* 학습 기록 저장 및 관리
* HTTPS 기반 서비스 제공
* 모니터링 및 장애 대응 체계 구축
* 비용 최적화를 고려한 클라우드 운영

---

## 2. MVP 범위

### AI 기능

* 한국어 → 일본어 번역
* 일본어 첨삭
* 원어민 표현 추천
* JLPT 수준 분석

### 학습 기능

* 학습 기록 저장
* 학습 기록 조회

### 학습 지원 기능

* 일본어 자판 설정 가이드

  * Windows
  * macOS
  * iPhone
  * Android

### 회원 기능

* 회원가입
* 로그인
* 로그아웃
* 내 정보 조회

---

## 3. 사용자 시나리오

### 회원가입

사용자는 이메일을 이용하여 회원가입을 진행한다.

### 로그인

사용자는 로그인 후 서비스를 이용할 수 있다.

### 번역

1. 사용자가 한국어 문장을 입력한다.
2. AI가 일본어 번역 결과를 제공한다.
3. 결과는 학습 기록으로 저장된다.

### 첨삭

1. 사용자가 일본어 문장을 입력한다.
2. AI가 문법 및 표현을 교정한다.
3. 결과는 학습 기록으로 저장된다.

### 원어민 표현 추천

1. 사용자가 일본어 문장을 입력한다.
2. AI가 보다 자연스러운 원어민 표현을 추천한다.
3. 결과는 학습 기록으로 저장된다.

### JLPT 분석

1. 사용자가 문장을 입력한다.
2. AI가 문장의 예상 JLPT 수준을 분석한다.
3. 결과는 학습 기록으로 저장된다.

### 학습 기록 조회

사용자는 과거 학습 기록을 조회하고 복습할 수 있다.

---

## 4. 화면 목록

### 랜딩 페이지

* 서비스 소개
* 회원가입 유도
* 로그인 유도

### 회원가입

* 이메일 가입
* 비밀번호 설정

### 로그인

* 이메일 로그인

### 대시보드

* 기능 선택
* 최근 학습 기록 표시

### AI 학습 화면

* 번역
* 첨삭
* 원어민 표현 추천
* JLPT 분석

### 학습 기록

* 학습 기록 목록 조회
* 학습 기록 상세 조회

### 자판 설정 가이드

* Windows 일본어 자판 설정
* macOS 일본어 자판 설정
* iPhone 일본어 자판 설정
* Android 일본어 자판 설정

### 마이페이지

* 내 정보 조회
* 비밀번호 변경
* 사용량 조회

---

## 5. 시스템 구성

### Frontend

* Next.js
* TypeScript
* S3
* CloudFront

### Backend

* NestJS
* TypeScript
* JWT 인증
* Swagger

### Database

* RDS PostgreSQL
* Prisma ORM

### 비동기 처리

* SQS
* Lambda Worker
* DLQ

### 인프라

* Route53
* ACM
* CloudFront
* S3
* VPC
* EKS
* RDS PostgreSQL
* SQS
* Lambda
* CloudWatch
* Terraform

---

## 6. DB 구성

### users

회원 정보 저장

주요 컬럼

* id
* email
* password_hash
* nickname
* role
* created_at
* updated_at

### ai_requests

AI 요청, 결과, 학습 기록 저장

주요 컬럼

* id
* user_id
* request_type
* input_text
* result_text
* explanation
* jlpt_level
* status
* error_message
* created_at
* completed_at

### usage_logs

AI 사용량 및 비용 추적

주요 컬럼

* id
* ai_request_id
* request_type
* token_input
* token_output
* estimated_cost
* created_at

---

## 7. ERD 구조

users
│
└── ai_requests
│
└── usage_logs

관계

* users.id → ai_requests.user_id (1:N)
* ai_requests.id → usage_logs.ai_request_id (1:1)

---

## 8. API 구성

### 인증 API

POST /auth/signup
POST /auth/login
GET /auth/me

### AI API

POST /ai/requests
GET /ai/requests/{id}

### 학습 기록 API

GET /history
GET /history/{id}

### 사용량 API

GET /usage/me

---

## 9. AI 처리 방식

### 동기 처리

* 한국어 → 일본어 번역
* JLPT 수준 분석

처리 흐름

Frontend → Backend(EKS) → AI API → Backend → 사용자

### 비동기 처리

* 일본어 첨삭
* 원어민 표현 추천

처리 흐름

Frontend → Backend → RDS 저장(PENDING) → SQS → Lambda Worker → AI API → RDS 업데이트

결과 조회

GET /ai/requests/{id}

---

## 10. 최종 아키텍처

User
↓
Route53
↓
CloudFront + ACM
↓
S3 (Next.js Frontend)
↓
Backend API (NestJS on EKS)
↓
RDS PostgreSQL

비동기 처리

Backend
↓
SQS
↓
Lambda Worker
↓
AI API
↓
RDS PostgreSQL

운영 및 모니터링

EKS
Lambda
RDS
↓
CloudWatch Logs / Metrics
↓
Prometheus
↓
Grafana
↓
Alert

---

## 11. MVP 완료 기준

* 회원가입 및 로그인 가능
* 번역 기능 제공
* 첨삭 기능 제공
* 원어민 표현 추천 기능 제공
* JLPT 분석 기능 제공
* 학습 기록 저장 및 조회 가능
* 일본어 자판 설정 가이드 제공
* HTTPS 적용
* EKS 운영 환경 구축
* Terraform IaC 적용
* CI/CD 구축
* 모니터링 구축
* 실제 사용자 접속 가능
