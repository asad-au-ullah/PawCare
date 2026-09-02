'use client'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { RegisterRequest } from '../../services/api'
import axios from 'axios'
import { useForm } from "react-hook-form"
import { FormInput } from "@/components/form/FormInput"
import { PasswordInput } from "@/components/form/PasswordInput"

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('Enter a valid email'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain an uppercase letter')
        .regex(/[a-z]/, 'Must contain a lowercase letter')
        .regex(/[0-9]/, 'Must contain a number')
        .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
})

type FormData = z.infer<typeof schema>

// ─── Check-your-email state ───────────────────────────────────────────────────

function EmailSentState({ email }: { email: string }) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-teal-600">PawCare</h1>
                </div>
                <Card>
                    <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center">
                            <Mail className="w-7 h-7 text-teal-600" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold text-foreground">Check your email</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                                We sent a verification link to{' '}
                                <span className="font-medium text-foreground">{email}</span>.
                                Click it to activate your account.
                            </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            The link expires in 24 hours. Check your spam folder if you don't see it.
                        </p>
                    </CardContent>
                    <CardFooter className="justify-center border-t pt-4">
                        <p className="text-sm text-muted-foreground">
                            Already verified?{' '}
                            <Link href="/login" className="text-teal-600 font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Register() {
    const { register: registerUser } = useAuth()
    const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { firstName: '', lastName: '', email: '', password: '' },
    })

    const mutation = useMutation({
        mutationFn: (data: RegisterRequest) => registerUser(data),
        onSuccess: (_, variables) => setRegisteredEmail(variables.email),
    })

    const onSubmit = (data: FormData) => mutation.mutate(data)

    if (registeredEmail) {
        return <EmailSentState email={registeredEmail} />
    }

    const errorMessage = mutation.error
        ? axios.isAxiosError(mutation.error) && mutation.error.response?.status === 400
            ? mutation.error.response.data?.error ?? 'An account with this email already exists.'
            : 'Something went wrong. Please try again.'
        : null

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-teal-600">PawCare</h1>
                    <p className="text-muted-foreground mt-2">Create your account</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create account</CardTitle>
                        <CardDescription>
                            Enter your information to create your PawCare account.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FieldGroup>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        control={form.control}
                                        name="firstName"
                                        label="First name"
                                        placeholder="Jane"
                                        autoComplete="given-name"
                                    />
                                    <FormInput
                                        control={form.control}
                                        name="lastName"
                                        label="Last name"
                                        placeholder="Smith"
                                        autoComplete="family-name"
                                    />
                                </div>

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
                                />
                            </FieldGroup>

                            {errorMessage && (
                                <p className="text-destructive text-sm text-center">{errorMessage}</p>
                            )}

                            <Button type="submit" className="w-full" disabled={mutation.isPending}>
                                {mutation.isPending ? 'Creating account…' : 'Create account'}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="text-teal-600 font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}