'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff } from '@/lib/icons'
import { apiClient } from '@/lib/api/client'

export function RegistrationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    country: '',
    companyName: '',
    ruc: '',
  })

  useEffect(() => {
    document.title = 'Registro - Parkeoya'
    return () => {
      document.title = 'Parkeoya'
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('') // Limpiar errores previos

    // Validación de campos vacíos
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMessage('Por favor completa todos los campos obligatorios')
      return
    }

    // Validación de email
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Por favor ingresa un correo electrónico válido')
      return
    }

    // Validación de contraseña
    if (formData.password.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden')
      return
    }

    if (!acceptedTerms) {
      setErrorMessage('Debes aceptar los términos y condiciones')
      return
    }

    setIsLoading(true)

    try {
      const user = await apiClient.signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        companyName: formData.companyName,
        ruc: formData.ruc,
      })

      localStorage.setItem(
        'parkeoya_user',
        JSON.stringify({
          id: user.id,
          email: user.email,
          name: formData.name,
        })
      )

      toast({
        title: 'Cuenta creada exitosamente',
        description: 'Ahora inicia sesión para configurar tu estacionamiento',
      })

      router.push('/login')
    } catch (error) {
      let finalErrorMessage = 'No se pudo crear la cuenta. Verifica los datos ingresados'

      if (error instanceof Error) {
        // Usar el mensaje completo del backend
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

        // Intentar detectar el tipo de error para personalizar el mensaje
        const msg = error.message.toLowerCase()

        if (
          msg.includes('email') &&
          (msg.includes('exist') || msg.includes('already') || msg.includes('duplicate'))
        ) {
          finalErrorMessage = 'Este correo electrónico ya está registrado. Intenta iniciar sesión'
        } else if (msg.includes('phone')) {
          finalErrorMessage = `Error en teléfono: ${finalErrorMessage}`
        } else if (msg.includes('password')) {
          finalErrorMessage = `Error en contraseña: ${finalErrorMessage}`
        } else if (msg.includes('ruc')) {
          finalErrorMessage = `Error en RUC: ${finalErrorMessage}`
        } else if (msg.includes('network') || msg.includes('fetch')) {
          finalErrorMessage = 'No se pudo conectar con el servidor. Verifica tu internet'
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre Completo</Label>
        <Input
          id="name"
          type="text"
          placeholder="Miguel Castro"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

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
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+593 99 999 9999"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            type="text"
            placeholder="Quito"
            value={formData.city}
            onChange={e => setFormData({ ...formData, city: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Input
            id="country"
            type="text"
            placeholder="Ecuador"
            value={formData.country}
            onChange={e => setFormData({ ...formData, country: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Nombre de la Empresa</Label>
        <Input
          id="companyName"
          type="text"
          placeholder="Mi Estacionamiento S.A."
          value={formData.companyName}
          onChange={e => setFormData({ ...formData, companyName: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ruc">RUC</Label>
        <Input
          id="ruc"
          type="text"
          placeholder="1234567890001"
          value={formData.ruc}
          onChange={e => setFormData({ ...formData, ruc: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={8}
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Repite tu contraseña"
          value={formData.confirmPassword}
          onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked: boolean | 'indeterminate') => {
            setAcceptedTerms(checked === true)
          }}
          disabled={isLoading}
        />
        <label htmlFor="terms" className="text-muted-foreground text-sm leading-relaxed">
          Acepto los{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">
            términos y condiciones
          </a>{' '}
          y la{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">
            política de privacidad
          </a>
        </label>
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
        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </Button>
    </form>
  )
}
