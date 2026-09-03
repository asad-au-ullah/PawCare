'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const wasAuthenticated = useRef(isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      wasAuthenticated.current = true
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isInitialized) return

    // Redirect with `next` only if this route was entered unauthenticated
    if (!isAuthenticated && !wasAuthenticated.current) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, isInitialized, pathname, router])

  if (!isInitialized || !isAuthenticated) return null

  return <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
}

