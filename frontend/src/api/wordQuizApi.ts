import { apiClient } from './client';
import type { ApiResponse, WordLevel, WordQuizAnswerResponse, WordQuizQuestionResponse } from './types';

export type WordQuizAnswerRequest = {
  wordId: number;
  answer: string;
};

export async function getRandomWordQuiz(level: WordLevel = 'N5') {
  const response = await apiClient.get<ApiResponse<WordQuizQuestionResponse>>('/api/word-quiz/random', {
    params: { level },
  });
  return response.data;
}

export async function answerWordQuiz(request: WordQuizAnswerRequest) {
  const response = await apiClient.post<ApiResponse<WordQuizAnswerResponse>>('/api/word-quiz/answer', request);
  return response.data;
}
