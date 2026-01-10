"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthPageProps {
  onLogin: (email: string, password: string, role: "user" | "admin") => Promise<void> | void
  isLoading?: boolean
  error?: string | null
}

export default function AuthPage({ onLogin, isLoading = false, error = null }: AuthPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"user" | "admin">("user")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onLogin(email, password, role)
  }

  const handleDemoLogin = async (demoRole: "user" | "admin") => {
    const demoEmail = demoRole === "admin" ? "admin@timexa.com" : "user@timexa.com"
    await onLogin(demoEmail, "demo123", demoRole)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo / Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Timexa</h1>
          <p className="text-muted-foreground">Professional timesheet management</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Login to Timexa</CardTitle>
            <CardDescription>Enter your credentials to access your timesheet</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    disabled={isLoading}
                    className={`flex-1 py-2 px-3 rounded-lg border transition-colors ${
                      role === "user"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    disabled={isLoading}
                    className={`flex-1 py-2 px-3 rounded-lg border transition-colors ${
                      role === "admin"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {/* Demo Buttons */}
            <div className="mt-6 pt-6 border-t border-border space-y-2">
              <p className="text-xs text-muted-foreground text-center">Quick demo access</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin("user")}
                  disabled={isLoading}
                >
                  Demo User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin("admin")}
                  disabled={isLoading}
                >
                  Demo Admin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>Demo credentials work with any password</p>
        </div>
      </div>
    </div>
  )
}
