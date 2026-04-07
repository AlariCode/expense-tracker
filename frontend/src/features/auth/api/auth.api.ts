import { apiClient } from '@/shared/api/api-client';
import type { AuthResponse } from '@/entities/user';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  login: (data: LoginData) =>
    apiClient<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterData) =>
    apiClient<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
