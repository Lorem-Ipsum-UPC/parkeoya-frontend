"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Info } from "@/lib/icons"

interface PricingStepProps {
  data: {
    hourlyRate: string
    dailyRate: string
    monthlyRate: string
  }
  onUpdate: (data: Partial<PricingStepProps["data"]>) => void
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
                <DollarSign className="w-4 h-4 text-blue-600" />
                Tarifa por Hora *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="2.50"
                  value={data.hourlyRate}
                  onChange={(e) => onUpdate({ hourlyRate: e.target.value })}
                  className="pl-7"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyRate" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                Tarifa Diaria
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="dailyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="15.00"
                  value={data.dailyRate}
                  onChange={(e) => onUpdate({ dailyRate: e.target.value })}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyRate" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                Tarifa Mensual
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="monthlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="200.00"
                  value={data.monthlyRate}
                  onChange={(e) => onUpdate({ monthlyRate: e.target.value })}
                  className="pl-7"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Comisión de la plataforma</p>
                <p className="text-blue-700 dark:text-blue-300">
                  ParkeoYa cobra una comisión del 15% sobre cada reserva completada. Esta comisión se descuenta
                  automáticamente de tus ingresos.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Atrás
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Continuar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
