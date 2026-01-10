"use client"

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

interface AdminTimesheetTableProps {
  shifts: Shift[]
}

export default function AdminTimesheetTable({ shifts }: AdminTimesheetTableProps) {
  const sortedShifts = [...shifts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/30">
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Time</th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Duration</th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Task</th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Comment</th>
          </tr>
        </thead>
        <tbody>
          {sortedShifts.map((shift) => (
            <tr key={shift.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="py-3 px-4">
                <p className="font-medium text-foreground text-xs">{shift.date}</p>
              </td>
              <td className="py-3 px-4">
                <p className="text-xs text-foreground">
                  {shift.startTime} - {shift.endTime}
                </p>
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-primary/20 text-primary">
                  {shift.duration}h
                </span>
              </td>
              <td className="py-3 px-4">
                <p className="text-xs text-foreground">{shift.task}</p>
              </td>
              <td className="py-3 px-4">
                <p className="text-xs text-muted-foreground">{shift.comment}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
