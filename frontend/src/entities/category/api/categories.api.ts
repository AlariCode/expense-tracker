import type { Category } from '../model/types';
import { apiClient } from '@/shared/api/api-client';

export const categoriesApi = {
  getAll: () => apiClient<Category[]>('/api/categories'),
};
