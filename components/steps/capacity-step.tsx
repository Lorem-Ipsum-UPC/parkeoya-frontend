'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, Zap, Accessibility } from '@/lib/icons'
import { useToast } from '@/hooks/use-toast'

interface CapacityStepProps {
  data: {
    totalSpaces: string
    regularSpaces: string
    disabledSpaces: string
    electricSpaces: string
  }
  onUpdate: (data: Partial<CapacityStepProps['data']>) => void
  onNext: () => void
  onBack: () => void
}

export function CapacityStep({ data, onUpdate, onNext, onBack }: CapacityStepProps) {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const total = Number.parseInt(data.totalSpaces || '0', 10) || 0
    const regular = Number.parseInt(data.regularSpaces || '0', 10) || 0
    const disabled = Number.parseInt(data.disabledSpaces || '0', 10) || 0
    const electric = Number.parseInt(data.electricSpaces || '0', 10) || 0

    const sum = regular + disabled + electric

    if (sum !== total) {
      toast({
        title: 'Error de validación',
        description: `La suma de los espacios (${sum}) debe ser igual al total (${total}).`,
        variant: 'destructive',
      })
      return
    }

    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capacidad</CardTitle>
        <CardDescription>Define la cantidad de espacios disponibles</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="totalSpaces">Total de Espacios *</Label>
            <Input
              id="totalSpaces"
              type="number"
              min="1"
              placeholder="50"
              value={data.totalSpaces}
              onChange={e => onUpdate({ totalSpaces: e.target.value })}
              required
            />
            <p className="text-muted-foreground text-xs">
              Número total de espacios en tu estacionamiento
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Distribución por Tipo</h4>

            <div className="space-y-2">
              <Label htmlFor="regularSpaces" className="flex items-center gap-2">
                <Car className="text-primary h-4 w-4" />
                Espacios Regulares
              </Label>
              <Input
                id="regularSpaces"
                type="number"
                min="0"
                placeholder="40"
                value={data.regularSpaces}
                onChange={e => onUpdate({ regularSpaces: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disabledSpaces" className="flex items-center gap-2">
                <Accessibility className="text-primary h-4 w-4" />
                Espacios para Personas con Discapacidad
              </Label>
              <Input
                id="disabledSpaces"
                type="number"
                min="0"
                placeholder="5"
                value={data.disabledSpaces}
                onChange={e => onUpdate({ disabledSpaces: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="electricSpaces" className="flex items-center gap-2">
                <Zap className="text-primary h-4 w-4" />
                Espacios con Carga Eléctrica
              </Label>
              <Input
                id="electricSpaces"
                type="number"
                min="0"
                placeholder="5"
                value={data.electricSpaces}
                onChange={e => onUpdate({ electricSpaces: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Atrás
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Continuar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
