'use client';

import { useEffect, useState } from 'react';
import { categoriesApi } from '../api/categories.api';
import type { Category } from './types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    categoriesApi
      .getAll()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setIsLoading(false));
  }, []);

  return { categories, isLoading };
}
