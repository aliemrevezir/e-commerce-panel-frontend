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

interface LoginCredentials {
  email?: string
  phone?: string
  password: string
}

interface LoginResponse {
  status: string
  data: {
    user: User
    token: string
  }
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Giriş başarısız')
  }

  const data = await response.json()
  console.log('Login response:', data) // Debug için log ekleyelim
  return data
} 