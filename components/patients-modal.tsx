"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, User, Phone, Mail, MapPin, Pill, AlertTriangle, Shield, Plus, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"

import { PatientForm } from "./patient-form"
import { EditPatientModal } from "./edit-patient-modal"
import type { Patient } from "../types"
import { patientsApi } from "../lib/api-client"

interface PatientsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientsModal({ open, onOpenChange }: PatientsModalProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadPatients()
    }
  }, [open])

  const loadPatients = async () => {
    setLoading(true)
    try {
      const data = await patientsApi.getAll()
      setPatients(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.personalInfo.phone.includes(searchTerm),
  )

  const handlePatientAdded = async (patient: Patient) => {
    try {
      const newPatient = await patientsApi.create(patient)
      setPatients([...patients, newPatient])
      setShowAddForm(false)
      toast({
        title: "Patient Added",
        description: `${newPatient.personalInfo.firstName} ${newPatient.personalInfo.lastName} has been added successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add patient",
        variant: "destructive",
      })
    }
  }

  const handlePatientUpdated = (updatedPatient: Patient) => {
    setPatients(patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)))
  }

  const handleDeletePatient = async (patient: Patient) => {
    if (
      !confirm(`Are you sure you want to delete ${patient.personalInfo.firstName} ${patient.personalInfo.lastName}?`)
    ) {
      return
    }

    try {
      await patientsApi.delete(patient.id)
      setPatients(patients.filter((p) => p.id !== patient.id))
      toast({
        title: "Patient Deleted",
        description: `${patient.personalInfo.firstName} ${patient.personalInfo.lastName} has been deleted.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Management
            </DialogTitle>
            <DialogDescription>View and manage patient information</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Search and Add */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {showAddForm ? "Cancel" : "Add Patient"}
              </Button>
            </div>

            {/* Add Patient Form */}
            {showAddForm && (
              <div className="border rounded-lg p-4">
                <PatientForm onPatientAdded={handlePatientAdded} />
              </div>
            )}

            {/* Patients List */}
            <div className="grid gap-4">
              {loading ? (
                <div className="text-center py-8">Loading patients...</div>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <Card key={patient.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {patient.personalInfo.firstName} {patient.personalInfo.lastName}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{patient.status}</Badge>
                          <Button variant="outline" size="sm" onClick={() => setEditingPatient(patient)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeletePatient(patient)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        Patient ID: {patient.id} • Registered:{" "}
                        {format(new Date(patient.registrationDate), "MMM dd, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Contact Info */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Contact Information</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              {patient.personalInfo.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {patient.personalInfo.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              {patient.personalInfo.address.city}, {patient.personalInfo.address.state}
                            </div>
                          </div>
                        </div>

                        {/* Medical Info */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Medical Information</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Shield className="h-3 w-3" />
                              {patient.medicalInfo.insuranceProvider}
                            </div>
                            <p>DOB: {format(new Date(patient.personalInfo.dateOfBirth), "MMM dd, yyyy")}</p>
                            <p>Gender: {patient.personalInfo.gender}</p>
                          </div>
                        </div>

                        {/* Alerts */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Medical Alerts</h4>
                          <div className="space-y-2">
                            {patient.medicalInfo.allergies.length > 0 && (
                              <div>
                                <div className="flex items-center gap-1 text-xs font-medium text-red-600">
                                  <AlertTriangle className="h-3 w-3" />
                                  Allergies
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {patient.medicalInfo.allergies.slice(0, 2).map((allergy, index) => (
                                    <Badge key={index} variant="destructive" className="text-xs">
                                      {allergy}
                                    </Badge>
                                  ))}
                                  {patient.medicalInfo.allergies.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{patient.medicalInfo.allergies.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {patient.medicalInfo.medications.length > 0 && (
                              <div>
                                <div className="flex items-center gap-1 text-xs font-medium text-blue-600">
                                  <Pill className="h-3 w-3" />
                                  Medications
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {patient.medicalInfo.medications.slice(0, 2).map((medication, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {medication}
                                    </Badge>
                                  ))}
                                  {patient.medicalInfo.medications.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{patient.medicalInfo.medications.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p>No patients found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EditPatientModal
        open={!!editingPatient}
        onOpenChange={(open) => !open && setEditingPatient(null)}
        patient={editingPatient}
        onPatientUpdated={handlePatientUpdated}
      />
    </>
  )
}
