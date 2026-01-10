"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TimesheetStats from "@/components/timesheet/timesheet-stats"
import TimesheetTable from "@/components/timesheet/timesheet-table"
import AddShiftModal from "@/components/timesheet/add-shift-modal"
import UserHeader from "@/components/layout/user-header"
import { getUserTimesheets, getTimesheetSummary, createShift, deleteShift, updateShift, type Shift } from "@/lib/api"

interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

interface UserDashboardProps {
  user: User
  onLogout: () => void
  token: string
}

export default function UserDashboard({ user, onLogout, token }: UserDashboardProps) {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [summary, setSummary] = useState({ total_hours: 0, total_days: 0, completion_percentage: 0 })
  const [isAddingShift, setIsAddingShift] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shiftsData, summaryData] = await Promise.all([getUserTimesheets(token), getTimesheetSummary(token)])
        setShifts(shiftsData)
        setSummary(summaryData)
      } catch (err) {
        console.error("[v0] Error fetching timesheets:", err)
        setError("Failed to load timesheets")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  const handleAddShift = async (newShift: Omit<Shift, "id" | "user_id" | "duration_hours">) => {
    try {
      const createdShift = await createShift(token, newShift)
      setShifts([...shifts, createdShift])
      setIsAddingShift(false)
      // Refresh summary
      const updatedSummary = await getTimesheetSummary(token)
      setSummary(updatedSummary)
    } catch (err) {
      setError("Failed to add shift")
    }
  }

  const handleDeleteShift = async (id: string) => {
    try {
      await deleteShift(token, id)
      setShifts(shifts.filter((shift) => shift.id !== id))
      // Refresh summary
      const updatedSummary = await getTimesheetSummary(token)
      setSummary(updatedSummary)
    } catch (err) {
      setError("Failed to delete shift")
    }
  }

  const handleEditShift = async (id: string, updatedShift: Partial<Shift>) => {
    try {
      const updated = await updateShift(token, id, updatedShift)
      setShifts(shifts.map((shift) => (shift.id === id ? updated : shift)))
      // Refresh summary
      const updatedSummary = await getTimesheetSummary(token)
      setSummary(updatedSummary)
    } catch (err) {
      setError("Failed to update shift")
    }
  }

  const isComplete = summary.completion_percentage >= 100

  return (
    <div className="min-h-screen bg-background">
      <UserHeader user={user} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Manage your timesheet and track your work hours</p>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive">{error}</div>
        )}

        {/* Stats Cards */}
        {!isLoading && (
          <TimesheetStats
            totalHours={summary.total_hours}
            completedDays={summary.total_days}
            isComplete={isComplete}
            completionPercentage={summary.completion_percentage}
          />
        )}

        {/* Completion Status Card */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Timesheet Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Hours Logged</span>
                <span className={`text-sm font-semibold ${isComplete ? "text-success" : "text-muted-foreground"}`}>
                  {summary.total_hours.toFixed(1)} / 40 hours
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${isComplete ? "bg-success" : "bg-primary"}`}
                  style={{ width: `${summary.completion_percentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-muted-foreground">Days Worked</p>
                <p className={`text-xl font-bold ${summary.total_days >= 5 ? "text-success" : "text-foreground"}`}>
                  {summary.total_days} / 5 days
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className={`text-lg font-semibold ${isComplete ? "text-success" : "text-accent"}`}>
                  {isComplete ? "Complete" : "In Progress"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timesheet Table */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Your Shifts</CardTitle>
              <CardDescription>View and manage your work hours</CardDescription>
            </div>
            <Button onClick={() => setIsAddingShift(true)} className="gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Shift
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading shifts...</div>
            ) : (
              <TimesheetTable shifts={shifts} isAdmin={false} onEdit={handleEditShift} onDelete={handleDeleteShift} />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Shift Modal */}
      <AddShiftModal isOpen={isAddingShift} onClose={() => setIsAddingShift(false)} onAdd={handleAddShift} />
    </div>
  )
}
