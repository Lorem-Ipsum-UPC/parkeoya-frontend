'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff } from '@/lib/icons'
import { apiClient } from '@/lib/api/client'

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    document.title = 'Iniciar Sesión - Parkeoya'
    return () => {
      document.title = 'Parkeoya'
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('') // Limpiar errores previos

    // Validaciones del frontend
    if (!formData.email || !formData.password) {
      setErrorMessage('Por favor completa todos los campos')
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Por favor ingresa un correo electrónico válido')
      return
    }

    setIsLoading(true)

    try {
      const response = await apiClient.signIn({
        email: formData.email,
        password: formData.password,
      })

      localStorage.setItem('parkeoya_token', response.token)

      // Obtener el perfil del parking owner para obtener el nombre completo
      try {
        const profile = await apiClient.getParkingOwnerProfile(response.id)
        localStorage.setItem(
          'parkeoya_user',
          JSON.stringify({
            id: response.id,
            email: response.email,
            name: profile.fullName,
          })
        )
      } catch (error) {
        // Si falla obtener el perfil, usar email como fallback
        localStorage.setItem(
          'parkeoya_user',
          JSON.stringify({
            id: response.id,
            email: response.email,
            name: response.email.split('@')[0],
          })
        )
      }

      try {
        const parkings = await apiClient.getParkingsByOwnerId(response.id)
        if (parkings.length === 0) {
          toast({
            title: 'Bienvenido a ParkeoYa',
            description: 'Completa el registro de tu estacionamiento',
          })
          router.push('/onboarding')
        } else {
          toast({
            title: 'Inicio de sesión exitoso',
            description: 'Bienvenido de nuevo a ParkeoYa',
          })
          router.push('/dashboard')
        }
      } catch (error) {
        router.push('/onboarding')
      }
    } catch (error) {
      let finalErrorMessage = 'Credenciales inválidas'

      if (error instanceof Error) {
        finalErrorMessage = error.message

        // Intentar limpiar el mensaje si viene en formato JSON
        try {
          const parsed = JSON.parse(error.message)
          if (parsed.message) finalErrorMessage = parsed.message
          else if (parsed.error) finalErrorMessage = parsed.error
          else if (parsed.detail) finalErrorMessage = parsed.detail
        } catch {
          // Si no es JSON, usar el mensaje tal cual
        }

        // Mensajes más específicos según el tipo de error
        const msg = error.message.toLowerCase()
        if (msg.includes('credential') || msg.includes('unauthorized')) {
          finalErrorMessage = 'Email o contraseña incorrectos'
        } else if (msg.includes('not found')) {
          finalErrorMessage = 'Usuario no encontrado. ¿Ya te registraste?'
        } else if (msg.includes('network') || msg.includes('fetch')) {
          finalErrorMessage = 'Error de conexión. Verifica tu internet'
        } else if (msg.includes('400')) {
          finalErrorMessage = `Datos inválidos: ${finalErrorMessage}`
        } else if (msg.includes('500')) {
          finalErrorMessage = `Error del servidor: ${finalErrorMessage}`
        }
      }

      // Mostrar error inline en el formulario
      setErrorMessage(finalErrorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <button type="button" className="text-sm text-blue-600 hover:text-blue-700">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mensaje de error inline */}
      {errorMessage && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
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
              <p className="text-sm font-medium text-red-800 dark:text-red-300">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  )
}
