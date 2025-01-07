import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'))
    const [user, setUser] = useState(null)

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken')
        setUser(null)
        setIsAuthenticated(false)
    }, [])

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('authToken')
        if (token) {
            try {
                const response = await fetch('https://localhost:3001/api/user', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (!response.ok) throw new Error('Ungültiger Token')
                const data = await response.json()
                setUser(data)
                setIsAuthenticated(true)
            } catch {
                logout()
            }
        }
    }, [logout])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const login = (token, userData) => {
        localStorage.setItem('accessToken', token)
        setUser(userData)
        setIsAuthenticated(true)
    }

    return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
