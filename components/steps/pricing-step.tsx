'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Info } from '@/lib/icons'

interface PricingStepProps {
  data: {
    hourlyRate: string
    dailyRate: string
    monthlyRate: string
  }
  onUpdate: (data: Partial<PricingStepProps['data']>) => void
  onNext: () => void
  onBack: () => void
}

export function PricingStep({ data, onUpdate, onNext, onBack }: PricingStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarifas</CardTitle>
        <CardDescription>Establece los precios para tu estacionamiento</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate" className="flex items-center gap-2">
                <DollarSign className="text-primary h-4 w-4" />
                Tarifa por Hora *
              </Label>
              <div className="relative">
                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                  $
                </span>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="2.50"
                  value={data.hourlyRate}
                  onChange={e => onUpdate({ hourlyRate: e.target.value })}
                  className="pl-7"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyRate" className="flex items-center gap-2">
                <DollarSign className="text-primary h-4 w-4" />
                Tarifa Diaria
              </Label>
              <div className="relative">
                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                  $
                </span>
                <Input
                  id="dailyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="15.00"
                  value={data.dailyRate}
                  onChange={e => onUpdate({ dailyRate: e.target.value })}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyRate" className="flex items-center gap-2">
                <DollarSign className="text-primary h-4 w-4" />
                Tarifa Mensual
              </Label>
              <div className="relative">
                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                  $
                </span>
                <Input
                  id="monthlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="200.00"
                  value={data.monthlyRate}
                  onChange={e => onUpdate({ monthlyRate: e.target.value })}
                  className="pl-7"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
            <div className="flex items-start gap-3">
              <Info className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
              <div className="text-sm">
                <p className="mb-1 font-medium text-blue-900 dark:text-blue-100">
                  Comisión de la plataforma
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  ParkeoYa cobra una comisión del 15% sobre cada reserva completada. Esta comisión
                  se descuenta automáticamente de tus ingresos.
                </p>
              </div>
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
