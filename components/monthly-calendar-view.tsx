"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import type { AppointmentWithDetails } from "../types"

interface MonthlyCalendarViewProps {
  appointments: AppointmentWithDetails[]
}

export function MonthlyCalendarView({ appointments }: MonthlyCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const today = () => setCurrentDate(new Date())

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      return isSameDay(aptDate, day)
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-500"
      case "Confirmed":
        return "bg-green-500"
      case "In Progress":
        return "bg-yellow-500"
      case "Completed":
        return "bg-gray-500"
      case "Cancelled":
        return "bg-red-500"
      case "No Show":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const days = []
  let day = startDate

  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="flex items-center justify-between">
          <CardTitle>Monthly View - {format(currentDate, "MMMM yyyy")}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={today}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map((weekDay) => (
            <div key={weekDay} className="p-2 text-center font-medium text-sm border-b bg-muted/50">
              {weekDay}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, dayIndex) => {
            const dayAppointments = getAppointmentsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={dayIndex}
                className={cn(
                  "min-h-[120px] p-1 border-b border-r",
                  !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                  isToday && "bg-blue-50 dark:bg-blue-950/30",
                )}
              >
                <div className={cn("text-sm font-medium mb-1", isToday && "text-blue-600 dark:text-blue-400")}>
                  {format(day, "d")}
                </div>

                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((apt) => (
                    <TooltipProvider key={apt.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn("text-xs p-1 rounded cursor-pointer text-white", getStatusColor(apt.status))}
                          >
                            <div className="truncate">
                              {apt.time} {apt.patient.personalInfo.firstName}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-bold">
                              {apt.patient.personalInfo.firstName} {apt.patient.personalInfo.lastName}
                            </p>
                            <p>
                              <span className="font-medium">Provider:</span> {apt.provider.personalInfo.title}{" "}
                              {apt.provider.personalInfo.firstName} {apt.provider.personalInfo.lastName}
                            </p>
                            <p>
                              <span className="font-medium">Type:</span> {apt.appointmentType.name}
                            </p>
                            <p>
                              <span className="font-medium">Time:</span> {apt.time}
                            </p>
                            <Badge className="bg-white text-black">{apt.status}</Badge>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}

                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-muted-foreground">+{dayAppointments.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
