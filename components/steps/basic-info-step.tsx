'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BasicInfoStepProps {
  data: {
    name: string
    description: string
  }
  onUpdate: (data: Partial<BasicInfoStepProps['data']>) => void
  onNext: () => void
}

export function BasicInfoStep({ data, onUpdate, onNext }: BasicInfoStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Básica</CardTitle>
        <CardDescription>Cuéntanos sobre tu estacionamiento</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Estacionamiento *</Label>
            <Input
              id="name"
              placeholder="Ej: Estacionamiento Centro Comercial"
              value={data.name}
              onChange={e => onUpdate({ name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe tu estacionamiento, servicios adicionales, características especiales..."
              value={data.description}
              onChange={e => onUpdate({ description: e.target.value })}
              rows={4}
            />
            <p className="text-muted-foreground text-xs">
              Esta información será visible para los conductores
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Continuar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
