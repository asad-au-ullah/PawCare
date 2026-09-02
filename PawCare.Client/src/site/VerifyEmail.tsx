'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { XCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'

// ─── Component ────────────────────────────────────────────────────────────────

export function VerifyEmail() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { verifyEmail } = useAuth()

    const userId = searchParams.get('userId') ?? ''
    const token = searchParams.get('token') ?? ''

    const [status, setStatus] = useState<'loading' | 'error'>('loading')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const requestSentRef = useRef(false)

    useEffect(() => {
        if (!userId || !token) {
            return
        }

        if (requestSentRef.current) return
        requestSentRef.current = true

        verifyEmail(userId, token)
            .then(() => {
                router.replace('/dashboard')
            })
            .catch((err) => {
                setStatus('error')
                setErrorMessage(
                    err?.response?.data?.message ||
                    'This link is invalid or has expired. Request a new one from the sign-in page.'
                )
            })
    }, [userId, token, verifyEmail, router])

    if (!userId || !token) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-teal-600">PawCare</h1>
                    </div>
                    <Card>
                        <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                                <XCircle className="w-7 h-7 text-destructive" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Invalid verification link. Please check your email and try again.
                            </p>
                            <Button variant="outline" onClick={() => router.push('/login')}>
                                Back to sign in
                            </Button>
                        </CardContent>
                        <CardFooter className="justify-center border-t pt-4">
                            <p className="text-sm text-muted-foreground">
                                Need help?{' '}
                                <Link href="/login" className="text-teal-600 font-medium hover:underline">
                                    Return to sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-teal-600">PawCare</h1>
                </div>

                <Card>
                    <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
                        {status === 'loading' && (
                            <>
                                <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
                                <p className="text-muted-foreground text-sm">Verifying your email…</p>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                                    <XCircle className="w-7 h-7 text-destructive" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-xl font-semibold text-foreground">Verification failed</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {errorMessage || 'This link is invalid or has expired. Request a new one from the sign-in page.'}
                                    </p>
                                </div>
                                <Button variant="outline" className="mt-2" onClick={() => router.push('/login')}>
                                    Back to sign in
                                </Button>
                            </>
                        )}
                    </CardContent>

                    <CardFooter className="justify-center border-t pt-4">
                        <p className="text-sm text-muted-foreground">
                            Need help?{' '}
                            <Link href="/login" className="text-teal-600 font-medium hover:underline">
                                Return to sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}