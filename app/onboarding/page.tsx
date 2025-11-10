'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/forms/protected-route'
import { OnboardingSteps } from '@/components/steps/onboarding-steps'
import { BasicInfoStep } from '@/components/steps/basic-info-step'
import { LocationStep } from '@/components/steps/location-step'
import { CapacityStep } from '@/components/steps/capacity-step'
import { PricingStep } from '@/components/steps/pricing-step'
import { ScheduleStep } from '@/components/steps/schedule-step'
import { Car } from '@/lib/icons'
import { apiClient } from '@/lib/api/client'
import { getCurrentUser } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { formatTimeForBackend } from '@/lib/utils'

const STEPS = [
  { id: 1, title: 'Información Básica', description: 'Datos de tu estacionamiento' },
  { id: 2, title: 'Ubicación', description: 'Dirección y localización' },
  { id: 3, title: 'Capacidad', description: 'Espacios disponibles' },
  { id: 4, title: 'Tarifas', description: 'Precios y comisiones' },
  { id: 5, title: 'Horarios', description: 'Días y horas de operación' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    totalSpaces: '',
    regularSpaces: '',
    disabledSpaces: '',
    electricSpaces: '',
    hourlyRate: '',
    dailyRate: '',
    monthlyRate: '',
    operatingDays: [] as string[],
    openTime: '08:00',
    closeTime: '20:00',
    is24Hours: false,
  })

  useEffect(() => {
    const stepTitles = ['Información Básica', 'Ubicación', 'Capacidad', 'Tarifas', 'Horarios']
    document.title = `${stepTitles[currentStep - 1]} - Onboarding - Parkeoya`
    return () => {
      document.title = 'Parkeoya'
    }
  }, [currentStep])

  const handleNext = async () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    } else {
      await handleFinish()
    }
  }

  const handleFinish = async () => {
    setIsSubmitting(true)

    try {
      const user = getCurrentUser()
      if (!user?.id) {
        toast({
          title: 'Error',
          description: 'Usuario no encontrado',
          variant: 'destructive',
        })
        return
      }

      const parkingData = {
        ownerId: user.id,
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.zipCode,
        lat: parseFloat(formData.latitude) || 0,
        lng: parseFloat(formData.longitude) || 0,
        ratePerHour: formData.hourlyRate,
        dailyRate: formData.dailyRate,
        monthlyRate: formData.monthlyRate,
        totalSpots: formData.totalSpaces,
        regularSpots: formData.regularSpaces,
        disabledSpots: formData.disabledSpaces,
        electricSpots: formData.electricSpaces,
        availableSpots: formData.totalSpaces,
        totalRows: '10',
        totalColumns: '10',
        operatingDays: formData.operatingDays.join(','),
        open24Hours: formData.is24Hours,
        openingTime: formData.is24Hours ? undefined : formatTimeForBackend(formData.openTime),
        closingTime: formData.is24Hours ? undefined : formatTimeForBackend(formData.closeTime),
      }

      const parking = await apiClient.createParking(parkingData)

      toast({
        title: 'Estacionamiento creado',
        description: 'Creando espacios de parqueo...',
      })

      const totalSpots = parseInt(formData.totalSpaces)
      const disabledSpots = parseInt(formData.disabledSpaces) || 0
      const electricSpots = parseInt(formData.electricSpaces) || 0
      const regularSpots =
        parseInt(formData.regularSpaces) || totalSpots - disabledSpots - electricSpots

      let spotIndex = 1
      let row = 0
      let col = 0
      const spotsPerRow = 10

      for (let i = 0; i < disabledSpots; i++) {
        const label = `D-${String(spotIndex).padStart(2, '0')}`
        await apiClient.addParkingSpot(parking.id, {
          row: row,
          column: col,
          label: label,
        })
        spotIndex++
        col++
        if (col >= spotsPerRow) {
          col = 0
          row++
        }
      }

      for (let i = 0; i < electricSpots; i++) {
        const label = `E-${String(spotIndex).padStart(2, '0')}`
        await apiClient.addParkingSpot(parking.id, {
          row: row,
          column: col,
          label: label,
        })
        spotIndex++
        col++
        if (col >= spotsPerRow) {
          col = 0
          row++
        }
      }

      for (let i = 0; i < regularSpots; i++) {
        const label = `R-${String(spotIndex).padStart(2, '0')}`
        await apiClient.addParkingSpot(parking.id, {
          row: row,
          column: col,
          label: label,
        })
        spotIndex++
        col++
        if (col >= spotsPerRow) {
          col = 0
          row++
        }
      }

      toast({
        title: '¡Configuración completada!',
        description: `Se crearon ${totalSpots} espacios de parqueo exitosamente`,
      })

      localStorage.setItem('parkeoya_parking', JSON.stringify(formData))
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'No se pudo completar la configuración',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
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
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
