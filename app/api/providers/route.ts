"use server"

import { type NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import type { Provider } from "../../../types"

const DATA_DIR = join(process.cwd(), "data")
const PROVIDERS_FILE = join(DATA_DIR, "providers.json")

async function readProviders(): Promise<Provider[]> {
  try {
    const fileContent = await readFile(PROVIDERS_FILE, "utf-8")
    return JSON.parse(fileContent)
  } catch {
    return []
  }
}

async function writeProviders(providers: Provider[]): Promise<void> {
  await writeFile(PROVIDERS_FILE, JSON.stringify(providers, null, 2))
}

export async function GET() {
  try {
    const providers = await readProviders()
    return NextResponse.json(providers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read providers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newProvider: Provider = await request.json()
    const providers = await readProviders()

    // Generate ID if not provided
    if (!newProvider.id) {
      newProvider.id = `PROV${Date.now().toString().slice(-6)}`
    }

    providers.push(newProvider)
    await writeProviders(providers)

    return NextResponse.json(newProvider, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create provider" }, { status: 500 })
  }
}
