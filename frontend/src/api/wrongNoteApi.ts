import { apiClient } from './client';
import type { ApiResponse, WrongNoteResponse } from './types';

export async function getWrongNotes() {
  const response = await apiClient.get<ApiResponse<WrongNoteResponse[]>>('/api/wrong-notes');
  return response.data;
}

export async function deleteWrongNote(lessonId: number) {
  const response = await apiClient.delete<ApiResponse<null>>(`/api/wrong-notes/${lessonId}`);
  return response.data;
}
