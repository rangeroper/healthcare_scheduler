"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, User, UserCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Mock data
const mockPatients = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Sarah Johnson" },
  { id: "3", name: "Michael Brown" },
  { id: "4", name: "Emily Davis" },
  { id: "5", name: "David Wilson" },
]

const mockProviders = [
  { id: "1", name: "Dr. Amanda Chen" },
  { id: "2", name: "Dr. Robert Martinez" },
  { id: "3", name: "Dr. Lisa Thompson" },
  { id: "4", name: "Dr. James Anderson" },
]

interface Appointment {
  id: string
  patientId: string
  providerId: string
  date: Date
  time: string
  patientName: string
  providerName: string
}

export default function AppointmentScheduler() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    if (!selectedPatient || !selectedProvider || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to schedule an appointment.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Check for double booking
    const isDoubleBooked = appointments.some(
      (apt) =>
        apt.providerId === selectedProvider &&
        apt.date.toDateString() === selectedDate.toDateString() &&
        apt.time === selectedTime,
    )

    if (isDoubleBooked) {
      toast({
        title: "Time Slot Unavailable",
        description: "This provider is already booked at the selected time.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Create new appointment
    const patient = mockPatients.find((p) => p.id === selectedPatient)
    const provider = mockProviders.find((p) => p.id === selectedProvider)

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientId: selectedPatient,
      providerId: selectedProvider,
      date: selectedDate,
      time: selectedTime,
      patientName: patient?.name || "",
      providerName: provider?.name || "",
    }

    setAppointments([...appointments, newAppointment])

    // Reset form
    setSelectedPatient("")
    setSelectedProvider("")
    setSelectedDate(undefined)
    setSelectedTime("")

    toast({
      title: "Appointment Scheduled",
      description: `Appointment scheduled for ${patient?.name} with ${provider?.name}.`,
    })

    setIsSubmitting(false)
  }

  const formatDateTime = (date: Date, time: string) => {
    return `${format(date, "MMM dd, yyyy")} at ${time}`
  }

  // Sort appointments by date and time
  const sortedAppointments = appointments.sort((a, b) => {
    const dateA = new Date(`${a.date.toDateString()} ${a.time}`)
    const dateB = new Date(`${b.date.toDateString()} ${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Healthcare Appointment Scheduler
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Schedule and manage patient appointments with healthcare providers
          </p>
        </div>

        {/* Appointment Form */}
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Schedule New Appointment
            </CardTitle>
            <CardDescription>
              Select a patient, provider, and preferred date and time for the appointment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Patient Selection */}
                <div className="space-y-2">
                  <Label htmlFor="patient" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Patient
                  </Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Provider Selection */}
                <div className="space-y-2">
                  <Label htmlFor="provider" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Provider
                  </Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Date
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
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    min="08:00"
                    max="17:00"
                    step="900" // 15-minute intervals
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              {appointments.length === 0
                ? "No appointments scheduled yet."
                : `${appointments.length} appointment${appointments.length === 1 ? "" : "s"} scheduled.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Provider Name</TableHead>
                      <TableHead>Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.patientName}</TableCell>
                        <TableCell>{appointment.providerName}</TableCell>
                        <TableCell>{formatDateTime(appointment.date, appointment.time)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No appointments scheduled yet.</p>
                <p className="text-sm">Use the form above to schedule your first appointment.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
