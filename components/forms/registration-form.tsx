'use client'

import type React from 'react'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff } from '@/lib/icons'

export function RegistrationForm() {
  const { signUp, isLoading, error } = useAuth()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    companyName: '',
    ruc: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

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

    if (formData.ruc.length !== 11) {
      toast({
        title: 'Error',
        description: 'El RUC debe tener 11 dígitos',
        variant: 'destructive',
      })
      return
    }

    if (formData.phone.length !== 9) {
      toast({
        title: 'Error',
        description: 'El teléfono debe tener 9 dígitos',
        variant: 'destructive',
      })
      return
    }

    const { confirmPassword, ...signUpData } = formData

    const result = await signUp(signUpData)

    if (result.success) {
      toast({
        title: 'Cuenta creada',
        description: 'Bienvenido a ParkeoYa',
      })
    } else {
      toast({
        title: 'Error',
        description: result.error || 'No se pudo crear la cuenta',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Información de Cuenta */}
      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="tu@empresa.com"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 3 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={3}
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
            name="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={3}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Información Personal */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre Completo</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Juan Pérez"
          value={formData.fullName}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            name="city"
            type="text"
            placeholder="Lima"
            value={formData.city}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Input
            id="country"
            name="country"
            type="text"
            placeholder="Perú"
            value={formData.country}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="987654321"
          value={formData.phone}
          onChange={handleChange}
          required
          pattern="[0-9]{9}"
          maxLength={9}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">9 dígitos</p>
      </div>

      {/* Información de Empresa */}
      <div className="space-y-2">
        <Label htmlFor="companyName">Nombre de Empresa</Label>
        <Input
          id="companyName"
          name="companyName"
          type="text"
          placeholder="Estacionamientos XYZ"
          value={formData.companyName}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ruc">RUC</Label>
        <Input
          id="ruc"
          name="ruc"
          type="text"
          placeholder="20123456789"
          value={formData.ruc}
          onChange={handleChange}
          required
          pattern="[0-9]{11}"
          maxLength={11}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">11 dígitos</p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>
      )}

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
