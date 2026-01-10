"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import AdminTimesheetTable from "@/components/timesheet/admin-timesheet-table"
import AdminHeader from "@/components/layout/admin-header"
import { getAllEmployeeTimesheets, getAllEmployees } from "@/lib/api"

interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

interface AdminDashboardProps {
  user: User
  onLogout: () => void
  token: string
}

interface EmployeeShift {
  id: string
  employeeId: string
  employeeName: string
  employeeEmail: string
  date: string
  day: string
  startTime: string
  endTime: string
  duration: number
  task: string
  comment: string
  status: "completed" | "pending"
}

export default function AdminDashboard({ user, onLogout, token }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [shifts, setShifts] = useState<EmployeeShift[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shiftsData, employeesData] = await Promise.all([getAllEmployeeTimesheets(token), getAllEmployees(token)])
        setShifts(shiftsData)
        setEmployees(employeesData)
      } catch (err) {
        console.error("[v0] Error fetching admin data:", err)
        setError("Failed to load employee data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  // Group shifts by employee
  const employeeShifts = shifts.reduce((acc, shift) => {
    const existing = acc.find((e) => e.employeeId === shift.employeeId)
    if (existing) {
      existing.shifts.push(shift)
    } else {
      acc.push({
        employeeId: shift.employeeId,
        employeeName: shift.employeeName,
        employeeEmail: shift.employeeEmail,
        totalHours: shift.duration,
        shiftCount: 1,
        shifts: [shift],
      })
    }
    return acc
  }, [] as any[])

  // Calculate totals
  employeeShifts.forEach((emp) => {
    emp.totalHours = emp.shifts.reduce((sum: number, s: EmployeeShift) => sum + s.duration, 0)
    emp.shiftCount = emp.shifts.length
  })

  const filteredEmployees = employeeShifts.filter(
    (emp) =>
      emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Administration Dashboard</h1>
          <p className="text-muted-foreground">Monitor employee timesheets and work tracking</p>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive">{error}</div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "-" : employeeShifts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active employees</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours Logged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? "-" : employeeShifts.reduce((sum, emp) => sum + emp.totalHours, 0).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all employees</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "-" : shifts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Recorded shifts</p>
            </CardContent>
          </Card>
        </div>

        {/* Employees List */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="space-y-4">
            <div>
              <CardTitle>Employee Timesheets</CardTitle>
              <CardDescription>View detailed timesheet information for all employees</CardDescription>
            </div>
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background border-border"
            />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading employee data...</div>
            ) : (
              <div className="space-y-6">
                {filteredEmployees.map((employee) => (
                  <div key={employee.employeeId} className="border border-border/50 rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{employee.employeeName}</h3>
                        <p className="text-sm text-muted-foreground">{employee.employeeEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{employee.totalHours.toFixed(1)}h</p>
                        <p className="text-xs text-muted-foreground">{employee.shiftCount} shifts</p>
                      </div>
                    </div>

                    {/* Employee Shifts Table */}
                    <AdminTimesheetTable shifts={employee.shifts} />
                  </div>
                ))}

                {filteredEmployees.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No employees found matching your search</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
