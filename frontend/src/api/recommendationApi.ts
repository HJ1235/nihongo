import { apiClient } from './client';
import type { ApiResponse, LearningMode, LearningModeResponse, ModeRecommendationResponse } from './types';

export type UpdateLearningModePayload = {
  learningMode: LearningMode;
};

export async function getLearningMode() {
  const response = await apiClient.get<ApiResponse<LearningModeResponse>>('/api/users/me/learning-mode');
  return response.data;
}

export async function updateLearningMode(payload: UpdateLearningModePayload) {
  const response = await apiClient.patch<ApiResponse<LearningModeResponse>>('/api/users/me/learning-mode', payload);
  return response.data;
}

export async function getRecommendations() {
  const response = await apiClient.get<ApiResponse<ModeRecommendationResponse>>('/api/recommendations');
  return response.data;
}
