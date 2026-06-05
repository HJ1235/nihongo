export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      message: null;
    }
  | {
      success: false;
      data: null;
      message: string;
    };

export type KanaType = 'HIRAGANA' | 'KATAKANA';

export type WordLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type CorrectionMode = 'GENERAL' | 'JOB_INTERVIEW' | 'WORKING_HOLIDAY' | 'DAILY_LIFE';

export type LearningMode = 'GENERAL' | 'JAPAN_JOB' | 'WORKING_HOLIDAY' | 'DAILY_LIFE' | 'JLPT';

export type UserLoginResponse = {
  accessToken: string;
};

export type UserMeResponse = {
  id: number;
  email: string;
  nickname: string;
};

export type UserRole = 'USER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export type LessonResponse = {
  id: number;
  kanaType: KanaType;
  character: string;
  romaji: string;
  meaning: string;
};

export type QuizQuestionResponse = {
  lessonId: number;
  kanaType: KanaType;
  character: string;
  choices: string[];
};

export type QuizAnswerResponse = {
  correct: boolean;
  correctAnswer: string;
  progressCompleted: boolean;
  wrongNoteResolved: boolean;
};

export type ProgressResponse = {
  lessonId: number;
  kanaType: KanaType;
  character: string;
  romaji: string;
  completedAt: string;
};

export type DashboardResponse = {
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  hiraganaCompleted: number;
  katakanaCompleted: number;
  recentCompletedLessons: RecentLessonResponse[];
};

export type RecentLessonResponse = {
  lessonId: number;
  character: string;
  romaji: string;
  completedAt: string;
};

export type WrongNoteResponse = {
  lessonId: number;
  kanaType: KanaType;
  character: string;
  romaji: string;
  wrongCount: number;
  lastWrongAt: string;
};

export type WordResponse = {
  id: number;
  level: WordLevel;
  japanese: string;
  reading: string;
  meaning: string;
  exampleSentence: string;
  exampleMeaning: string;
};

export type WordQuizQuestionResponse = {
  wordId: number;
  level: WordLevel;
  japanese: string;
  reading: string;
  choices: string[];
};

export type WordQuizAnswerResponse = {
  correct: boolean;
  correctAnswer: string;
};

export type NoticeResponse = {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdById: number;
  createdByNickname: string;
};

export type AdminUserResponse = {
  id: number;
  email: string;
  nickname: string;
  role: UserRole;
  status: UserStatus;
  suspendReason: string | null;
  suspendUntil: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type CorrectionResponse = {
  id: number;
  userId: number;
  originalText: string;
  correctedText: string;
  explanation: string;
  mode: CorrectionMode;
  createdAt: string;
};

export type LearningModeResponse = {
  learningMode: LearningMode;
};

export type ModeRecommendationResponse = {
  learningMode: LearningMode;
  recommendations: string[];
};
