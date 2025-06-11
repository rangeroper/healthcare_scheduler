"use server"

import { type NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import type { Patient } from "../../../../types"

const DATA_DIR = join(process.cwd(), "data")
const PATIENTS_FILE = join(DATA_DIR, "patients.json")

async function readPatients(): Promise<Patient[]> {
  try {
    const fileContent = await readFile(PATIENTS_FILE, "utf-8")
    return JSON.parse(fileContent)
  } catch {
    return []
  }
}

async function writePatients(patients: Patient[]): Promise<void> {
  await writeFile(PATIENTS_FILE, JSON.stringify(patients, null, 2))
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patients = await readPatients()
    const patient = patients.find((p) => p.id === params.id)

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read patient" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedPatient: Patient = await request.json()
    const patients = await readPatients()
    const index = patients.findIndex((p) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    patients[index] = { ...updatedPatient, id: params.id }
    await writePatients(patients)

    return NextResponse.json(patients[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patients = await readPatients()
    const index = patients.findIndex((p) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    const deletedPatient = patients.splice(index, 1)[0]
    await writePatients(patients)

    return NextResponse.json(deletedPatient)
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 })
  }
}
