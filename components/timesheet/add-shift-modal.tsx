"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Shift } from "@/lib/api"

interface AddShiftModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (shift: Omit<Shift, "id" | "user_id" | "duration_hours">) => Promise<void> | void
}

export default function AddShiftModal({ isOpen, onClose, onAdd }: AddShiftModalProps) {
  const [formData, setFormData] = useState({
    date: "",
    start_time: "",
    end_time: "",
    task: "",
    comment: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.date || !formData.start_time || !formData.end_time) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      await onAdd({
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        task: formData.task || "Unspecified",
        comment: formData.comment || "",
      })

      setFormData({
        date: "",
        start_time: "",
        end_time: "",
        task: "",
        comment: "",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader>
          <CardTitle>Add New Shift</CardTitle>
          <CardDescription>Record your work hours for this shift</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date *</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time *</label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Time *</label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Task</label>
              <Input
                placeholder="e.g. Project Development"
                value={formData.task}
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Comment</label>
              <textarea
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                placeholder="Add any notes about this shift..."
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Shift"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
