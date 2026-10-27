import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import type { LoginRequest } from '../../services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    FieldGroup,
} from "@/components/ui/field"
import { FormInput } from "@/components/form/FormInput";
import { Zap } from 'lucide-react'

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

// ─── Component ────────────────────────────────────────────────────────────────

export function Login() {
    const { login, loginAsDemo } = useAuth()
    const navigate = useNavigate()

    const form = useForm<FormData>({ resolver: zodResolver(schema) })

    const mutation = useMutation({
        mutationFn: (data: LoginRequest) => login(data),
        onSuccess: () => navigate('/dashboard'),
    })

    const demoMutation = useMutation({
        mutationFn: () => loginAsDemo(),
        onSuccess: () => navigate('/dashboard'),
    })

    const onSubmit = (data: FormData) => mutation.mutate(data)

    const errorMessage = mutation.error
        ? axios.isAxiosError(mutation.error) && mutation.error.response?.status === 401
            ? 'Invalid email or password.'
            : 'Something went wrong. Please try again.'
        : null

    const demoErrorMessage = demoMutation.error
        ? 'Could not load demo account. Please try again.'
        : null

    const isAnyPending = mutation.isPending || demoMutation.isPending

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

                    <CardContent className="space-y-4">
                        {/* ── Demo login ─────────────────────────────────────────── */}
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <p className="text-xs text-amber-700 font-medium mb-3 text-center">
                                🐾 Want to explore without signing up?
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border-amber-300 bg-white hover:bg-amber-50 text-amber-800 font-semibold gap-2"
                                onClick={() => demoMutation.mutate()}
                                disabled={isAnyPending}
                            >
                                <Zap className="w-4 h-4 text-amber-500" />
                                {demoMutation.isPending ? 'Loading demo…' : 'Try Demo — one click, no sign-up'}
                            </Button>
                            {demoErrorMessage && (
                                <p className="text-destructive text-xs mt-2 text-center">{demoErrorMessage}</p>
                            )}
                        </div>

                        {/* ── Divider ────────────────────────────────────────────── */}
                        <div className="relative flex items-center gap-3">
                            <div className="flex-1 border-t border-border" />
                            <span className="text-xs text-muted-foreground shrink-0">or sign in with your account</span>
                            <div className="flex-1 border-t border-border" />
                        </div>

                        {/* ── Regular login form ─────────────────────────────────── */}
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

                                <FormInput
                                    control={form.control}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </FieldGroup>

                            {errorMessage && (
                                <p className="text-destructive text-sm mt-4 text-center">
                                    {errorMessage}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-full mt-6"
                                disabled={isAnyPending}
                            >
                                {mutation.isPending ? "Signing in…" : "Sign in"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center">
                        <p className="text-sm text-muted-foreground">
                            Just exploring?{' '}
                            <span className="text-teal-600 font-medium">Use the demo account above.</span>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
