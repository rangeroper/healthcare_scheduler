"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Calendar, UserCheck, TrendingUp, Clock, DollarSign } from "lucide-react"

import type { AppointmentWithDetails } from "../types"

interface ReportsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointments: AppointmentWithDetails[]
}

export function ReportsModal({ open, onOpenChange, appointments }: ReportsModalProps) {
  // Calculate statistics
  const totalAppointments = appointments.length
  const scheduledAppointments = appointments.filter((apt) => apt.status === "Scheduled").length
  const completedAppointments = appointments.filter((apt) => apt.status === "Completed").length
  const cancelledAppointments = appointments.filter((apt) => apt.status === "Cancelled").length

  const totalRevenue = appointments
    .filter((apt) => apt.status === "Completed")
    .reduce((sum, apt) => sum + apt.appointmentType.cost, 0)

  const averageAppointmentValue = completedAppointments > 0 ? totalRevenue / completedAppointments : 0

  // Provider statistics
  const providerStats = appointments.reduce(
    (acc, apt) => {
      const providerId = apt.provider.id
      if (!acc[providerId]) {
        acc[providerId] = {
          name: `${apt.provider.personalInfo.title} ${apt.provider.personalInfo.firstName} ${apt.provider.personalInfo.lastName}`,
          appointments: 0,
          revenue: 0,
        }
      }
      acc[providerId].appointments++
      if (apt.status === "Completed") {
        acc[providerId].revenue += apt.appointmentType.cost
      }
      return acc
    },
    {} as Record<string, { name: string; appointments: number; revenue: number }>,
  )

  const topProviders = Object.values(providerStats)
    .sort((a, b) => b.appointments - a.appointments)
    .slice(0, 5)

  // Appointment type statistics
  const appointmentTypeStats = appointments.reduce(
    (acc, apt) => {
      const typeId = apt.appointmentType.id
      if (!acc[typeId]) {
        acc[typeId] = {
          name: apt.appointmentType.name,
          count: 0,
          revenue: 0,
        }
      }
      acc[typeId].count++
      if (apt.status === "Completed") {
        acc[typeId].revenue += apt.appointmentType.cost
      }
      return acc
    },
    {} as Record<string, { name: string; count: number; revenue: number }>,
  )

  const topAppointmentTypes = Object.values(appointmentTypeStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Reports & Analytics
          </DialogTitle>
          <DialogDescription>View comprehensive reports and analytics for your practice</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Statistics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAppointments}</div>
                <p className="text-xs text-muted-foreground">All time appointments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{scheduledAppointments}</div>
                <p className="text-xs text-muted-foreground">Upcoming appointments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedAppointments}</div>
                <p className="text-xs text-muted-foreground">Finished appointments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From completed appointments</p>
              </CardContent>
            </Card>
          </div>

          {/* Provider Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Top Providers by Appointments
              </CardTitle>
              <CardDescription>Providers with the most appointments scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProviders.map((provider, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-muted-foreground">{provider.appointments} appointments</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${provider.revenue.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Appointment Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Popular Appointment Types
              </CardTitle>
              <CardDescription>Most frequently scheduled appointment types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAppointmentTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{type.name}</p>
                        <p className="text-sm text-muted-foreground">{type.count} appointments</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${type.revenue.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Average Appointment Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${averageAppointmentValue.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cancellation Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalAppointments > 0 ? ((cancelledAppointments / totalAppointments) * 100).toFixed(1) : 0}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(1) : 0}%
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
