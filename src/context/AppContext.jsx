import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { ThemeProvider } from './ThemeContext'

const AppContext = createContext()

export const useApp = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useApp must be used within AppProvider')
    }
    return context
}

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [organization, setOrganization] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            setLoading(false)
            return
        }

        try {
            const response = await authAPI.me()
            setUser(response.data.user)
            setOrganization(response.data.user.current_organization)
            setIsAuthenticated(true)
        } catch (error) {
            console.error('Auth check failed:', error)
            localStorage.removeItem('token')
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password })
            localStorage.setItem('token', response.data.token)
            setUser(response.data.user)
            setOrganization(response.data.user.current_organization)
            setIsAuthenticated(true)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed',
            }
        }
    }

    const register = async (data) => {
        try {
            const response = await authAPI.register(data)
            localStorage.setItem('token', response.data.token)
            setUser(response.data.user)
            setOrganization(response.data.organization)
            setIsAuthenticated(true)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed',
            }
        }
    }

    const logout = async () => {
        try {
            await authAPI.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            localStorage.removeItem('token')
            setUser(null)
            setOrganization(null)
            setIsAuthenticated(false)
        }
    }

    const switchOrganization = async (organizationId) => {
        try {
            const response = await authAPI.switchOrganization(organizationId)
            setUser(response.data.user)
            setOrganization(response.data.user.current_organization)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to switch organization',
            }
        }
    }

    const refreshUser = async () => {
        try {
            const response = await authAPI.me()
            setUser(response.data.user)
            setOrganization(response.data.user.current_organization)
        } catch (error) {
            console.error('Failed to refresh user:', error)
        }
    }

    const value = {
        user,
        organization,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        switchOrganization,
        refreshUser,
        setOrganization,
    }

    return (
        <AppContext.Provider value={value}>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </AppContext.Provider>
    )
}