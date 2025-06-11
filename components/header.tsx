"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Calendar, User, UserCheck, Bell, Search, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DirectThemeToggle } from "./direct-theme-toggle"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onPatientsClick?: () => void
  onProvidersClick?: () => void
  onReportsClick?: () => void
}

export function Header({ onPatientsClick, onProvidersClick, onReportsClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-1">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="hidden font-bold text-xl md:inline-block">BookMD</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <button
            onClick={onPatientsClick}
            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
          >
            <User className="h-4 w-4" />
            Patients
          </button>
          <button
            onClick={onProvidersClick}
            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
          >
            <UserCheck className="h-4 w-4" />
            Providers
          </button>
          <button
            onClick={onReportsClick}
            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
          >
            <BarChart3 className="h-4 w-4" />
            Reports
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-40 lg:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8" />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <DirectThemeToggle />

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "container md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-64" : "max-h-0",
        )}
      >
        <nav className="flex flex-col space-y-3 pb-4">
          <Link href="#" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary">
            <Calendar className="h-4 w-4" />
            Dashboard
          </Link>
          <button
            onClick={() => {
              onPatientsClick?.()
              setIsMenuOpen(false)
            }}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary text-left"
          >
            <User className="h-4 w-4" />
            Patients
          </button>
          <button
            onClick={() => {
              onProvidersClick?.()
              setIsMenuOpen(false)
            }}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary text-left"
          >
            <UserCheck className="h-4 w-4" />
            Providers
          </button>
          <button
            onClick={() => {
              onReportsClick?.()
              setIsMenuOpen(false)
            }}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary text-left"
          >
            <BarChart3 className="h-4 w-4" />
            Reports
          </button>
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 w-full" />
          </div>
        </nav>
      </div>
    </header>
  )
}
