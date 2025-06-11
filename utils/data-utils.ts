import type { Patient, Provider, AppointmentType, Appointment, AppointmentWithDetails } from "../types"

// Import JSON data
import patientsData from "../data/patients.json"
import providersData from "../data/providers.json"
import appointmentTypesData from "../data/appointment-types.json"

export let patients: Patient[] = patientsData
export const providers: Provider[] = providersData
export const appointmentTypes: AppointmentType[] = appointmentTypesData

export const addPatient = (patient: Patient) => {
  patients = [...patients, patient]
}

export const getPatientById = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id)
}

export const getProviderById = (id: string): Provider | undefined => {
  return providers.find((provider) => provider.id === id)
}

export const getAppointmentTypeById = (id: string): AppointmentType | undefined => {
  return appointmentTypes.find((type) => type.id === id)
}

export const getAppointmentWithDetails = (appointment: Appointment): AppointmentWithDetails | null => {
  const patient = getPatientById(appointment.patientId)
  const provider = getProviderById(appointment.providerId)
  const appointmentType = getAppointmentTypeById(appointment.appointmentTypeId)

  if (!patient || !provider || !appointmentType) {
    return null
  }

  return {
    ...appointment,
    patient,
    provider,
    appointmentType,
  }
}

export const formatPatientName = (patient: Patient): string => {
  return `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`
}

export const formatProviderName = (provider: Provider): string => {
  return `${provider.personalInfo.title} ${provider.personalInfo.firstName} ${provider.personalInfo.lastName}`
}

export const isProviderAvailable = (
  provider: Provider,
  date: Date,
  time: string,
  existingAppointments: Appointment[],
): boolean => {
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" })

  // Check if provider works on this day
  if (!provider.schedule.workingDays.includes(dayName)) {
    return false
  }

  // Check if time is within working hours
  const appointmentTime = new Date(`2000-01-01 ${time}`)
  const startTime = new Date(`2000-01-01 ${provider.schedule.workingHours.start}`)
  const endTime = new Date(`2000-01-01 ${provider.schedule.workingHours.end}`)
  const lunchStart = new Date(`2000-01-01 ${provider.schedule.lunchBreak.start}`)
  const lunchEnd = new Date(`2000-01-01 ${provider.schedule.lunchBreak.end}`)

  if (appointmentTime < startTime || appointmentTime >= endTime) {
    return false
  }

  // Check if time conflicts with lunch break
  if (appointmentTime >= lunchStart && appointmentTime < lunchEnd) {
    return false
  }

  // Check for existing appointments
  const hasConflict = existingAppointments.some(
    (apt) =>
      apt.providerId === provider.id &&
      apt.date.toDateString() === date.toDateString() &&
      apt.time === time &&
      apt.status !== "Cancelled",
  )

  return !hasConflict
}

export const getAvailableTimeSlots = (
  provider: Provider,
  date: Date,
  existingAppointments: Appointment[],
): string[] => {
  const slots: string[] = []
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" })

  if (!provider.schedule.workingDays.includes(dayName)) {
    return slots
  }

  const startHour = Number.parseInt(provider.schedule.workingHours.start.split(":")[0])
  const endHour = Number.parseInt(provider.schedule.workingHours.end.split(":")[0])
  const lunchStartHour = Number.parseInt(provider.schedule.lunchBreak.start.split(":")[0])
  const lunchEndHour = Number.parseInt(provider.schedule.lunchBreak.end.split(":")[0])

  for (let hour = startHour; hour < endHour; hour++) {
    // Skip lunch hour
    if (hour >= lunchStartHour && hour < lunchEndHour) {
      continue
    }

    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

      if (isProviderAvailable(provider, date, timeString, existingAppointments)) {
        slots.push(timeString)
      }
    }
  }

  return slots
}
