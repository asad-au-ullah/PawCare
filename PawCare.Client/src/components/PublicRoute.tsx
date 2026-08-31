import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function PublicRoute() {
    const { isAuthenticated } = useAuth()
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}