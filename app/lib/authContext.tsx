'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'

interface AuthContextType {
  isAuthenticated: boolean
  username: string | null
  login: (username: string) => void
  logout: () => void
  requiresTwoFA: boolean
  setRequiresTwoFA: (value: boolean) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [requiresTwoFA, setRequiresTwoFA] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedUsername = Cookies.get('its_user')
    
    if (savedUsername) {
      setUsername(savedUsername)
      setIsAuthenticated(true)
    }
    
    setIsLoading(false)
  }, [])

  const login = (user: string) => {
    setUsername(user)
    setIsAuthenticated(true)
    Cookies.set('its_user', user, { expires: 7 })
  }

  const logout = () => {
    setUsername(null)
    setIsAuthenticated(false)
    setRequiresTwoFA(false)
    Cookies.remove('its_user')
    Cookies.remove('its_2fa_required')
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        login,
        logout,
        requiresTwoFA,
        setRequiresTwoFA,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
