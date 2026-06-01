import { apiClient } from './client';
import type { ApiResponse, DashboardResponse } from './types';

export async function getDashboard() {
  const response = await apiClient.get<ApiResponse<DashboardResponse>>('/api/dashboard');
  return response.data;
}
