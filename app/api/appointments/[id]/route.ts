"use server"

import { type NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import type { Appointment } from "../../../../types"

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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appointments = await readAppointments()
    const appointment = appointments.find((a) => a.id === params.id)

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read appointment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedAppointment: Appointment = await request.json()
    const appointments = await readAppointments()
    const index = appointments.findIndex((a) => a.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Convert date string to Date object if needed
    if (typeof updatedAppointment.date === "string") {
      updatedAppointment.date = new Date(updatedAppointment.date)
    }

    appointments[index] = {
      ...updatedAppointment,
      id: params.id,
      updatedAt: new Date(),
    }
    await writeAppointments(appointments)

    return NextResponse.json(appointments[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appointments = await readAppointments()
    const index = appointments.findIndex((a) => a.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    const deletedAppointment = appointments.splice(index, 1)[0]
    await writeAppointments(appointments)

    return NextResponse.json(deletedAppointment)
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 })
  }
}
