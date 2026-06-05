# NihonGO API 명세

현재 구현된 Spring Controller 기준으로 정리한 REST API 문서입니다. 모든 응답은 `ApiResponse<T>` 형식을 사용합니다.

Swagger UI: https://api.nihongotest.shop/swagger-ui.html

## 공통 응답 형식

```json
{
  "success": true,
  "message": null,
  "data": {}
}
```

## 인증 정책

| 구분 | 설명 |
| --- | --- |
| 공개 API | `/api/health`, `/api/users/signup`, `/api/users/login`, Swagger 문서 |
| 사용자 API | `Authorization: Bearer {accessToken}` 필요 |
| 관리자 API | JWT 인증 필요, ADMIN 권한 필요 |

## Auth / User

| Method | Endpoint | 인증 | 관리자 | 설명 |
| --- | --- | --- | --- | --- |
| POST | `/api/users/signup` | 불필요 | 불필요 | 회원가입 |
| POST | `/api/users/login` | 불필요 | 불필요 | 로그인 |
| GET | `/api/users/me` | 필요 | 불필요 | 내 정보 조회 |
| GET | `/api/users/me/learning-mode` | 필요 | 불필요 | 내 학습 모드 조회 |
| PATCH | `/api/users/me/learning-mode` | 필요 | 불필요 | 내 학습 모드 변경 |

### POST /api/users/signup

Request:

```json
{
  "email": "user@example.com",
  "password": "1234",
  "nickname": "학습자"
}
```

Response:

```json
{
  "success": true,
  "message": null,
  "data": 1
}
```

### POST /api/users/login

Request:

```json
{
  "email": "user@example.com",
  "password": "1234"
}
```

Response:

```json
{
  "success": true,
  "message": null,
  "data": {
    "accessToken": "jwt-token"
  }
}
```

### GET /api/users/me

Response:

```json
{
  "success": true,
  "message": null,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "학습자"
  }
}
```

### PATCH /api/users/me/learning-mode

Request:

```json
{
  "learningMode": "WORKING_HOLIDAY"
}
```

Response:

```json
{
  "success": true,
  "message": null,
  "data": {
    "learningMode": "WORKING_HOLIDAY"
  }
}
```

## Learning

### Lessons

| Method | Endpoint | 인증 | 관리자 | 설명 |
| --- | --- | --- | --- | --- |
| GET | `/api/lessons` | 필요 | 불필요 | 레슨 목록 조회 |
| GET | `/api/lessons?type=HIRAGANA` | 필요 | 불필요 | 문자 유형별 레슨 목록 조회 |
| GET | `/api/lessons/{lessonId}` | 필요 | 불필요 | 레슨 상세 조회 |

Response example:

```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "id": 1,
      "kanaType": "HIRAGANA",
      "character": "あ",
      "romaji": "a",
      "meaning": "あ"
    }
  ]
}
```

### Quiz

| Method | Endpoint | 인증 | 관리자 | 설명 |
| --- | --- | --- | --- | --- |
| GET | `/api/quiz/random` | 필요 | 불필요 | 랜덤 문자 퀴즈 조회 |
| GET | `/api/quiz/review/random` | 필요 | 불필요 | 오답 복습 퀴즈 조회 |
| POST | `/api/quiz/answer` | 필요 | 불필요 | 문자 퀴즈 답안 제출 |

Request:

```json
{
  "lessonId": 1,
  "answer": "a"
}
```

Response:

```json
{
  "success": true,
  "message": null,
  "data": {
    "correct": true,
    "correctAnswer": "a",
    "progressCompleted": true,
    "wrongNoteResolved": false
  }
}
```

### Progress

| Method | Endpoint | 인증 | 관리자 | 설명 |
| --- | --- | --- | --- | --- |
| GET | `/api/progress` | 필요 | 불필요 | 내 학습 진도 조회 |
| POST | `/api/progress/complete` | 필요 | 불필요 | 레슨 완료 처리 |

Request:

```json
{
  "lessonId": 1
}
```

Response:

```json
{
  "success": true,
  "message": null,
  "data": {
    "lessonId": 1,
    "kanaType": "HIRAGANA",
    "character": "あ",
    "romaji": "a",
    "completedAt": "2026-06-05T12:00:00"
  }
}
```

### Wrong Notes

| Method | Endpoint | 인증 | 관리자 | 설명 |
| --- | --- | --- | --- | --- |
| GET | `/api/wrong-notes` | 필요 | 불필요 | 내 오답노트 조회 |
| DELETE | `/api/wrong-notes/{lessonId}` | 필요 | 불필요 | 오답노트 삭제 |

Response example:

```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "lessonId": 1,
      "kanaType": "HIRAGANA",
      "character": "あ",
      "romaji": "a",
      "wrongCount": 2,
      "lastWrongAt": "2026-06-05T12:00:00"
    }
  ]
}
```

### Words

| Method | Endpoint | 인증 | 관리자 | 설명 |
| --- | --- | --- | --- | --- |
| GET | `/api/words` | 필요 | 불필요 | JLPT 단어 목록 조회 |
| GET | `/api/words?level=N5` | 필요 | 불필요 | JLPT 레벨별 단어 조회 |
| GET | `/api/word-quiz/random` | 필요 | 불필요 | 단어 퀴즈 조회 |
| GET | `/api/word-quiz/random?level=N5` | 필요 | 불필요 | JLPT 레벨별 단어 퀴즈 조회 |
| POST | `/api/word-quiz/answer` | 필요 | 불필요 | 단어 퀴즈 답안 제출 |

Request:

```json
{
  "wordId": 1,
  "answer": "고양이"
}
```

Response:

```json
{
  "success": true,
  "message": null,
  "data": {
    "correct": true,
    "correctAnswer": "고양이"
  }
}
```

