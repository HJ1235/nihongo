import { apiClient } from './client';
import type { ApiResponse, WordLevel, WordResponse } from './types';

export async function getWords(level: WordLevel = 'N5') {
  const response = await apiClient.get<ApiResponse<WordResponse[]>>('/api/words', {
    params: { level },
  });
  return response.data;
}
