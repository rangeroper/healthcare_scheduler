"use client"

import { useState } from "react"
import { format, addDays, subDays, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import type { AppointmentWithDetails } from "../types"

interface DailyCalendarViewProps {
  appointments: AppointmentWithDetails[]
}

export function DailyCalendarView({ appointments }: DailyCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const timeSlots = Array.from({ length: 12 }).map((_, i) => {
    const hour = i + 7 // Start at 7 AM
    return `${hour.toString().padStart(2, "0")}:00`
  })

  const nextDay = () => setCurrentDate(addDays(currentDate, 1))
  const prevDay = () => setCurrentDate(subDays(currentDate, 1))
  const today = () => setCurrentDate(new Date())

  const getAppointmentsForTime = (time: string) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      const [aptHour] = apt.time.split(":")
      const [slotHour] = time.split(":")

      return isSameDay(aptDate, currentDate) && aptHour === slotHour
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
          <CardTitle>Daily View - {format(currentDate, "EEEE, MMMM d, yyyy")}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={today}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={nextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-1">
          {timeSlots.map((time, timeIndex) => {
            const timeAppointments = getAppointmentsForTime(time)
            return (
              <div key={timeIndex} className="flex border-b">
                <div className="flex items-center justify-center p-4 font-medium text-sm border-r w-20">
                  <Clock className="h-4 w-4 mr-1" />
                  {time}
                </div>
                <div className="flex-1 min-h-[100px] p-2">
                  {timeAppointments.length > 0 ? (
                    <div className="space-y-2">
                      {timeAppointments.map((apt) => (
                        <TooltipProvider key={apt.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "p-3 rounded cursor-pointer transition-all hover:shadow-md",
                                  getStatusColor(apt.status),
                                )}
                              >
                                <div className="font-medium">
                                  {apt.time} - {apt.patient.personalInfo.firstName} {apt.patient.personalInfo.lastName}
                                </div>
                                <div className="text-sm">{apt.appointmentType.name}</div>
                                <div className="text-xs">
                                  {apt.provider.personalInfo.title} {apt.provider.personalInfo.firstName}{" "}
                                  {apt.provider.personalInfo.lastName}
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
                                  <span className="font-medium">Duration:</span> {apt.appointmentType.duration} min
                                </p>
                                <Badge className={getStatusColor(apt.status)}>{apt.status}</Badge>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No appointments</div>
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
