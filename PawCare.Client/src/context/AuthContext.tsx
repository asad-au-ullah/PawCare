'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import {
    authApi,
    getToken,
    setToken,
    removeToken,
    type LoginRequest,
    type RegisterRequest,
} from '../../services/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
    id: string
    email: string
    role: string
    givenName: string
    familyName: string
}

interface AuthContextValue {
    user: AuthUser | null
    isAuthenticated: boolean
    isInitialized: boolean
    login: (data: LoginRequest) => Promise<void>
    register: (data: RegisterRequest) => Promise<void>
    verifyEmail: (userId: string, token: string) => Promise<void>
    logout: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function decodeUser(token: string): AuthUser | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return {
            id: payload.sub ?? '',
            email: payload.email ?? '',
            role: payload.role ?? '',
            givenName: payload.given_name ?? '',
            familyName: payload.family_name ?? '',
        }
    } catch {
        return null
    }
}

function loadUserFromStorage(): AuthUser | null {
    const token = getToken()
    if (!token) return null
    return decodeUser(token)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        setUser(loadUserFromStorage())
        setIsInitialized(true)
    }, [])

    const login = useCallback(async (data: LoginRequest) => {
        const response = await authApi.login(data)
        const { token } = response.data
        setToken(token)
        setUser(decodeUser(token))
    }, [])

    // Register no longer returns a token — backend sends a verification email.
    // Auth state is set only after the user clicks the link (verifyEmail below).
    const register = useCallback(async (data: RegisterRequest) => {
        await authApi.register(data)
    }, [])

    const verifyEmail = useCallback(async (userId: string, token: string) => {
        const response = await authApi.verifyEmail({ userId, token })
        const { token: jwt } = response.data
        setToken(jwt)
        setUser(decodeUser(jwt))
    }, [])

    const logout = useCallback(() => {
        removeToken()
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: user !== null, isInitialized, login, register, verifyEmail, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}