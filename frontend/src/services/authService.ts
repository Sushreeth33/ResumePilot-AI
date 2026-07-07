import { api } from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth.types';
import type { ApiSuccessResponse } from '../types/api.types';

export async function loginRequest(credentials: LoginCredentials) {
  const response = await api.post<ApiSuccessResponse<AuthResponse>>('/auth/login', credentials);
  return response.data.data;
}

export async function registerRequest(credentials: RegisterCredentials) {
  const response = await api.post<ApiSuccessResponse<AuthResponse>>('/auth/register', credentials);
  return response.data.data;
}
