'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ProtectedRoute } from '@/components/forms/protected-route'
import { OnboardingSteps } from '@/components/steps/onboarding-steps'
import { Car } from '@/lib/icons'
import { apiClient } from '@/lib/api'
import { getCachedProfile } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import type { CreateParkingRequest } from '@/lib/api'

interface OnboardingContextType {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  isFirst: boolean
  isLast: boolean
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingLayout')
  }
  return context
}

const STEPS = [
  {
    id: 1,
    title: 'Información Básica',
    description: 'Datos de tu estacionamiento',
    path: '/onboarding/informacion-basica',
  },
  {
    id: 2,
    title: 'Ubicación',
    description: 'Dirección y localización',
    path: '/onboarding/ubicacion',
  },
  { id: 3, title: 'Capacidad', description: 'Espacios disponibles', path: '/onboarding/capacidad' },
  { id: 4, title: 'Tarifas', description: 'Precios y comisiones', path: '/onboarding/tarifas' },
  {
    id: 5,
    title: 'Horarios',
    description: 'Días y horas de operación',
    path: '/onboarding/horarios',
  },
]

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
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
    totalSpaces: '50',
    regularSpaces: '40',
    disabledSpaces: '5',
    electricSpaces: '5',
    hourlyRate: '2.5',
    dailyRate: '15',
    monthlyRate: '200',
    operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    openTime: '08:00',
    closeTime: '20:00',
    is24Hours: false,
  })

  // Determinar step actual basado en la ruta
  const getCurrentStep = () => {
    const step = STEPS.find(s => s.path === pathname)
    return step ? step.id : 1
  }

  const currentStep = getCurrentStep()

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const handleNext = async () => {
    const nextStep = currentStep + 1
    if (nextStep <= STEPS.length) {
      const nextPath = STEPS[nextStep - 1].path
      router.push(nextPath)
    } else {
      // Último paso - Enviar datos al backend
      setIsSubmitting(true)
      
      try {
        const profile = getCachedProfile()
        if (!profile) {
          toast({
            title: 'Error',
            description: 'No se encontró el perfil de usuario',
            variant: 'destructive',
          })
          router.push('/login')
          return
        }

        // Mapear datos del frontend al formato del backend
        const parkingData: CreateParkingRequest = {
          ownerId: profile.parkingOwnerId,
          name: formData.name,
          description: formData.description,
          address: `${formData.address}, ${formData.city}, ${formData.province}, ${formData.zipCode}`,
          ratePerHour: parseFloat(formData.hourlyRate),
          totalSpots: parseInt(formData.totalSpaces),
          availableSpots: parseInt(formData.totalSpaces), // Inicialmente todos disponibles
          totalRows: Math.ceil(parseInt(formData.totalSpaces) / 10), // Estimación: 10 espacios por fila
          totalColumns: 10,
          imageUrl: '', // Backend requiere string, no null/undefined
        }

        console.log('Enviando datos al backend:', parkingData)
        console.log('Token disponible:', !!localStorage.getItem('parkeoya_token'))

        await apiClient.createParking(parkingData)

        toast({
          title: '¡Éxito!',
          description: 'Estacionamiento registrado correctamente',
        })

        router.push('/dashboard')
      } catch (error) {
        console.error('Error creating parking:', error)
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'No se pudo registrar el estacionamiento',
          variant: 'destructive',
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handlePrevious = () => {
    const prevStep = currentStep - 1
    if (prevStep >= 1) {
      const prevPath = STEPS[prevStep - 1].path
      router.push(prevPath)
    }
  }

  // Redireccionar si está en /onboarding sin step específico
  useEffect(() => {
    if (pathname === '/onboarding') {
      router.push('/onboarding/informacion-basica')
    }
  }, [pathname, router])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b bg-white">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Car className="text-primary-foreground h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">ParkeoYa</h1>
                <p className="text-muted-foreground text-xs">Configuración inicial</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <OnboardingSteps steps={STEPS} currentStep={currentStep} />

          <div className="mt-8">
            <OnboardingContext.Provider
              value={{
                data: formData,
                onUpdate: updateFormData,
                onNext: handleNext,
                onPrevious: handlePrevious,
                isFirst: currentStep === 1,
                isLast: currentStep === STEPS.length,
              }}
            >
              {isSubmitting ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    <p className="text-muted-foreground">Guardando estacionamiento...</p>
                  </div>
                </div>
              ) : (
                children
              )}
            </OnboardingContext.Provider>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
