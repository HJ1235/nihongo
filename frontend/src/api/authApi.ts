import { apiClient, ACCESS_TOKEN_KEY } from './client';
import type { ApiResponse, UserLoginResponse, UserMeResponse } from './types';

export type SignupRequest = {
  email: string;
  password: string;
  nickname: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export async function signup(request: SignupRequest) {
  const response = await apiClient.post<ApiResponse<number>>('/api/users/signup', request);
  return response.data;
}

export async function login(request: LoginRequest) {
  const response = await apiClient.post<ApiResponse<UserLoginResponse>>('/api/users/login', request);

  if (response.data.success) {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.data.data.accessToken);
  }

  return response.data;
}

export async function me() {
  const response = await apiClient.get<ApiResponse<UserMeResponse>>('/api/users/me');
  return response.data;
}

export function logout() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
