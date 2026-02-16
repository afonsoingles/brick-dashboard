import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

interface AuthContextType {
  isAuthenticated: boolean
  email: string | null
  token: string | null
  loading: boolean
  login: (token: string, email: string) => void
  logout: () => void
}

export type { AuthContextType }

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = Cookies.get('auth_token')
    const storedEmail = Cookies.get('user_email')

    if (storedToken && storedEmail) {
      setToken(storedToken)
      setEmail(storedEmail)
    }

    setLoading(false)
  }, [])

  const login = (newToken: string, newEmail: string) => {
    setToken(newToken)
    setEmail(newEmail)
    Cookies.set('auth_token', newToken, { expires: 7 })
    Cookies.set('user_email', newEmail, { expires: 7 })
  }

  const logout = () => {
    setToken(null)
    setEmail(null)
    Cookies.remove('auth_token')
    Cookies.remove('user_email')
  }

  const value: AuthContextType = {
    isAuthenticated: !!token,
    email,
    token,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