## Notice

| Method | Endpoint | 인증 | 관리자 | 설명 |
| --- | --- | --- | --- | --- |
| GET | `/api/notices` | 필요 | 불필요 | 공지사항 목록 조회 |
| GET | `/api/notices/{id}` | 필요 | 불필요 | 공지사항 상세 조회 |
| POST | `/api/admin/notices` | 필요 | 필요 | 공지사항 작성 |
| PUT | `/api/admin/notices/{id}` | 필요 | 필요 | 공지사항 수정 |
| DELETE | `/api/admin/notices/{id}` | 필요 | 필요 | 공지사항 삭제 |

Request:

```json
{
  "title": "서비스 공지",
  "content": "공지 내용입니다.",
  "pinned": true
}
```

Response:

```json
{
  "success": true,
  "message": null,
  "data": {
    "id": 1,
    "title": "서비스 공지",
    "content": "공지 내용입니다.",
    "pinned": true,
    "createdById": 1,
    "createdByNickname": "관리자"
  }
}
```

## Admin

| Method | Endpoint | 인증 | 관리자 | 설명 |
| --- | --- | --- | --- | --- |
| GET | `/api/admin/users` | 필요 | 필요 | 회원 목록 조회 |
| GET | `/api/admin/users/{id}` | 필요 | 필요 | 회원 상세 조회 |
| PATCH | `/api/admin/users/{id}/suspend` | 필요 | 필요 | 회원 정지 |
| PATCH | `/api/admin/users/{id}/activate` | 필요 | 필요 | 회원 정지 해제 |
| GET | `/api/admin/stats` | 필요 | 필요 | 관리자 통계 조회 |

### PATCH /api/admin/users/{id}/suspend

Request:

```json
{
  "reason": "운영 정책 위반",
  "suspendUntil": "2026-06-12T12:00:00"
}
```

Response:

```json
{
  "success": true,
  "message": null,
  "data": {
    "id": 2,
    "email": "user@example.com",
    "nickname": "학습자",
    "role": "USER",
    "status": "SUSPENDED",
    "suspendReason": "운영 정책 위반"
  }
}
```

### GET /api/admin/stats

Response:

```json
{
  "success": true,
  "message": null,
  "data": {
    "totalUserCount": 10,
    "activeUserCount": 9,
    "suspendedUserCount": 1,
    "noticeCount": 3,
    "pinnedNoticeCount": 1,
    "totalCorrectionCount": 25,
    "todayCorrectionCount": 4
  }
}
```

## Correction

`POST /api/corrections`는 선택된 AI Provider에 따라 일본어 교정 결과를 생성합니다. `AI_CORRECTION_PROVIDER=openai`로 설정된 경우 OpenAI Responses API를 호출하며, API 키가 없거나 OpenAI 호출 실패, quota 부족, 응답 파싱 실패가 발생하면 MockCorrectionGenerator 결과로 대체됩니다.

| Method | Endpoint | 인증 | 관리자 | 설명 |
| --- | --- | --- | --- | --- |
| POST | `/api/corrections` | 필요 | 불필요 | 일본어 문장 교정 요청 |
| GET | `/api/corrections/my` | 필요 | 불필요 | 내 교정 기록 조회 |
| GET | `/api/corrections/{id}` | 필요 | 불필요 | 내 교정 기록 상세 조회 |
| GET | `/api/corrections/stats` | 필요 | 불필요 | 내 교정 통계 조회 |

### POST /api/corrections

Request:

```json
{
  "originalText": "札幌に引っ越して、転入届を出しに来ました。",
  "mode": "WORKING_HOLIDAY"
}
```

Response:

```json
{
  "success": true,
  "message": null,
  "data": {
    "id": 1,
    "userId": 1,
    "originalText": "札幌に引っ越して、転入届を出しに来ました。",
    "correctedText": "札幌に引っ越してきたので、転入届の手続きに来ました。",
    "explanation": "워킹홀리데이 상황에 맞는 자연스러운 표현입니다.",
    "mode": "WORKING_HOLIDAY",
    "createdAt": "2026-06-05T12:00:00"
  }
}
```

### GET /api/corrections/stats

Response:

```json
{
  "success": true,
  "message": null,
  "data": {
    "totalCount": 12,
    "generalCount": 4,
    "jobInterviewCount": 2,
    "workingHolidayCount": 5,
    "dailyLifeCount": 1,
    "latestCorrectedAt": "2026-06-05T12:00:00",
    "mostUsedMode": "WORKING_HOLIDAY"
  }
}
```

## Recommendation

| Method | Endpoint | 인증 | 관리자 | 설명 |
| --- | --- | --- | --- | --- |
| GET | `/api/recommendations` | 필요 | 불필요 | 내 학습 모드 기반 추천 콘텐츠 조회 |

Response:

```json
{
  "success": true,
  "message": null,
  "data": {
    "learningMode": "WORKING_HOLIDAY",
    "recommendations": [
      "편의점 알바 표현",
      "음식점 주문/응대",
      "구약소(区役所) 전입신고"
    ]
  }
}
```

## Dashboard / Health

| Method | Endpoint | 인증 | 관리자 | 설명 |
| --- | --- | --- | --- | --- |
| GET | `/api/dashboard` | 필요 | 불필요 | 내 학습 대시보드 조회 |
| GET | `/api/health` | 불필요 | 불필요 | 서버 상태 확인 |

Dashboard response example:

```json
{
  "success": true,
  "message": null,
  "data": {
    "totalLessons": 92,
    "completedLessons": 10,
    "progressPercent": 10.87,
    "hiraganaCompleted": 7,
    "katakanaCompleted": 3,
    "recentCompletedLessons": []
  }
}
```
