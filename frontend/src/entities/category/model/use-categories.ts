'use client';

import { useEffect, useState } from 'react';
import { categoriesApi } from '../api/categories.api';
import type { Category } from './types';

export function useCategories(refreshTrigger?: number) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    categoriesApi
      .getAll()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setIsLoading(false));
  }, [refreshTrigger]);

  return { categories, isLoading };
}
