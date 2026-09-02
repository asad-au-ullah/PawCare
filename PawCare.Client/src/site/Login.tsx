'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { authApi, type LoginRequest } from '../../services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FieldGroup } from "@/components/ui/field"
import { FormInput } from "@/components/form/FormInput"
import { PasswordInput } from "@/components/form/PasswordInput"

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

// ─── Component ────────────────────────────────────────────────────────────────

export function Login() {
    const { login } = useAuth()
    const router = useRouter()

    const form = useForm<FormData>({ resolver: zodResolver(schema) })

    const loginMutation = useMutation({
        mutationFn: (data: LoginRequest) => login(data),
        onSuccess: () => router.push('/dashboard'),
    })

    const resendMutation = useMutation({
        mutationFn: (email: string) => authApi.resendVerification({ email }),
    })

    const onSubmit = (data: FormData) => {
        resendMutation.reset()
        loginMutation.mutate(data)
    }

    const requiresVerification =
        axios.isAxiosError(loginMutation.error) &&
        loginMutation.error.response?.status === 403 &&
        loginMutation.error.response?.data?.requiresEmailVerification === true

    const errorMessage = loginMutation.error
        ? requiresVerification
            ? null  // handled below
            : axios.isAxiosError(loginMutation.error) && loginMutation.error.response?.status === 401
                ? 'Invalid email or password.'
                : 'Something went wrong. Please try again.'
        : null

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-teal-600">PawCare</h1>
                    <p className="text-muted-foreground mt-2">Sign in to your account</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sign in</CardTitle>
                        <CardDescription>Enter your email and password to continue.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <FormInput
                                    control={form.control}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                                <PasswordInput
                                    control={form.control}
                                    name="password"
                                    label="Password"
                                    showRequirements={false}
                                />
                            </FieldGroup>

                            {requiresVerification && (
                                <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    <p className="font-medium">Email not verified</p>
                                    <p className="mt-0.5 text-amber-700">
                                        A verification link was sent when you registered.{' '}
                                        {resendMutation.isSuccess ? (
                                            <span className="font-medium text-teal-700">New link sent!</span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => resendMutation.mutate(form.getValues('email'))}
                                                disabled={resendMutation.isPending}
                                                className="font-medium underline underline-offset-2 hover:text-amber-900 disabled:opacity-60"
                                            >
                                                {resendMutation.isPending ? 'Sending…' : 'Resend verification email'}
                                            </button>
                                        )}
                                    </p>
                                </div>
                            )}

                            {errorMessage && (
                                <p className="text-destructive text-sm mt-4 text-center">{errorMessage}</p>
                            )}

                            <Button
                                type="submit"
                                className="w-full mt-6"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-teal-600 font-medium hover:underline">
                                Create one
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}