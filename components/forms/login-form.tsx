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
      toast({
        title: 'Error de inicio de sesión',
        description: error instanceof Error ? error.message : 'Credenciales inválidas',
        variant: 'destructive',
      })
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

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  )
}
