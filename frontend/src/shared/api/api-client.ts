const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function apiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const authHeaders: Record<string, string> = {};

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers,
    },
    ...options,
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
    throw new Error('Сессия истекла');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? 'Ошибка запроса');
  }

  return data as T;
}
