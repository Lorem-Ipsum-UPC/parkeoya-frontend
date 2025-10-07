'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ProtectedRoute } from '@/components/forms/protected-route'
import { OnboardingSteps } from '@/components/steps/onboarding-steps'
import { Car } from '@/lib/icons'

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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    totalSpaces: 50,
    hourlyRate: 2.5,
    dailyRate: 15,
    monthlyRate: 200,
    schedule: {
      monday: { enabled: true, start: '08:00', end: '20:00' },
      tuesday: { enabled: true, start: '08:00', end: '20:00' },
      wednesday: { enabled: true, start: '08:00', end: '20:00' },
      thursday: { enabled: true, start: '08:00', end: '20:00' },
      friday: { enabled: true, start: '08:00', end: '20:00' },
      saturday: { enabled: true, start: '09:00', end: '18:00' },
      sunday: { enabled: false, start: '09:00', end: '18:00' },
    },
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

  const handleNext = () => {
    const nextStep = currentStep + 1
    if (nextStep <= STEPS.length) {
      const nextPath = STEPS[nextStep - 1].path
      router.push(nextPath)
    } else {
      // Completar onboarding
      router.push('/dashboard')
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Car className="h-5 w-5 text-white" />
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
              {children}
            </OnboardingContext.Provider>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
