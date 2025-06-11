"use server"

import { type NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import type { Provider } from "../../../../types"

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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const providers = await readProviders()
    const provider = providers.find((p) => p.id === params.id)

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    return NextResponse.json(provider)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read provider" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedProvider: Provider = await request.json()
    const providers = await readProviders()
    const index = providers.findIndex((p) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    providers[index] = { ...updatedProvider, id: params.id }
    await writeProviders(providers)

    return NextResponse.json(providers[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update provider" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const providers = await readProviders()
    const index = providers.findIndex((p) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    const deletedProvider = providers.splice(index, 1)[0]
    await writeProviders(providers)

    return NextResponse.json(deletedProvider)
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete provider" }, { status: 500 })
  }
}
