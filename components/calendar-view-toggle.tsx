"use client"

import { Button } from "@/components/ui/button"
import { Calendar, CalendarDays, CalendarRange } from "lucide-react"
import { cn } from "@/lib/utils"

import type { CalendarViewMode } from "../types/calendar"

interface CalendarViewToggleProps {
  currentView: CalendarViewMode
  onViewChange: (view: CalendarViewMode) => void
}

export function CalendarViewToggle({ currentView, onViewChange }: CalendarViewToggleProps) {
  const views = [
    { id: "daily" as CalendarViewMode, label: "Daily", icon: Calendar },
    { id: "weekly" as CalendarViewMode, label: "Weekly", icon: CalendarDays },
    { id: "monthly" as CalendarViewMode, label: "Monthly", icon: CalendarRange },
  ]

  return (
    <div className="inline-flex items-center rounded-md border bg-background p-1 shadow-sm">
      {views.map((view) => {
        const Icon = view.icon
        const isActive = currentView === view.id
        return (
          <Button
            key={view.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(view.id)}
            className={cn(
              "flex items-center gap-2 transition-all duration-200",
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            <Icon className="h-4 w-4" />
            {view.label}
          </Button>
        )
      })}
    </div>
  )
}
