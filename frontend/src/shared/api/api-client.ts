const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function apiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? 'Ошибка запроса');
  }

  return data as T;
}
