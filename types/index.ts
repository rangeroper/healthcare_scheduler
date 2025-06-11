export interface Patient {
  id: string
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    gender: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
    }
  }
  medicalInfo: {
    insuranceProvider: string
    insuranceId: string
    emergencyContact: {
      name: string
      relationship: string
      phone: string
    }
    allergies: string[]
    medications: string[]
    medicalHistory: string[]
  }
  status: string
  registrationDate: string
}

export interface Provider {
  id: string
  personalInfo: {
    firstName: string
    lastName: string
    title: string
    email: string
    phone: string
  }
  professionalInfo: {
    specialty: string
    credentials: string[]
    licenseNumber: string
    department: string
    yearsExperience: number
    education: string
  }
  schedule: {
    workingDays: string[]
    workingHours: {
      start: string
      end: string
    }
    lunchBreak: {
      start: string
      end: string
    }
  }
  status: string
  hireDate: string
}

export interface AppointmentType {
  id: string
  name: string
  duration: number
  description: string
  category: string
  cost: number
}

export interface Appointment {
  id: string
  patientId: string
  providerId: string
  appointmentTypeId: string
  date: Date
  time: string
  status: "Scheduled" | "Confirmed" | "In Progress" | "Completed" | "Cancelled" | "No Show"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface AppointmentWithDetails extends Appointment {
  patient: Patient
  provider: Provider
  appointmentType: AppointmentType
}

export type ViewMode = "list" | "calendar" | "patient" | "provider"
