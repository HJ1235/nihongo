import { apiClient } from './client';
import type { ApiResponse, CorrectionMode, CorrectionResponse } from './types';

export type CorrectionCreatePayload = {
  originalText: string;
  mode: CorrectionMode;
};

export async function createCorrection(payload: CorrectionCreatePayload) {
  const response = await apiClient.post<ApiResponse<CorrectionResponse>>('/api/corrections', payload);
  return response.data;
}

export async function getMyCorrections() {
  const response = await apiClient.get<ApiResponse<CorrectionResponse[]>>('/api/corrections/my');
  return response.data;
}

export async function getCorrection(correctionId: number) {
  const response = await apiClient.get<ApiResponse<CorrectionResponse>>(`/api/corrections/${correctionId}`);
  return response.data;
}
