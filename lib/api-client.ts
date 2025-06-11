"use client"

import type { Patient, Provider, Appointment } from "../types"

// Patients API
export const patientsApi = {
  getAll: async (): Promise<Patient[]> => {
    const response = await fetch("/api/patients")
    if (!response.ok) throw new Error("Failed to fetch patients")
    return response.json()
  },

  getById: async (id: string): Promise<Patient> => {
    const response = await fetch(`/api/patients/${id}`)
    if (!response.ok) throw new Error("Failed to fetch patient")
    return response.json()
  },

  create: async (patient: Omit<Patient, "id">): Promise<Patient> => {
    const response = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    })
    if (!response.ok) throw new Error("Failed to create patient")
    return response.json()
  },

  update: async (id: string, patient: Patient): Promise<Patient> => {
    const response = await fetch(`/api/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    })
    if (!response.ok) throw new Error("Failed to update patient")
    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/patients/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete patient")
  },
}

// Providers API
export const providersApi = {
  getAll: async (): Promise<Provider[]> => {
    const response = await fetch("/api/providers")
    if (!response.ok) throw new Error("Failed to fetch providers")
    return response.json()
  },

  getById: async (id: string): Promise<Provider> => {
    const response = await fetch(`/api/providers/${id}`)
    if (!response.ok) throw new Error("Failed to fetch provider")
    return response.json()
  },

  create: async (provider: Omit<Provider, "id">): Promise<Provider> => {
    const response = await fetch("/api/providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(provider),
    })
    if (!response.ok) throw new Error("Failed to create provider")
    return response.json()
  },

  update: async (id: string, provider: Provider): Promise<Provider> => {
    const response = await fetch(`/api/providers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(provider),
    })
    if (!response.ok) throw new Error("Failed to update provider")
    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/providers/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete provider")
  },
}

// Appointments API
export const appointmentsApi = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await fetch("/api/appointments")
    if (!response.ok) throw new Error("Failed to fetch appointments")
    const appointments = await response.json()

    // Convert date strings back to Date objects
    return appointments.map((apt: any) => ({
      ...apt,
      date: new Date(apt.date),
      createdAt: new Date(apt.createdAt),
      updatedAt: new Date(apt.updatedAt),
    }))
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await fetch(`/api/appointments/${id}`)
    if (!response.ok) throw new Error("Failed to fetch appointment")
    const appointment = await response.json()

    return {
      ...appointment,
      date: new Date(appointment.date),
      createdAt: new Date(appointment.createdAt),
      updatedAt: new Date(appointment.updatedAt),
    }
  },

  create: async (appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">): Promise<Appointment> => {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    })
    if (!response.ok) throw new Error("Failed to create appointment")
    const newAppointment = await response.json()

    return {
      ...newAppointment,
      date: new Date(newAppointment.date),
      createdAt: new Date(newAppointment.createdAt),
      updatedAt: new Date(newAppointment.updatedAt),
    }
  },

  update: async (id: string, appointment: Appointment): Promise<Appointment> => {
    const response = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    })
    if (!response.ok) throw new Error("Failed to update appointment")
    const updatedAppointment = await response.json()

    return {
      ...updatedAppointment,
      date: new Date(updatedAppointment.date),
      createdAt: new Date(updatedAppointment.createdAt),
      updatedAt: new Date(updatedAppointment.updatedAt),
    }
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/appointments/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete appointment")
  },
}
