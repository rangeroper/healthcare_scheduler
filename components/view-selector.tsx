"use client"

import { Button } from "@/components/ui/button"
import { Calendar, List, User, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"

import type { ViewMode } from "../types"

interface ViewSelectorProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const views = [
    { id: "list" as ViewMode, label: "List View", icon: List },
    { id: "calendar" as ViewMode, label: "Calendar View", icon: Calendar },
    { id: "patient" as ViewMode, label: "Patient View", icon: User },
    { id: "provider" as ViewMode, label: "Provider View", icon: UserCheck },
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
