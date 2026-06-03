'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './authContext'
import { useEffect, useState, ReactNode } from 'react'

export default function ProtectRoute({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const publicPages = ['/auth/login', '/auth/setup-2fa', '/auth/verify-2fa']
    const isPublicPage = publicPages.includes(pathname)

    if (!isAuthenticated && !isPublicPage) {
      router.push('/auth/login')
    }
  }, [mounted, isAuthenticated, pathname, router])

  // Show loading while checking auth
  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    )
  }

  // Block unprotected pages if not authenticated
  const publicPages = ['/auth/login', '/auth/setup-2fa', '/auth/verify-2fa']
  const isPublicPage = publicPages.includes(pathname)
  
  if (!isAuthenticated && !isPublicPage) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center text-white">
        <p>Redirecting to login...</p>
      </div>
    )
  }

  return children
}
