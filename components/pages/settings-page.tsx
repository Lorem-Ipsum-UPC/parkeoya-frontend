'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Building2, User, Edit, Save, X, Clock } from '@/lib/icons'
import { apiClient } from '@/lib/api/client'
import { getCurrentUser } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import type { ParkingResource, ParkingOwnerProfile } from '@/lib/api/types'
import { formatTimeDisplay, formatTimeForBackend } from '@/lib/utils'

const DAYS = [
  { id: 'monday', label: 'Lunes' },
  { id: 'tuesday', label: 'Martes' },
  { id: 'wednesday', label: 'Miércoles' },
  { id: 'thursday', label: 'Jueves' },
  { id: 'friday', label: 'Viernes' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
]

const parseDaysString = (daysString: string): string[] => {
  if (!daysString) return []
  if (daysString.includes(',')) {
    return daysString.split(',').map(d => d.trim().toLowerCase())
  }
  const lowerDays = daysString.toLowerCase()
  const matchedDays: string[] = []
  DAYS.forEach(day => {
    if (lowerDays.includes(day.label.toLowerCase()) || lowerDays.includes(day.id)) {
      matchedDays.push(day.id)
    }
  })
  return matchedDays
}

const formatDaysArray = (days: string[]): string => {
  return days.join(',')
}

export function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [parking, setParking] = useState<ParkingResource | null>(null)
  const [profile, setProfile] = useState<ParkingOwnerProfile | null>(null)

  useEffect(() => {
    document.title = 'Configuración - Parkeoya'
    return () => {
      document.title = 'Parkeoya'
    }
  }, [])

  const DAYS = [
    { id: 'monday', label: 'Lunes' },
    { id: 'tuesday', label: 'Martes' },
    { id: 'wednesday', label: 'Miércoles' },
    { id: 'thursday', label: 'Jueves' },
    { id: 'friday', label: 'Viernes' },
    { id: 'saturday', label: 'Sábado' },
    { id: 'sunday', label: 'Domingo' },
  ]

  const parseDaysString = (daysString: string): string[] => {
    if (!daysString) return []
    if (daysString.includes(',')) {
      return daysString.split(',').map(d => d.trim().toLowerCase())
    }
    const lowerDays = daysString.toLowerCase()
    const matchedDays: string[] = []
    DAYS.forEach(day => {
      if (lowerDays.includes(day.label.toLowerCase()) || lowerDays.includes(day.id)) {
        matchedDays.push(day.id)
      }
    })
    return matchedDays
  }

  const formatDaysArray = (days: string[]): string => {
    return days.join(',')
  }

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
    operatingDays: [] as string[],
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

  const loadData = async () => {
    const user = getCurrentUser()
    if (!user?.id) {
      router.push('/login')
      return
    }

    try {
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
        operatingDays: parseDaysString(userParking.operatingDays),
        open24Hours: userParking.open24Hours,
        openingTime: userParking.openingTime ? formatTimeDisplay(userParking.openingTime) : '',
        closingTime: userParking.closingTime ? formatTimeDisplay(userParking.closingTime) : '',
      })

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
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCancel = () => {
    setIsEditing(false)
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
        operatingDays: parseDaysString(parking.operatingDays),
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
    if (!parking?.id) {
      toast({
        title: 'Error',
        description: 'No se encontró el ID del estacionamiento',
        variant: 'destructive',
      })
      return
    }

    if (!profile?.parkingOwnerId) {
      toast({
        title: 'Error',
        description: 'No se encontró el ID del propietario',
        variant: 'destructive',
      })
      return
    }

    try {
      const parkingUpdateData = {
        name: parkingForm.name,
        description: parkingForm.description,
        address: parkingForm.address,
        city: parkingForm.city,
        province: parkingForm.province,
        postalCode: parkingForm.postalCode,
        ratePerHour: parkingForm.ratePerHour,
        dailyRate: parkingForm.dailyRate,
        monthlyRate: parkingForm.monthlyRate,
        operatingDays: formatDaysArray(parkingForm.operatingDays),
        open24hours: parkingForm.open24Hours,
        openingTime: parkingForm.open24Hours
          ? undefined
          : formatTimeForBackend(parkingForm.openingTime),
        closingTime: parkingForm.open24Hours
          ? undefined
          : formatTimeForBackend(parkingForm.closingTime),
      }

      const profileUpdateData = {
        fullName: profileForm.fullName,
        city: profileForm.city,
        country: profileForm.country,
        phone: profileForm.phone,
        companyName: profileForm.companyName,
        ruc: profileForm.ruc,
      }

      const [updatedParking, updatedProfile] = await Promise.all([
        apiClient.updateParking(parking.id, parkingUpdateData),
        apiClient.updateParkingOwnerProfile(profile.parkingOwnerId, profileUpdateData),
      ])

      setParking(updatedParking)
      setProfile(updatedProfile)
      setIsEditing(false)

      toast({
        title: 'Éxito',
        description: 'La configuración se actualizó correctamente',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la configuración',
        variant: 'destructive',
      })
    }
  }

  const toggleDay = (dayId: string) => {
    const newDays = parkingForm.operatingDays.includes(dayId)
      ? parkingForm.operatingDays.filter(d => d !== dayId)
      : [...parkingForm.operatingDays, dayId]
    setParkingForm({ ...parkingForm, operatingDays: newDays })
  }

  const selectAllDays = () => {
    setParkingForm({ ...parkingForm, operatingDays: DAYS.map(d => d.id) })
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
          <h1 className="text-3xl font-bold tracking-tight">Configuración - {parking?.name}</h1>
          <p className="text-muted-foreground mt-1">
            Administra la información de tu estacionamiento y perfil
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                className="bg-transparent hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-800 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                variant="outline"
                onClick={handleCancel}
              >
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

            {/* Días de Operación */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label>Días de Operación</Label>
                {isEditing && (
                  <Button
                    type="button"
                    variant="link"
                    onClick={selectAllDays}
                    className="text-primary h-auto p-0"
                  >
                    Seleccionar todos
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {DAYS.map(day => (
                  <div key={day.id} className="flex items-center gap-2">
                    <Checkbox
                      id={day.id}
                      checked={parkingForm.operatingDays.includes(day.id)}
                      onCheckedChange={() => toggleDay(day.id)}
                      disabled={!isEditing}
                    />
                    <label
                      htmlFor={day.id}
                      className={`text-sm ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      {day.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Horario de Atención */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="open24Hours"
                  checked={parkingForm.open24Hours}
                  onCheckedChange={(checked: boolean) =>
                    setParkingForm({ ...parkingForm, open24Hours: checked })
                  }
                  disabled={!isEditing}
                />
                <label
                  htmlFor="open24Hours"
                  className={`text-sm font-medium ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  Abierto 24 horas
                </label>
              </div>

              {!parkingForm.open24Hours && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="openingTime" className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Hora de Apertura
                    </Label>
                    <Input
                      id="openingTime"
                      type="time"
                      value={parkingForm.openingTime}
                      onChange={e =>
                        setParkingForm({ ...parkingForm, openingTime: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closingTime" className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Hora de Cierre
                    </Label>
                    <Input
                      id="closingTime"
                      type="time"
                      value={parkingForm.closingTime}
                      onChange={e =>
                        setParkingForm({ ...parkingForm, closingTime: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              )}
            </div>
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
