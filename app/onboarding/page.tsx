'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/forms/protected-route'
import { OnboardingSteps } from '@/components/steps/onboarding-steps'
import { BasicInfoStep } from '@/components/steps/basic-info-step'
import { LocationStep } from '@/components/steps/location-step'
import { CapacityStep } from '@/components/steps/capacity-step'
import { PricingStep } from '@/components/steps/pricing-step'
import { ScheduleStep } from '@/components/steps/schedule-step'
import { Car } from '@/lib/icons'

const STEPS = [
  { id: 1, title: 'Información Básica', description: 'Datos de tu estacionamiento' },
  { id: 2, title: 'Ubicación', description: 'Dirección y localización' },
  { id: 3, title: 'Capacidad', description: 'Espacios disponibles' },
  { id: 4, title: 'Tarifas', description: 'Precios y comisiones' },
  { id: 5, title: 'Horarios', description: 'Días y horas de operación' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    // Location
    address: '',
    city: '',
    province: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    // Capacity
    totalSpaces: '',
    regularSpaces: '',
    disabledSpaces: '',
    electricSpaces: '',
    // Pricing
    hourlyRate: '',
    dailyRate: '',
    monthlyRate: '',
    // Schedule
    operatingDays: [] as string[],
    openTime: '08:00',
    closeTime: '20:00',
    is24Hours: false,
  })

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Save parking data and redirect to dashboard
      localStorage.setItem('parkeoya_parking', JSON.stringify(formData))
      router.push('/dashboard')
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
      <div className="bg-background min-h-screen">
        {/* Header */}
        <header className="bg-card border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ParkeoYa</h1>
                <p className="text-muted-foreground text-sm">Configuración inicial</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <OnboardingSteps steps={STEPS} currentStep={currentStep} />

          <div className="mt-8">
            {currentStep === 1 && (
              <BasicInfoStep data={formData} onUpdate={updateFormData} onNext={handleNext} />
            )}
            {currentStep === 2 && (
              <LocationStep
                data={formData}
                onUpdate={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <CapacityStep
                data={formData}
                onUpdate={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <PricingStep
                data={formData}
                onUpdate={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 5 && (
              <ScheduleStep
                data={formData}
                onUpdate={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
