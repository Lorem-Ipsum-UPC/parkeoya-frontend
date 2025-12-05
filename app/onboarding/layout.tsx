'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ProtectedRoute } from '@/components/forms/protected-route'
import { OnboardingSteps } from '@/components/steps/onboarding-steps'
import { Car } from '@/lib/icons'
import { apiClient } from '@/lib/api'
import { CreateParkingResource } from '@/lib/api/types'
import { getCurrentUser } from '@/lib/auth'

interface OnboardingContextType {
  data: any
  errorMessage: string
  setErrorMessage: (message: string) => void
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
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    totalSpaces: '1',
    regularSpaces: '1',
    disabledSpaces: '0',
    electricSpaces: '0',
    hourlyRate: '2.5',
    dailyRate: '15',
    monthlyRate: '200',
    totalRows: 1,
    totalColumns: 10,
    operatingDays: [] as string[],
    is24Hours: false,
    openTime: '08:00',
    closeTime: '20:00',
  })

  // Cargar datos guardados del localStorage al montar el componente
  useEffect(() => {
    const savedData = localStorage.getItem('parkeoya_onboarding_draft')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
      } catch (error) {
        // Si hay error al parsear, ignorar y usar valores por defecto
      }
    }
  }, [])

  const getCurrentStep = () => {
    const step = STEPS.find(s => s.path === pathname)
    return step ? step.id : 1
  }

  const currentStep = getCurrentStep()

  const updateFormData = (data: Partial<typeof formData>) => {
    const updatedData = { ...formData, ...data }
    setFormData(updatedData)
    // Guardar en localStorage cada vez que se actualiza
    localStorage.setItem('parkeoya_onboarding_draft', JSON.stringify(updatedData))
  }

  const handleNext = async () => {
    setErrorMessage('') // Limpiar errores previos
    const nextStep = currentStep + 1
    if (nextStep <= STEPS.length) {
      const nextPath = STEPS[nextStep - 1].path
      router.push(nextPath)
    } else {
      try {
        const user = getCurrentUser()
        if (!user || !user.id) {
          throw new Error('Usuario no encontrado')
        }

        const parkingData: CreateParkingResource = {
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
          totalRows: formData.totalRows.toString(),
          totalColumns: formData.totalColumns.toString(),
          operatingDays: formData.operatingDays.join(','),
          open24Hours: formData.is24Hours,
          openingTime: formData.is24Hours ? undefined : formData.openTime,
          closingTime: formData.is24Hours ? undefined : formData.closeTime,
        }

        // Crear el parking
        const createdParking = await apiClient.createParking(parkingData)

        // Crear los spots automáticamente
        const totalSpots = parseInt(formData.totalSpaces, 10)
        const regularSpots = parseInt(formData.regularSpaces, 10)
        const disabledSpots = parseInt(formData.disabledSpaces, 10)
        const electricSpots = parseInt(formData.electricSpaces, 10)

        // Calcular el grid necesario automáticamente (10 columnas por defecto)
        const columns = 10
        const rows = Math.ceil(totalSpots / columns)

        // Validación: Asegurarse de que totalSpots sea la suma correcta
        const calculatedTotal = regularSpots + disabledSpots + electricSpots
        const spotsToCreate = Math.min(totalSpots, calculatedTotal)

        console.log(`Creando ${spotsToCreate} spots: ${regularSpots} regulares, ${disabledSpots} discapacitados, ${electricSpots} eléctricos`)

        // Crear solo los spots especificados por el usuario
        for (let spotIndex = 0; spotIndex < spotsToCreate; spotIndex++) {
          const row = Math.floor(spotIndex / columns)
          const col = spotIndex % columns

          // Numeración global consecutiva
          const spotNumber = spotIndex + 1
          const label = spotNumber.toString()

          // Crear el spot
          await apiClient.addParkingSpot(createdParking.id, {
            row: row,
            column: col,
            label: label,
          })
        }

        // Limpiar el borrador del localStorage al completar exitosamente
        localStorage.removeItem('parkeoya_onboarding_draft')

        router.push('/dashboard')
      } catch (error) {
        const finalErrorMessage =
          error instanceof Error
            ? error.message
            : 'Error al guardar la configuración. Por favor intenta de nuevo.'
        setErrorMessage(finalErrorMessage)
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
                errorMessage,
                setErrorMessage,
                onUpdate: updateFormData,
                onNext: handleNext,
                onPrevious: handlePrevious,
                isFirst: currentStep === 1,
                isLast: currentStep === STEPS.length,
              }}
            >
              {/* Mensaje de error global para todos los steps */}
              {errorMessage && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-600 dark:text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {children}
            </OnboardingContext.Provider>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
