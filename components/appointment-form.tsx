"use client"

import type React from "react"
import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, User, UserCheck, FileText, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import type { Appointment, Patient, Provider } from "../types"
import { appointmentTypes, formatPatientName, formatProviderName, getAvailableTimeSlots } from "../utils/data-utils"

interface AppointmentFormProps {
  appointments: Appointment[]
  patients: Patient[]
  providers: Provider[]
  onAppointmentCreate: (appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => void
}

export function AppointmentForm({ appointments, patients, providers, onAppointmentCreate }: AppointmentFormProps) {
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedProviderData = providers.find((p) => p.id === selectedProvider)
  const availableTimeSlots =
    selectedProviderData && selectedDate ? getAvailableTimeSlots(selectedProviderData, selectedDate, appointments) : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!selectedPatient || !selectedProvider || !selectedAppointmentType || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to schedule an appointment.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const newAppointment: Omit<Appointment, "id" | "createdAt" | "updatedAt"> = {
      patientId: selectedPatient,
      providerId: selectedProvider,
      appointmentTypeId: selectedAppointmentType,
      date: selectedDate,
      time: selectedTime,
      status: "Scheduled",
      notes: notes.trim() || undefined,
    }

    await onAppointmentCreate(newAppointment)

    // Reset form
    setSelectedPatient("")
    setSelectedProvider("")
    setSelectedAppointmentType("")
    setSelectedDate(undefined)
    setSelectedTime("")
    setNotes("")

    setIsSubmitting(false)
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Schedule New Appointment
        </CardTitle>
        <CardDescription>Complete all fields to schedule a new patient appointment.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Patient Selection */}
            <div className="space-y-2">
              <Label htmlFor="patient" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Patient *
              </Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      <div className="flex flex-col">
                        <span>{formatPatientName(patient)}</span>
                        <span className="text-xs text-muted-foreground">
                          {patient.personalInfo.phone} • {patient.medicalInfo.insuranceProvider}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Provider Selection */}
            <div className="space-y-2">
              <Label htmlFor="provider" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Provider *
              </Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex flex-col">
                        <span>{formatProviderName(provider)}</span>
                        <span className="text-xs text-muted-foreground">
                          {provider.professionalInfo.specialty} • {provider.professionalInfo.department}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Appointment Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="appointmentType" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Appointment Type *
              </Label>
              <Select value={selectedAppointmentType} onValueChange={setSelectedAppointmentType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex flex-col">
                        <span>{type.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {type.duration} min • ${type.cost} • {type.category}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Available Time Slots *
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Time slot information</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Time slots are based on provider availability and existing appointments. Select a provider and
                      date to see available times.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {selectedProviderData && selectedDate ? (
              availableTimeSlots.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {availableTimeSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={selectedTime === slot ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(slot)}
                      className={cn("transition-all", selectedTime === slot && "bg-primary text-primary-foreground")}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="rounded-md bg-muted p-4 text-sm">
                  No available time slots for the selected provider and date.
                </div>
              )
            ) : (
              <div className="rounded-md bg-muted p-4 text-sm">
                Please select a provider and date to see available time slots.
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes for this appointment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
