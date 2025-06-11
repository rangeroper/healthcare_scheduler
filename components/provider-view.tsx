"use client"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserCheck, Phone, Mail, GraduationCap, Award, Calendar, Clock } from "lucide-react"

import type { AppointmentWithDetails } from "../types"
import { providers } from "../utils/data-utils"

interface ProviderViewProps {
  appointments: AppointmentWithDetails[]
}

export function ProviderView({ appointments }: ProviderViewProps) {
  return (
    <div className="space-y-6">
      {providers.map((provider) => {
        const providerAppointments = appointments.filter((apt) => apt.providerId === provider.id)

        return (
          <Card key={provider.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                {provider.personalInfo.title} {provider.personalInfo.firstName} {provider.personalInfo.lastName}
              </CardTitle>
              <CardDescription>
                {provider.professionalInfo.specialty} • {provider.professionalInfo.department}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Professional Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {provider.personalInfo.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {provider.personalInfo.email}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Professional Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-3 w-3" />
                      {provider.professionalInfo.education}
                    </div>
                    <p>License: {provider.professionalInfo.licenseNumber}</p>
                    <p>Experience: {provider.professionalInfo.yearsExperience} years</p>
                  </div>
                </div>
              </div>

              {/* Credentials */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Credentials
                </h4>
                <div className="flex flex-wrap gap-1">
                  {provider.professionalInfo.credentials.map((credential, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {credential}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Schedule */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Working Days
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {provider.schedule.workingDays.map((day, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Working Hours
                  </h4>
                  <div className="text-sm">
                    <p>
                      Hours: {provider.schedule.workingHours.start} - {provider.schedule.workingHours.end}
                    </p>
                    <p>
                      Lunch: {provider.schedule.lunchBreak.start} - {provider.schedule.lunchBreak.end}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointments */}
              {providerAppointments.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Upcoming Appointments ({providerAppointments.length})</h4>
                    <div className="space-y-2">
                      {providerAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium">
                              {appointment.patient.personalInfo.firstName} {appointment.patient.personalInfo.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.appointmentType.name} • {appointment.appointmentType.duration} min
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(appointment.date, "MMM dd, yyyy")} at {appointment.time}
                            </p>
                          </div>
                          <Badge
                            className={`${appointment.status === "Scheduled" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
