"use server"

import { type NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import type { Patient } from "../../../types"

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

export async function GET() {
  try {
    const patients = await readPatients()
    return NextResponse.json(patients)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read patients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newPatient: Patient = await request.json()
    const patients = await readPatients()

    // Generate ID if not provided
    if (!newPatient.id) {
      newPatient.id = `PAT${Date.now().toString().slice(-6)}`
    }

    patients.push(newPatient)
    await writePatients(patients)

    return NextResponse.json(newPatient, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 })
  }
}
