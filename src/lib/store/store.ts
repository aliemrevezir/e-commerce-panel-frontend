import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Business {
  id: number
  name: string
  instagram_username: string
  address: string
  tax_number: string
  contact_email: string
  contact_phone: string
  created_at: string
  updated_at: string
}

interface User {
  id: number
  business_id: number
  name: string
  surname: string
  email: string
  phone?: string
  role: string
  user_type: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  reset_token: string | null
  reset_token_expires: string | null
  version?: number
  business?: Business
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          if (typeof window !== 'undefined') {
            const str = document.cookie.split('; ').find(row => row.startsWith(`${name}=`))
            return str ? str.split('=')[1] : null
          }
          return null
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Strict`
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          }
        },
      })),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
) 