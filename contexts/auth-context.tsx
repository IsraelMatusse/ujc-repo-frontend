"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { authService } from "@/lib/api/services/auth.service"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (fullName: string, email: string, password: string, code: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("ujc-user")
    const storedToken = localStorage.getItem("ujc-token")

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("ujc-user")
        localStorage.removeItem("ujc-token")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await authService.login({ email, password })

      const userData: User = {
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        role: response.data.role,
        code: response.data.code,
        status: response.data.status,
      }

      setUser(userData)
      localStorage.setItem("ujc-user", JSON.stringify(userData))
      localStorage.setItem("ujc-token", response.token)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (fullName: string, email: string, password: string, code: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await authService.register({ fullName, email, password, code })

      const userData: User = {
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        role: response.data.role,
        code: response.data.code,
        status: response.data.status,
      }

      setUser(userData)
      localStorage.setItem("ujc-user", JSON.stringify(userData))
      localStorage.setItem("ujc-token", response.token)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Register error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ujc-user")
    localStorage.removeItem("ujc-token")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
