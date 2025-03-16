import { useAuthStore } from '../store/store'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface FetchOptions extends RequestInit {
  token?: string | null
}

export async function fetchWithAuth<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const token = useAuthStore.getState().token

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Bir hata oluştu' }))
    throw new Error(error.message || 'İstek başarısız oldu')
  }

  return response.json()
}

export const apiClient = {
  get: <T>(endpoint: string, options: Omit<FetchOptions, 'method'> = {}) => 
    fetchWithAuth<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data: unknown, options: Omit<FetchOptions, 'method' | 'body'> = {}) =>
    fetchWithAuth<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown, options: Omit<FetchOptions, 'method' | 'body'> = {}) =>
    fetchWithAuth<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options: Omit<FetchOptions, 'method'> = {}) =>
    fetchWithAuth<T>(endpoint, { ...options, method: 'DELETE' }),
} 