'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, User, Edit, Save, X } from '@/lib/icons'
import { apiClient } from '@/lib/api/client'
import { getCurrentUser } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import type { ParkingResource, ParkingOwnerProfile } from '@/lib/api/types'
import { formatTimeDisplay } from '@/lib/utils'

export function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [parking, setParking] = useState<ParkingResource | null>(null)
  const [profile, setProfile] = useState<ParkingOwnerProfile | null>(null)

  // Form states
  const [parkingForm, setParkingForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    ratePerHour: 0,
    dailyRate: 0,
    monthlyRate: 0,
    operatingDays: '',
    open24Hours: false,
    openingTime: '',
    closingTime: '',
  })

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    city: '',
    country: '',
    phone: '',
    companyName: '',
    ruc: '',
  })

  const loadData = useCallback(async () => {
    const user = getCurrentUser()
    if (!user?.id) {
      router.push('/login')
      return
    }

    try {
      // Get user's parking
      const parkings = await apiClient.getParkingsByOwnerId(user.id)
      if (parkings.length === 0) {
        router.push('/onboarding')
        return
      }

      const userParking = parkings[0]
      setParking(userParking)
      setParkingForm({
        name: userParking.name,
        description: userParking.description,
        address: userParking.address,
        city: userParking.city,
        province: userParking.province,
        postalCode: userParking.postalCode,
        ratePerHour: userParking.ratePerHour,
        dailyRate: userParking.dailyRate,
        monthlyRate: userParking.monthlyRate,
        operatingDays: userParking.operatingDays,
        open24Hours: userParking.open24Hours,
        openingTime: userParking.openingTime ? formatTimeDisplay(userParking.openingTime) : '',
        closingTime: userParking.closingTime ? formatTimeDisplay(userParking.closingTime) : '',
      })

      // Get owner profile
      const ownerProfile = await apiClient.getParkingOwnerProfile(user.id)
      setProfile(ownerProfile)
      setProfileForm({
        fullName: ownerProfile.fullName,
        city: ownerProfile.city,
        country: ownerProfile.country,
        phone: ownerProfile.phone,
        companyName: ownerProfile.companyName,
        ruc: ownerProfile.ruc,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [router, toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCancel = () => {
    setIsEditing(false)
    // Reset forms to original values
    if (parking) {
      setParkingForm({
        name: parking.name,
        description: parking.description,
        address: parking.address,
        city: parking.city,
        province: parking.province,
        postalCode: parking.postalCode,
        ratePerHour: parking.ratePerHour,
        dailyRate: parking.dailyRate,
        monthlyRate: parking.monthlyRate,
        operatingDays: parking.operatingDays,
        open24Hours: parking.open24Hours,
        openingTime: parking.openingTime ? formatTimeDisplay(parking.openingTime) : '',
        closingTime: parking.closingTime ? formatTimeDisplay(parking.closingTime) : '',
      })
    }
    if (profile) {
      setProfileForm({
        fullName: profile.fullName,
        city: profile.city,
        country: profile.country,
        phone: profile.phone,
        companyName: profile.companyName,
        ruc: profile.ruc,
      })
    }
  }

  const handleSave = async () => {
    // TODO: Implement save functionality when backend supports update endpoints
    toast({
      title: 'Información',
      description: 'La funcionalidad de actualización estará disponible próximamente',
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground mt-1">
            Administra la información de tu estacionamiento y perfil
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="mr-2 h-4 w-4" />
              Actualizar Datos
            </Button>
          )}
        </div>
      </div>

      {/* Parking Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <CardTitle>Información del Estacionamiento</CardTitle>
          </div>
          <CardDescription>Datos generales del parqueadero</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Estacionamiento</Label>
              <Input
                id="name"
                value={parkingForm.name}
                onChange={e => setParkingForm({ ...parkingForm, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={parkingForm.address}
                onChange={e => setParkingForm({ ...parkingForm, address: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={parkingForm.city}
                onChange={e => setParkingForm({ ...parkingForm, city: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Provincia</Label>
              <Input
                id="province"
                value={parkingForm.province}
                onChange={e => setParkingForm({ ...parkingForm, province: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Código Postal</Label>
              <Input
                id="postalCode"
                value={parkingForm.postalCode}
                onChange={e => setParkingForm({ ...parkingForm, postalCode: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={parkingForm.description}
                onChange={e => setParkingForm({ ...parkingForm, description: e.target.value })}
                disabled={!isEditing}
                rows={3}
              />
            </div>

            {/* Tarifas */}
            <div className="space-y-2">
              <Label htmlFor="ratePerHour">Tarifa por Hora ($)</Label>
              <Input
                id="ratePerHour"
                type="number"
                step="0.01"
                value={parkingForm.ratePerHour}
                onChange={e =>
                  setParkingForm({ ...parkingForm, ratePerHour: parseFloat(e.target.value) })
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyRate">Tarifa Diaria ($)</Label>
              <Input
                id="dailyRate"
                type="number"
                step="0.01"
                value={parkingForm.dailyRate}
                onChange={e =>
                  setParkingForm({ ...parkingForm, dailyRate: parseFloat(e.target.value) })
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyRate">Tarifa Mensual ($)</Label>
              <Input
                id="monthlyRate"
                type="number"
                step="0.01"
                value={parkingForm.monthlyRate}
                onChange={e =>
                  setParkingForm({ ...parkingForm, monthlyRate: parseFloat(e.target.value) })
                }
                disabled={!isEditing}
              />
            </div>

            {/* Horarios */}
            <div className="space-y-2">
              <Label htmlFor="operatingDays">Días de Operación</Label>
              <Input
                id="operatingDays"
                value={parkingForm.operatingDays}
                onChange={e => setParkingForm({ ...parkingForm, operatingDays: e.target.value })}
                disabled={!isEditing}
                placeholder="Lunes a Viernes"
              />
            </div>

            {!parkingForm.open24Hours && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="openingTime">Hora de Apertura</Label>
                  <Input
                    id="openingTime"
                    type="time"
                    value={parkingForm.openingTime}
                    onChange={e => setParkingForm({ ...parkingForm, openingTime: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closingTime">Hora de Cierre</Label>
                  <Input
                    id="closingTime"
                    type="time"
                    value={parkingForm.closingTime}
                    onChange={e => setParkingForm({ ...parkingForm, closingTime: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Owner Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <CardTitle>Información del Propietario</CardTitle>
          </div>
          <CardDescription>Datos personales y de contacto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                value={profileForm.fullName}
                onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileCity">Ciudad</Label>
              <Input
                id="profileCity"
                value={profileForm.city}
                onChange={e => setProfileForm({ ...profileForm, city: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={profileForm.country}
                onChange={e => setProfileForm({ ...profileForm, country: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Nombre de la Empresa</Label>
              <Input
                id="companyName"
                value={profileForm.companyName}
                onChange={e => setProfileForm({ ...profileForm, companyName: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input
                id="ruc"
                value={profileForm.ruc}
                onChange={e => setProfileForm({ ...profileForm, ruc: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
