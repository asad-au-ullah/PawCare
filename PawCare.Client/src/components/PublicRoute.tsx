'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && isAuthenticated) router.replace('/dashboard')
  }, [isAuthenticated, isInitialized, router])

  if (!isInitialized || isAuthenticated) return null
  return <>{children}</>
}
