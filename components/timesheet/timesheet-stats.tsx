import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TimesheetStatsProps {
  totalHours: number
  completedDays: number
  isComplete: boolean
  completionPercentage: number
}

export default function TimesheetStats({
  totalHours,
  completedDays,
  isComplete,
  completionPercentage,
}: TimesheetStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Hours Logged</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold">{totalHours.toFixed(1)}</div>
            <span className="text-sm text-muted-foreground">/ 40h</span>
          </div>
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isComplete ? "bg-success" : "bg-primary"}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Days Worked</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold">{completedDays}</div>
            <span className="text-sm text-muted-foreground">/ 5 days</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {5 - completedDays > 0
              ? `${5 - completedDays} more day${5 - completedDays > 1 ? "s" : ""} needed`
              : "Complete"}
          </p>
        </CardContent>
      </Card>

      <Card
        className={`border-border/50 ${isComplete ? "bg-success/10 border-success/50" : "bg-card/50"} backdrop-blur-sm`}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${isComplete ? "text-success" : "text-accent"}`}>
            {isComplete ? "Complete" : "In Progress"}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {isComplete ? "Your timesheet is complete!" : "Keep working to complete your timesheet"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
