"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Shift {
  id: string
  date: string
  day: string
  startTime: string
  endTime: string
  duration: number
  task: string
  comment: string
  status: string
}

interface EditShiftModalProps {
  isOpen: boolean
  shift: Shift
  onClose: () => void
  onSave: (shift: any) => void
}

export default function EditShiftModal({ isOpen, shift, onClose, onSave }: EditShiftModalProps) {
  const [formData, setFormData] = useState(shift)

  useEffect(() => {
    setFormData(shift)
  }, [shift])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const [startHour, startMin] = formData.startTime.split(":").map(Number)
    const [endHour, endMin] = formData.endTime.split(":").map(Number)
    const startTotalMin = startHour * 60 + startMin
    const endTotalMin = endHour * 60 + endMin
    const durationHours = (endTotalMin - startTotalMin) / 60

    onSave({
      ...formData,
      duration: durationHours,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader>
          <CardTitle>Edit Shift</CardTitle>
          <CardDescription>Update your shift information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Time</label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Task</label>
              <Input value={formData.task} onChange={(e) => setFormData({ ...formData, task: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Comment</label>
              <textarea
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
