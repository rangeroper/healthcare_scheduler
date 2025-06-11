"use client"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Phone, Mail, Clock, DollarSign, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import type { AppointmentWithDetails } from "../types"

interface AppointmentsTableProps {
  appointments: AppointmentWithDetails[]
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

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  const formatDateTime = (date: Date, time: string) => {
    return `${format(date, "MMM dd, yyyy")} at ${time}`
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>
              {appointments.length === 0
                ? "No appointments scheduled yet."
                : `${appointments.length} appointment${appointments.length === 1 ? "" : "s"} scheduled.`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-1" />
              Today
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Patient</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Appointment Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {appointment.patient.personalInfo.firstName} {appointment.patient.personalInfo.lastName}
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground cursor-help">
                                <Phone className="h-3 w-3" />
                                {appointment.patient.personalInfo.phone}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <div className="space-y-1">
                                <p className="font-medium">Patient Details</p>
                                <p>
                                  DOB: {format(new Date(appointment.patient.personalInfo.dateOfBirth), "MMM dd, yyyy")}
                                </p>
                                <p>Insurance: {appointment.patient.medicalInfo.insuranceProvider}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {appointment.patient.personalInfo.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {appointment.provider.personalInfo.title} {appointment.provider.personalInfo.firstName}{" "}
                          {appointment.provider.personalInfo.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {appointment.provider.professionalInfo.specialty}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {appointment.provider.professionalInfo.department}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{appointment.appointmentType.name}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {appointment.appointmentType.duration} minutes
                        </div>
                        <span className="text-xs text-muted-foreground">{appointment.appointmentType.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{format(appointment.date, "MMM dd, yyyy")}</span>
                        <span className="text-sm text-muted-foreground">{appointment.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="h-3 w-3" />
                        {appointment.appointmentType.cost.toFixed(2)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p>No appointments scheduled yet.</p>
            <p className="text-sm">Use the form above to schedule your first appointment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
