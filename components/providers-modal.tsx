"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, UserCheck, Phone, Mail, GraduationCap, Award, Calendar, Clock, Plus } from "lucide-react"

import { providers } from "../utils/data-utils"

interface ProvidersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProvidersModal({ open, onOpenChange }: ProvidersModalProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProviders = providers.filter(
    (provider) =>
      provider.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.professionalInfo.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.professionalInfo.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Provider Management
          </DialogTitle>
          <DialogDescription>View and manage healthcare provider information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search providers by name, specialty, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Provider
            </Button>
          </div>

          {/* Providers List */}
          <div className="grid gap-4">
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
                <Card key={provider.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5" />
                        {provider.personalInfo.title} {provider.personalInfo.firstName} {provider.personalInfo.lastName}
                      </CardTitle>
                      <Badge variant="outline">{provider.status}</Badge>
                    </div>
                    <CardDescription>
                      {provider.professionalInfo.specialty} • {provider.professionalInfo.department}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {/* Contact Info */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Contact</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {provider.personalInfo.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {provider.personalInfo.email}
                          </div>
                        </div>
                      </div>

                      {/* Professional Info */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Professional</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-3 w-3" />
                            {provider.professionalInfo.education}
                          </div>
                          <p>Experience: {provider.professionalInfo.yearsExperience} years</p>
                          <p>License: {provider.professionalInfo.licenseNumber}</p>
                        </div>
                      </div>

                      {/* Credentials */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <Award className="h-3 w-3" />
                          Credentials
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {provider.professionalInfo.credentials.map((credential, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {credential}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          Schedule
                        </h4>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {provider.schedule.workingHours.start} - {provider.schedule.workingHours.end}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {provider.schedule.workingDays.slice(0, 3).map((day, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {day.slice(0, 3)}
                              </Badge>
                            ))}
                            {provider.schedule.workingDays.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{provider.schedule.workingDays.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <UserCheck className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p>No providers found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
