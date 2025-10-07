'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from '@/lib/icons'

interface LocationStepProps {
  data: {
    address: string
    city: string
    province: string
    zipCode: string
    latitude: string
    longitude: string
  }
  onUpdate: (data: Partial<LocationStepProps['data']>) => void
  onNext: () => void
  onBack: () => void
}

export function LocationStep({ data, onUpdate, onNext, onBack }: LocationStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ubicación</CardTitle>
        <CardDescription>¿Dónde se encuentra tu estacionamiento?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              placeholder="Calle principal 123"
              value={data.address}
              onChange={e => onUpdate({ address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                placeholder="Quito"
                value={data.city}
                onChange={e => onUpdate({ city: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Provincia *</Label>
              <Input
                id="province"
                placeholder="Pichincha"
                value={data.province}
                onChange={e => onUpdate({ province: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">Código Postal</Label>
            <Input
              id="zipCode"
              placeholder="170150"
              value={data.zipCode}
              onChange={e => onUpdate({ zipCode: e.target.value })}
            />
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <h4 className="mb-2 text-sm font-medium">Coordenadas GPS (Opcional)</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="text-xs">
                      Latitud
                    </Label>
                    <Input
                      id="latitude"
                      placeholder="-0.1807"
                      value={data.latitude}
                      onChange={e => onUpdate({ latitude: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude" className="text-xs">
                      Longitud
                    </Label>
                    <Input
                      id="longitude"
                      placeholder="-78.4678"
                      value={data.longitude}
                      onChange={e => onUpdate({ longitude: e.target.value })}
                    />
                  </div>
                </div>
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
