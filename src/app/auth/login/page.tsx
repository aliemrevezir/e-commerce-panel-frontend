'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuthStore } from '@/lib/store/store'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { login } from '@/lib/api/auth'
import { useState } from 'react'
import { toast } from 'sonner'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email veya telefon numarası gereklidir'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      // Check if the identifier is an email or phone number
      const isEmail = data.identifier.includes('@')
      const credentials = {
        [isEmail ? 'email' : 'phone']: data.identifier,
        password: data.password,
      }

      const response = await login(credentials)
      
      // First set the token, then the user to ensure proper auth state
      setToken(response.data.token)
      setUser(response.data.user)
      
      toast.success('Giriş başarıyla yapıldı')

      // Force a revalidation of the auth state
      router.refresh()

      // Wait a bit longer to ensure store is properly persisted
      setTimeout(() => {
        console.log('Redirecting to dashboard...')
        router.push('/dashboard')
      }, 500)
    } catch (error) {
      console.error('Login failed:', error)
      toast.error(error instanceof Error ? error.message : 'Giriş başarısız oldu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Giriş Yap</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email veya Telefon</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Email veya telefon numaranızı girin" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Şifrenizi girin" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 