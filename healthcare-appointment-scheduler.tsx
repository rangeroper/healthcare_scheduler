"use client"

import { useState, useEffect } from "react"
import { Header } from "./components/header"
import { PatientsModal } from "./components/patients-modal"
import { ProvidersModal } from "./components/providers-modal"
import { ReportsModal } from "./components/reports-modal"
import { ThemeDebug } from "./components/theme-debug"

import type { Appointment, AppointmentWithDetails, ViewMode, Patient, Provider } from "./types"
import { AppointmentForm } from "./components/appointment-form"
import { AppointmentsTable } from "./components/appointments-table"
import { ViewSelector } from "./components/view-selector"
import { PatientView } from "./components/patient-view"
import { ProviderView } from "./components/provider-view"
import { CalendarView } from "./components/calendar-view"
import { PatientForm } from "./components/patient-form"
import { appointmentsApi, patientsApi, providersApi } from "./lib/api-client"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function HealthcareAppointmentScheduler() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [currentView, setCurrentView] = useState<ViewMode>("list")
  const [showPatientForm, setShowPatientForm] = useState(false)

  // Modal states
  const [showPatientsModal, setShowPatientsModal] = useState(false)
  const [showProvidersModal, setShowProvidersModal] = useState(false)
  const [showReportsModal, setShowReportsModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [appointmentsData, patientsData, providersData] = await Promise.all([
        appointmentsApi.getAll(),
        patientsApi.getAll(),
        providersApi.getAll(),
      ])

      setAppointments(appointmentsData)
      setPatients(patientsData)
      setProviders(providersData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    }
  }

  const handleAppointmentCreate = async (appointmentData: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newAppointment = await appointmentsApi.create(appointmentData)
      setAppointments([...appointments, newAppointment])
      toast({
        title: "Appointment Scheduled",
        description: "Appointment has been scheduled successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule appointment",
        variant: "destructive",
      })
    }
  }

  const handlePatientAdded = async (patientData: Omit<Patient, "id">) => {
    try {
      const newPatient = await patientsApi.create(patientData)
      setPatients([...patients, newPatient])
      setShowPatientForm(false)
      toast({
        title: "Patient Added",
        description: `${newPatient.personalInfo.firstName} ${newPatient.personalInfo.lastName} has been added successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add patient",
        variant: "destructive",
      })
    }
  }

  // Convert appointments to detailed appointments for display
  const appointmentsWithDetails: AppointmentWithDetails[] = appointments
    .map((appointment) => {
      const patient = patients.find((p) => p.id === appointment.patientId)
      const provider = providers.find((p) => p.id === appointment.providerId)

      if (!patient || !provider) return null

      return {
        ...appointment,
        patient,
        provider,
        appointmentType: {
          id: appointment.appointmentTypeId,
          name: "General Consultation",
          duration: 30,
          description: "",
          category: "Consultation",
          cost: 150,
        }, // This should come from appointmentTypes
      }
    })
    .filter((apt): apt is AppointmentWithDetails => apt !== null)
    .sort((a, b) => {
      const dateA = new Date(`${a.date.toDateString()} ${a.time}`)
      const dateB = new Date(`${b.date.toDateString()} ${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })

  const renderView = () => {
    switch (currentView) {
      case "list":
        return <AppointmentsTable appointments={appointmentsWithDetails} />
      case "calendar":
        return <CalendarView appointments={appointmentsWithDetails} />
      case "patient":
        return <PatientView appointments={appointmentsWithDetails} />
      case "provider":
        return <ProviderView appointments={appointmentsWithDetails} />
      default:
        return <AppointmentsTable appointments={appointmentsWithDetails} />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onPatientsClick={() => setShowPatientsModal(true)}
        onProvidersClick={() => setShowProvidersModal(true)}
        onReportsClick={() => setShowReportsModal(true)}
      />
      <main className="flex-1">
        <div className="container py-8 space-y-8">
          {/* Hero Section */}
          <section className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-8 md:p-12 shadow-sm">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl md:text-5xl">
                Healthcare Appointment Scheduler
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Streamline your practice with our comprehensive patient appointment management system
              </p>
            </div>
          </section>

          {/* Appointment Form */}
          <section className="mx-auto max-w-4xl">
            <AppointmentForm
              appointments={appointments}
              onAppointmentCreate={handleAppointmentCreate}
              patients={patients}
              providers={providers}
            />
          </section>

          {/* Patient Management */}
          {showPatientForm && (
            <section className="mx-auto max-w-4xl">
              <PatientForm onPatientAdded={handlePatientAdded} />
            </section>
          )}

          <section className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowPatientForm(!showPatientForm)}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              {showPatientForm ? "Hide Patient Form" : "Add New Patient"}
            </Button>
          </section>

          {/* View Selector */}
          <section className="flex justify-center">
            <ViewSelector currentView={currentView} onViewChange={setCurrentView} />
          </section>

          {/* Dynamic View */}
          <section className="transition-all duration-300 ease-in-out">{renderView()}</section>
        </div>
      </main>

      {/* Modals */}
      <PatientsModal open={showPatientsModal} onOpenChange={setShowPatientsModal} />
      <ProvidersModal open={showProvidersModal} onOpenChange={setShowProvidersModal} />
      <ReportsModal open={showReportsModal} onOpenChange={setShowReportsModal} appointments={appointmentsWithDetails} />

      {/* Theme Debug */}
      <ThemeDebug />
    </div>
  )
}
