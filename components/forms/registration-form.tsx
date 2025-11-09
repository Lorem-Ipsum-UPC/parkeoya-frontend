'use client'

import type React from 'react'

import { useState } from 'react'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive',
      })
      return
    }

    if (!acceptedTerms) {
      toast({
        title: 'Error',
        description: 'Debes aceptar los términos y condiciones',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      // Call actual API
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

      // Store user data (no token yet, user needs to login)
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
      toast({
        title: 'Error al crear cuenta',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      })
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

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </Button>
    </form>
  )
}
