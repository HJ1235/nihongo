import { apiClient } from './client';
import type { ApiResponse, ProgressResponse } from './types';

export async function getProgress() {
  const response = await apiClient.get<ApiResponse<ProgressResponse[]>>('/api/progress');
  return response.data;
}
