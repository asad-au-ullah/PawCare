'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isInitialized && !isAuthenticated) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
  }, [isAuthenticated, isInitialized, pathname, router])

  if (!isInitialized || !isAuthenticated) return null
  return <>{children}</>
}
