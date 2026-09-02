import type { ReactNode } from 'react'
import { PublicRoute } from '@/components/PublicRoute'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicRoute>{children}</PublicRoute>
}
