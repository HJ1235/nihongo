import { apiClient } from './client';
import type { ApiResponse, KanaType, LessonResponse } from './types';

export async function getLessons(type?: KanaType) {
  const response = await apiClient.get<ApiResponse<LessonResponse[]>>('/api/lessons', {
    params: type ? { type } : undefined,
  });
  return response.data;
}

export async function getLesson(lessonId: number) {
  const response = await apiClient.get<ApiResponse<LessonResponse>>(`/api/lessons/${lessonId}`);
  return response.data;
}
