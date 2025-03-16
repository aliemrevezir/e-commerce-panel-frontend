import { redirect } from 'next/navigation'

export default function Home() {
  // In a real app, we would check the auth state here
  // For now, we'll redirect to the login page
  redirect('/auth/login')
  
  return null
}
