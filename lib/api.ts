const API_BASE_URL = "http://localhost:3001/api"

export interface LoginCredentials {
  email: string
  password: string
  role: "user" | "admin"
}

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

export interface Shift {
  id: string
  user_id: string
  date: string
  start_time: string
  end_time: string
  task: string
  comment?: string
  duration_hours: number
}

export interface TimesheetSummary {
  total_hours: number
  total_days: number
  completion_percentage: number
  target_hours: number
  target_days: number
}

// Auth API calls
export async function loginUser(credentials: LoginCredentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })
  if (!response.ok) throw new Error("Login failed")
  return response.json()
}

export async function registerUser(data: {
  name: string
  email: string
  password: string
  role: "user" | "admin"
}) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Registration failed")
  return response.json()
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error("Failed to fetch user")
  return response.json()
}

// Timesheet API calls for Users
export async function getUserTimesheets(token: string): Promise<Shift[]> {
  const response = await fetch(`${API_BASE_URL}/timesheets`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error("Failed to fetch timesheets")
  return response.json()
}

export async function getUserTimesheet(token: string, shiftId: string): Promise<Shift> {
  const response = await fetch(`${API_BASE_URL}/timesheets/${shiftId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error("Failed to fetch timesheet")
  return response.json()
}

export async function createShift(token: string, data: Omit<Shift, "id" | "user_id" | "duration_hours">) {
  const response = await fetch(`${API_BASE_URL}/timesheets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create shift")
  return response.json()
}

export async function updateShift(token: string, shiftId: string, data: Partial<Shift>) {
  const response = await fetch(`${API_BASE_URL}/timesheets/${shiftId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update shift")
  return response.json()
}

export async function deleteShift(token: string, shiftId: string) {
  const response = await fetch(`${API_BASE_URL}/timesheets/${shiftId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error("Failed to delete shift")
}

export async function getTimesheetSummary(token: string): Promise<TimesheetSummary> {
  const response = await fetch(`${API_BASE_URL}/timesheets/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error("Failed to fetch summary")
  return response.json()
}

// Admin API calls
export async function getAllEmployeeTimesheets(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/timesheets`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error("Failed to fetch timesheets")
  return response.json()
}

export async function getEmployeeDetails(token: string, userId: string) {
  const response = await fetch(`${API_BASE_URL}/admin/employees/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error("Failed to fetch employee details")
  return response.json()
}

export async function getAllEmployees(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/employees`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error("Failed to fetch employees")
  return response.json()
}
