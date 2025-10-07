'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Clock } from '@/lib/icons'

interface ScheduleStepProps {
  data: {
    operatingDays: string[]
    openTime: string
    closeTime: string
    is24Hours: boolean
  }
  onUpdate: (data: Partial<ScheduleStepProps['data']>) => void
  onNext: () => void
  onBack: () => void
}

const DAYS = [
  { id: 'monday', label: 'Lunes' },
  { id: 'tuesday', label: 'Martes' },
  { id: 'wednesday', label: 'Miércoles' },
  { id: 'thursday', label: 'Jueves' },
  { id: 'friday', label: 'Viernes' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
]

export function ScheduleStep({ data, onUpdate, onNext, onBack }: ScheduleStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  const toggleDay = (dayId: string) => {
    const newDays = data.operatingDays.includes(dayId)
      ? data.operatingDays.filter(d => d !== dayId)
      : [...data.operatingDays, dayId]
    onUpdate({ operatingDays: newDays })
  }

  const selectAllDays = () => {
    onUpdate({ operatingDays: DAYS.map(d => d.id) })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horarios de Operación</CardTitle>
        <CardDescription>Define cuándo está disponible tu estacionamiento</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Días de Operación *</Label>
              <Button
                type="button"
                variant="link"
                onClick={selectAllDays}
                className="h-auto p-0 text-blue-600"
              >
                Seleccionar todos
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {DAYS.map(day => (
                <div key={day.id} className="flex items-center gap-2">
                  <Checkbox
                    id={day.id}
                    checked={data.operatingDays.includes(day.id)}
                    onCheckedChange={() => toggleDay(day.id)}
                  />
                  <label htmlFor={day.id} className="cursor-pointer text-sm">
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="is24Hours"
                checked={data.is24Hours}
                onCheckedChange={(checked: boolean) => onUpdate({ is24Hours: checked })}
              />
              <label htmlFor="is24Hours" className="cursor-pointer text-sm font-medium">
                Abierto 24 horas
              </label>
            </div>

            {!data.is24Hours && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="openTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Hora de Apertura
                  </Label>
                  <input
                    id="openTime"
                    type="time"
                    value={data.openTime}
                    onChange={e => onUpdate({ openTime: e.target.value })}
                    className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                    required={!data.is24Hours}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closeTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Hora de Cierre
                  </Label>
                  <input
                    id="closeTime"
                    type="time"
                    value={data.closeTime}
                    onChange={e => onUpdate({ closeTime: e.target.value })}
                    className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                    required={!data.is24Hours}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Atrás
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Finalizar Configuración
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
