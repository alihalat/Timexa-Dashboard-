"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import EditShiftModal from "./edit-shift-modal"

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

interface TimesheetTableProps {
  shifts: Shift[]
  isAdmin?: boolean
  onEdit: (id: string, shift: any) => void
  onDelete: (id: string) => void
}

export default function TimesheetTable({ shifts, isAdmin = false, onEdit, onDelete }: TimesheetTableProps) {
  const [editingShift, setEditingShift] = useState<Shift | null>(null)

  const sortedShifts = [...shifts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Time</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Duration</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Task</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Comment</th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedShifts.map((shift) => (
              <tr key={shift.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-foreground">{shift.date}</p>
                    <p className="text-xs text-muted-foreground">{shift.day}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-foreground">
                    {shift.startTime} - {shift.endTime}
                  </p>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                    {shift.duration}h
                  </span>
                </td>
                <td className="py-4 px-4">
                  <p className="text-foreground">{shift.task}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-muted-foreground line-clamp-1">{shift.comment}</p>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingShift(shift)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(shift.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedShifts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No shifts recorded yet. Add your first shift to get started.</p>
        </div>
      )}

      {editingShift && (
        <EditShiftModal
          isOpen={!!editingShift}
          shift={editingShift}
          onClose={() => setEditingShift(null)}
          onSave={(updated) => {
            onEdit(editingShift.id, updated)
            setEditingShift(null)
          }}
        />
      )}
    </>
  )
}
