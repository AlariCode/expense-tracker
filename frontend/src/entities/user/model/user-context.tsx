'use client';

import { createContext, useContext } from 'react';
import type { User } from './types';

interface UserContextValue {
  user: User;
  logout: () => void;
}

export const UserContext = createContext<UserContextValue | null>(null);

export function useUserContext(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUserContext must be used within UserContext.Provider');
  }
  return ctx;
}
