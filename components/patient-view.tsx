"use client"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, MapPin, Heart, Pill, AlertTriangle, Shield } from "lucide-react"

import type { AppointmentWithDetails } from "../types"
import { patients } from "../utils/data-utils"

interface PatientViewProps {
  appointments: AppointmentWithDetails[]
}

export function PatientView({ appointments }: PatientViewProps) {
  return (
    <div className="space-y-6">
      {patients.map((patient) => {
        const patientAppointments = appointments.filter((apt) => apt.patientId === patient.id)

        return (
          <Card key={patient.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {patient.personalInfo.firstName} {patient.personalInfo.lastName}
              </CardTitle>
              <CardDescription>
                Patient ID: {patient.id} • Registered: {format(new Date(patient.registrationDate), "MMM dd, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Personal Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {patient.personalInfo.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {patient.personalInfo.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {patient.personalInfo.address.street}, {patient.personalInfo.address.city},{" "}
                      {patient.personalInfo.address.state} {patient.personalInfo.address.zipCode}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Demographics</h4>
                  <div className="space-y-1 text-sm">
                    <p>Date of Birth: {format(new Date(patient.personalInfo.dateOfBirth), "MMM dd, yyyy")}</p>
                    <p>Gender: {patient.personalInfo.gender}</p>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      {patient.medicalInfo.insuranceProvider}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Medical Information */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Allergies
                  </h4>
                  {patient.medicalInfo.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {patient.medicalInfo.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No known allergies</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Current Medications
                  </h4>
                  {patient.medicalInfo.medications.length > 0 ? (
                    <div className="space-y-1">
                      {patient.medicalInfo.medications.map((medication, index) => (
                        <Badge key={index} variant="outline" className="text-xs block w-fit">
                          {medication}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No current medications</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Medical History
                  </h4>
                  {patient.medicalInfo.medicalHistory.length > 0 ? (
                    <div className="space-y-1">
                      {patient.medicalInfo.medicalHistory.map((condition, index) => (
                        <Badge key={index} variant="secondary" className="text-xs block w-fit">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No significant medical history</p>
                  )}
                </div>
              </div>

              {/* Appointments */}
              {patientAppointments.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Upcoming Appointments ({patientAppointments.length})</h4>
                    <div className="space-y-2">
                      {patientAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium">{appointment.appointmentType.name}</p>
                            <p className="text-sm text-muted-foreground">
                              with {appointment.provider.personalInfo.title}{" "}
                              {appointment.provider.personalInfo.firstName} {appointment.provider.personalInfo.lastName}
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
