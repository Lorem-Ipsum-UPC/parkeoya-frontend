"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { OnboardingSteps } from "@/components/onboarding/onboarding-steps"
import { BasicInfoStep } from "@/components/onboarding/basic-info-step"
import { LocationStep } from "@/components/onboarding/location-step"
import { CapacityStep } from "@/components/onboarding/capacity-step"
import { PricingStep } from "@/components/onboarding/pricing-step"
import { ScheduleStep } from "@/components/onboarding/schedule-step"
import { Car } from "@/lib/icons"

const STEPS = [
  { id: 1, title: "Información Básica", description: "Datos de tu estacionamiento" },
  { id: 2, title: "Ubicación", description: "Dirección y localización" },
  { id: 3, title: "Capacidad", description: "Espacios disponibles" },
  { id: 4, title: "Tarifas", description: "Precios y comisiones" },
  { id: 5, title: "Horarios", description: "Días y horas de operación" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    description: "",
    // Location
    address: "",
    city: "",
    province: "",
    zipCode: "",
    latitude: "",
    longitude: "",
    // Capacity
    totalSpaces: "",
    regularSpaces: "",
    disabledSpaces: "",
    electricSpaces: "",
    // Pricing
    hourlyRate: "",
    dailyRate: "",
    monthlyRate: "",
    // Schedule
    operatingDays: [] as string[],
    openTime: "08:00",
    closeTime: "20:00",
    is24Hours: false,
  })

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Save parking data and redirect to dashboard
      localStorage.setItem("parkeoya_parking", JSON.stringify(formData))
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ParkeoYa</h1>
                <p className="text-sm text-muted-foreground">Configuración inicial</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <OnboardingSteps steps={STEPS} currentStep={currentStep} />

          <div className="mt-8">
            {currentStep === 1 && <BasicInfoStep data={formData} onUpdate={updateFormData} onNext={handleNext} />}
            {currentStep === 2 && (
              <LocationStep data={formData} onUpdate={updateFormData} onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 3 && (
              <CapacityStep data={formData} onUpdate={updateFormData} onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 4 && (
              <PricingStep data={formData} onUpdate={updateFormData} onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 5 && (
              <ScheduleStep data={formData} onUpdate={updateFormData} onNext={handleNext} onBack={handleBack} />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
