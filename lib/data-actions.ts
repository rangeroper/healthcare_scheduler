"use server"

import { writeFile, readFile } from "fs/promises"
import { join } from "path"
import type { Patient, Provider, Appointment } from "../types"

const DATA_DIR = join(process.cwd(), "data")

export async function saveAppointment(appointment: Appointment) {
  try {
    const filePath = join(DATA_DIR, "appointments.json")
    let appointments: Appointment[] = []

    try {
      const fileContent = await readFile(filePath, "utf-8")
      appointments = JSON.parse(fileContent)
    } catch {
      // File doesn't exist, start with empty array
    }

    appointments.push(appointment)
    await writeFile(filePath, JSON.stringify(appointments, null, 2))
    return { success: true }
  } catch (error) {
    console.error("Error saving appointment:", error)
    return { success: false, error: "Failed to save appointment" }
  }
}

export async function savePatient(patient: Patient) {
  try {
    const filePath = join(DATA_DIR, "patients.json")
    let patients: Patient[] = []

    try {
      const fileContent = await readFile(filePath, "utf-8")
      patients = JSON.parse(fileContent)
    } catch {
      // File doesn't exist, start with empty array
    }

    patients.push(patient)
    await writeFile(filePath, JSON.stringify(patients, null, 2))
    return { success: true }
  } catch (error) {
    console.error("Error saving patient:", error)
    return { success: false, error: "Failed to save patient" }
  }
}

export async function saveProvider(provider: Provider) {
  try {
    const filePath = join(DATA_DIR, "providers.json")
    let providers: Provider[] = []

    try {
      const fileContent = await readFile(filePath, "utf-8")
      providers = JSON.parse(fileContent)
    } catch {
      // File doesn't exist, start with empty array
    }

    providers.push(provider)
    await writeFile(filePath, JSON.stringify(providers, null, 2))
    return { success: true }
  } catch (error) {
    console.error("Error saving provider:", error)
    return { success: false, error: "Failed to save provider" }
  }
}

export async function loadAppointments(): Promise<Appointment[]> {
  try {
    const filePath = join(DATA_DIR, "appointments.json")
    const fileContent = await readFile(filePath, "utf-8")
    const appointments = JSON.parse(fileContent)

    // Convert date strings back to Date objects
    return appointments.map((apt: any) => ({
      ...apt,
      date: new Date(apt.date),
      createdAt: new Date(apt.createdAt),
      updatedAt: new Date(apt.updatedAt),
    }))
  } catch {
    return []
  }
}
