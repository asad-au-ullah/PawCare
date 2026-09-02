import type { Metadata } from 'next'
import { Layout } from '@/site/Layout'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'PawCare',
  description: 'Veterinary care and appointment management',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}
