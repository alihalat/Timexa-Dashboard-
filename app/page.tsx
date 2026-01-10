"use client"

import { useState } from "react"
import AuthPage from "@/components/auth/auth-page"
import UserDashboard from "@/components/dashboard/user-dashboard"
import AdminDashboard from "@/components/dashboard/admin-dashboard"
import { loginUser } from "@/lib/api"

type UserRole = "user" | "admin"

interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await loginUser({ email, password, role })
      setToken(response.token)
      setCurrentUser({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
      })
      setIsAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setToken(null)
    setError(null)
  }

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} isLoading={isLoading} error={error} />
  }

  return (
    <>
      {currentUser?.role === "admin" ? (
        <AdminDashboard user={currentUser} onLogout={handleLogout} token={token!} />
      ) : (
        <UserDashboard user={currentUser} onLogout={handleLogout} token={token!} />
      )}
    </>
  )
}
