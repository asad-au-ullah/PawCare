import type { ReactNode } from 'react'
import { PrivateRoute } from '@/components/PrivateRoute'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <PrivateRoute>
      <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
    </PrivateRoute>
  )
}
