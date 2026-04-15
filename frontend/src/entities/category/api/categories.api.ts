import type { Category } from '../model/types';
import { apiClient } from '@/shared/api/api-client';

export interface CreateCategoryDto {
  name: string;
  color: string;
  icon: string;
}

export interface UpdateCategoryDto {
  name?: string;
  color?: string;
  icon?: string;
}

export const categoriesApi = {
  getAll: () => apiClient<Category[]>('/api/categories'),
  create: (dto: CreateCategoryDto) =>
    apiClient<Category>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
  update: (id: number, dto: UpdateCategoryDto) =>
    apiClient<Category>(`/api/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),
  remove: (id: number) =>
    apiClient<Category>(`/api/categories/${id}`, { method: 'DELETE' }),
};
