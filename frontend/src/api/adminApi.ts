import axios from 'axios';
import { apiClient } from './client';
import type { AdminStatsResponse, AdminUserResponse, ApiResponse, NoticeResponse } from './types';

export type NoticeRequest = {
  title: string;
  content: string;
  pinned: boolean;
};

export type UserSuspendRequest = {
  reason: string;
  suspendUntil: string | null;
};

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

export async function getAdminNotices() {
  const response = await apiClient.get<ApiResponse<NoticeResponse[]>>('/api/notices');
  return response.data;
}

export async function createNotice(request: NoticeRequest) {
  const response = await apiClient.post<ApiResponse<NoticeResponse>>('/api/admin/notices', request);
  return response.data;
}

export async function updateNotice(noticeId: number, request: NoticeRequest) {
  const response = await apiClient.put<ApiResponse<NoticeResponse>>(`/api/admin/notices/${noticeId}`, request);
  return response.data;
}

export async function deleteNotice(noticeId: number) {
  const response = await apiClient.delete<ApiResponse<null>>(`/api/admin/notices/${noticeId}`);
  return response.data;
}

export async function getAdminUsers() {
  const response = await apiClient.get<ApiResponse<AdminUserResponse[]>>('/api/admin/users');
  return response.data;
}

export async function getAdminStats() {
  const response = await apiClient.get<ApiResponse<AdminStatsResponse>>('/api/admin/stats');
  return response.data;
}

export async function getAdminUser(userId: number) {
  const response = await apiClient.get<ApiResponse<AdminUserResponse>>(`/api/admin/users/${userId}`);
  return response.data;
}

export async function suspendUser(userId: number, request: UserSuspendRequest) {
  const response = await apiClient.patch<ApiResponse<AdminUserResponse>>(`/api/admin/users/${userId}/suspend`, request);
  return response.data;
}

export async function activateUser(userId: number) {
  const response = await apiClient.patch<ApiResponse<AdminUserResponse>>(`/api/admin/users/${userId}/activate`);
  return response.data;
}
