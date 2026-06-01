import { apiClient } from './client';
import type { ApiResponse, QuizAnswerResponse, QuizQuestionResponse } from './types';

export type QuizAnswerRequest = {
  lessonId: number;
  answer: string;
};

export async function getRandomQuiz() {
  const response = await apiClient.get<ApiResponse<QuizQuestionResponse>>('/api/quiz/random');
  return response.data;
}

export async function answerQuiz(request: QuizAnswerRequest) {
  const response = await apiClient.post<ApiResponse<QuizAnswerResponse>>('/api/quiz/answer', request);
  return response.data;
}

export async function getReviewRandomQuiz() {
  const response = await apiClient.get<ApiResponse<QuizQuestionResponse>>('/api/quiz/review/random');
  return response.data;
}
