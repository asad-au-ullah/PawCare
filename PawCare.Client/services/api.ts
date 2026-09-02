'use client'

import axios from 'axios'

const TOKEN_KEY = 'pawcare_token'

// ─── Token helpers ────────────────────────────────────────────────────────────

export const getToken = (): string | null => typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string): void => { if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token) }
export const removeToken = (): void => { if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY) }

// ─── Axios instance ───────────────────────────────────────────────────────────

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: false,
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthEndpoint = error.config?.url?.includes('/api/auth/')
        if (error.response?.status === 401 && !isAuthEndpoint) {
            removeToken()
            window.location.href = '/login'
        }
        return Promise.reject(error)
    },
)

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthResponse {
    token: string
    expiresAt: string
    role: string
}

export interface RegisterResponse {
    message: string
}

export interface VerifyEmailRequest {
    userId: string
    token: string
}

export interface ResendVerificationRequest {
    email: string
}

export const authApi = {
    register: (data: RegisterRequest) =>
        api.post<RegisterResponse>('/api/auth/register', data),
    login: (data: LoginRequest) =>
        api.post<AuthResponse>('/api/auth/login', data),
    verifyEmail: (data: VerifyEmailRequest) =>
        api.post<AuthResponse>('/api/auth/verify-email', data),
    resendVerification: (data: ResendVerificationRequest) =>
        api.post<{ message: string }>('/api/auth/resend-verification', data),
}