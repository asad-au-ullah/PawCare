'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, isInitialized, router])

  if (!isInitialized || isAuthenticated) return null

  return <>{children}</>
}

