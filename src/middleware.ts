import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /blog/123)
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const isPublicPath = path === '/auth/login' || path === '/auth/register'

  // Get auth data from cookies
  const authData = request.cookies.get('auth-storage')?.value
  
  let hasAuthData = false
  if (authData) {
    try {
      // Try to parse the raw cookie value
      const parsedData = JSON.parse(decodeURIComponent(authData))
      // Access the nested state structure
      const state = parsedData.state
      hasAuthData = !!(state?.user?.id && state?.token && state?.isAuthenticated)
      
      
    } catch (error) {
      console.error('Failed to parse auth data:', error)
    }
  }

  // If the user is not authenticated and the path is not public,
  // redirect to the login page
  if (!hasAuthData && !isPublicPath) {
    console.log('Redirecting to login:', { path, hasAuthData, isPublicPath })
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If the user is authenticated and tries to access a public path,
  // redirect to the dashboard
  if (hasAuthData && isPublicPath) {
    console.log('Redirecting to dashboard:', { path, hasAuthData, isPublicPath })
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Add your protected routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 