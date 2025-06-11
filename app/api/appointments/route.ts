"use server"

import { type NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import type { Appointment } from "../../../types"

const DATA_DIR = join(process.cwd(), "data")
const APPOINTMENTS_FILE = join(DATA_DIR, "appointments.json")

async function readAppointments(): Promise<Appointment[]> {
  try {
    const fileContent = await readFile(APPOINTMENTS_FILE, "utf-8")
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

async function writeAppointments(appointments: Appointment[]): Promise<void> {
  await writeFile(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2))
}

export async function GET() {
  try {
    const appointments = await readAppointments()
    return NextResponse.json(appointments)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read appointments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newAppointment: Appointment = await request.json()
    const appointments = await readAppointments()

    // Generate ID if not provided
    if (!newAppointment.id) {
      newAppointment.id = `APT${Date.now()}`
    }

    // Ensure dates are properly set
    newAppointment.createdAt = new Date()
    newAppointment.updatedAt = new Date()

    // Convert date string to Date object if needed
    if (typeof newAppointment.date === "string") {
      newAppointment.date = new Date(newAppointment.date)
    }

    appointments.push(newAppointment)
    await writeAppointments(appointments)

    return NextResponse.json(newAppointment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}
