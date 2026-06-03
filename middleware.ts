import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('its_user')
  const pathname = request.nextUrl.pathname

  // Halaman publik (boleh tanpa login)
  const publicPages = ['/auth/login', '/auth/setup-2fa', '/auth/verify-2fa']
  const isPublicPage = publicPages.includes(pathname)

  // Jika user belum login dan coba akses halaman protected
  if (!userCookie && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Jika user sudah login dan coba akses halaman login, redirect ke home
  if (userCookie && pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

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
