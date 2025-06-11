"use client"

import { useState } from "react"
import { CalendarViewToggle } from "./calendar-view-toggle"
import { DailyCalendarView } from "./daily-calendar-view"
import { MonthlyCalendarView } from "./monthly-calendar-view"

import type { AppointmentWithDetails } from "../types"
import type { CalendarViewMode } from "../types/calendar"

// Keep the existing weekly view code
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  appointments: AppointmentWithDetails[]
}

function WeeklyCalendarView({ appointments }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start on Monday

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i))

  const timeSlots = Array.from({ length: 12 }).map((_, i) => {
    const hour = i + 7 // Start at 7 AM
    return `${hour.toString().padStart(2, "0")}:00`
  })

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1))
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1))
  const today = () => setCurrentDate(new Date())

  const getAppointmentsForDayAndTime = (day: Date, time: string) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      const [aptHour] = apt.time.split(":")
      const [slotHour] = time.split(":")

      return isSameDay(aptDate, day) && aptHour === slotHour
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "No Show":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="flex items-center justify-between">
          <CardTitle>Weekly View</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={today}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-1 mt-4">
          <div className="flex items-center justify-center p-2 font-medium text-sm">
            <Clock className="h-4 w-4 mr-1" />
            Time
          </div>
          {weekDays.map((day, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col items-center justify-center p-2 font-medium text-sm rounded-md",
                isSameDay(day, new Date()) && "bg-blue-100 dark:bg-blue-900",
              )}
            >
              <div>{format(day, "EEE")}</div>
              <div
                className={cn("text-lg font-bold", isSameDay(day, new Date()) && "text-blue-600 dark:text-blue-400")}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-8 gap-1">
          {timeSlots.map((time, timeIndex) => (
            <>
              <div
                key={`time-${timeIndex}`}
                className="flex items-center justify-center p-2 font-medium text-sm border-t border-r"
              >
                {time}
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayAppointments = getAppointmentsForDayAndTime(day, time)
                return (
                  <div
                    key={`slot-${timeIndex}-${dayIndex}`}
                    className={cn(
                      "min-h-[80px] p-1 border-t",
                      dayIndex === 6 ? "border-r" : "",
                      isSameDay(day, new Date()) ? "bg-blue-50 dark:bg-blue-950/30" : "",
                    )}
                  >
                    {dayAppointments.length > 0 ? (
                      <div className="space-y-1">
                        {dayAppointments.map((apt) => (
                          <TooltipProvider key={apt.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "text-xs p-1 rounded cursor-pointer transition-all hover:shadow-md",
                                    getStatusColor(apt.status),
                                  )}
                                >
                                  <div className="font-medium truncate">
                                    {apt.time} - {apt.patient.personalInfo.firstName}{" "}
                                    {apt.patient.personalInfo.lastName}
                                  </div>
                                  <div className="truncate">{apt.appointmentType.name}</div>
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
                                    <span className="font-medium">Duration:</span> {apt.appointmentType.duration} min
                                  </p>
                                  <Badge className={getStatusColor(apt.status)}>{apt.status}</Badge>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function CalendarView({ appointments }: CalendarViewProps) {
  const [calendarView, setCalendarView] = useState<CalendarViewMode>("weekly")

  const renderCalendarView = () => {
    switch (calendarView) {
      case "daily":
        return <DailyCalendarView appointments={appointments} />
      case "weekly":
        return <WeeklyCalendarView appointments={appointments} />
      case "monthly":
        return <MonthlyCalendarView appointments={appointments} />
      default:
        return <WeeklyCalendarView appointments={appointments} />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <CalendarViewToggle currentView={calendarView} onViewChange={setCalendarView} />
      </div>
      {renderCalendarView()}
    </div>
  )
}
