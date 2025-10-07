'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Calendar,
  Clock,
  User,
  Car,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from '@/lib/icons'

// Mock reservation data - replace with real data from Supabase
const generateReservations = () => {
  const statuses = ['active', 'scheduled', 'completed', 'cancelled']
  const names = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez']
  const vehicles = ['ABC-1234', 'XYZ-5678', 'DEF-9012', 'GHI-3456', 'JKL-7890']

  return Array.from({ length: 20 }, (_, i) => {
    const status = i < 5 ? 'active' : i < 10 ? 'scheduled' : i < 15 ? 'completed' : 'cancelled'
    const startDate = new Date(Date.now() + (i - 5) * 86400000)
    const endDate = new Date(startDate.getTime() + Math.random() * 14400000)

    return {
      id: `RES-${(1000 + i).toString()}`,
      driverName: names[Math.floor(Math.random() * names.length)],
      driverEmail: `driver${i}@email.com`,
      driverPhone: `+593 99 ${Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(7, '0')}`,
      vehiclePlate: vehicles[Math.floor(Math.random() * vehicles.length)],
      spaceNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(
        Math.random() * 10 + 1
      )
        .toString()
        .padStart(2, '0')}`,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      duration: Math.floor((endDate.getTime() - startDate.getTime()) / 3600000),
      amount: (Math.random() * 20 + 5).toFixed(2),
      status,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    }
  })
}

const reservations = generateReservations()

const statusConfig = {
  active: {
    label: 'Activa',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle2,
  },
  scheduled: {
    label: 'Programada',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Clock,
  },
  completed: {
    label: 'Completada',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircle,
  },
}

export function ReservationsManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReservation, setSelectedReservation] = useState<(typeof reservations)[0] | null>(
    null
  )
  const [activeTab, setActiveTab] = useState('all')

  const filterReservations = (status?: string) => {
    let filtered = reservations

    if (status && status !== 'all') {
      filtered = filtered.filter(r => r.status === status)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        r =>
          r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.spaceNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  const stats = {
    active: reservations.filter(r => r.status === 'active').length,
    scheduled: reservations.filter(r => r.status === 'scheduled').length,
    completed: reservations.filter(r => r.status === 'completed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona todas las reservas de tu estacionamiento
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-muted-foreground text-sm">Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
                <p className="text-muted-foreground text-sm">Programadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900/30">
                <CheckCircle2 className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-muted-foreground text-sm">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
                <p className="text-muted-foreground text-sm">Canceladas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar por ID, conductor, placa o espacio..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="scheduled">Programadas</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
          <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'all'
                  ? 'Todas las Reservas'
                  : activeTab === 'active'
                    ? 'Reservas Activas'
                    : activeTab === 'scheduled'
                      ? 'Reservas Programadas'
                      : activeTab === 'completed'
                        ? 'Reservas Completadas'
                        : 'Reservas Canceladas'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filterReservations(activeTab === 'all' ? undefined : activeTab).map(
                  reservation => {
                    const config = statusConfig[reservation.status as keyof typeof statusConfig]
                    const StatusIcon = config.icon

                    return (
                      <button
                        key={reservation.id}
                        onClick={() => setSelectedReservation(reservation)}
                        className={`w-full rounded-lg border p-4 text-left transition-all hover:shadow-md ${
                          selectedReservation?.id === reservation.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20'
                            : 'border-border hover:border-blue-300'
                        }`}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                          {/* Left: Basic Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="font-mono text-sm font-medium">
                                {reservation.id}
                              </span>
                              <Badge className={config.color}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {config.label}
                              </Badge>
                            </div>

                            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{reservation.driverName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Car className="h-4 w-4" />
                                <span>{reservation.vehiclePlate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>Espacio {reservation.spaceNumber}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Time & Amount */}
                          <div className="flex items-center gap-6">
                            <div className="text-sm">
                              <p className="text-muted-foreground">Inicio</p>
                              <p className="font-medium">
                                {new Date(reservation.startTime).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: 'short',
                                })}{' '}
                                {new Date(reservation.startTime).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>

                            <div className="text-sm">
                              <p className="text-muted-foreground">Duración</p>
                              <p className="font-medium">{reservation.duration}h</p>
                            </div>

                            <div className="text-sm">
                              <p className="text-muted-foreground">Monto</p>
                              <p className="font-medium text-green-600">${reservation.amount}</p>
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  }
                )}

                {filterReservations(activeTab === 'all' ? undefined : activeTab).length === 0 && (
                  <div className="py-12 text-center">
                    <AlertCircle className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
                    <p className="text-muted-foreground">No se encontraron reservas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reservation Details */}
      {selectedReservation && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detalles de la Reserva</CardTitle>
              <Badge
                className={
                  statusConfig[selectedReservation.status as keyof typeof statusConfig].color
                }
              >
                {statusConfig[selectedReservation.status as keyof typeof statusConfig].label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Driver Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información del Conductor</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Nombre</p>
                      <p className="font-medium">{selectedReservation.driverName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Email</p>
                      <p className="font-medium">{selectedReservation.driverEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Teléfono</p>
                      <p className="font-medium">{selectedReservation.driverPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Car className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Placa del Vehículo</p>
                      <p className="font-mono font-medium">{selectedReservation.vehiclePlate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Detalles de la Reserva</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Espacio</p>
                      <p className="font-medium">{selectedReservation.spaceNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Fecha de Inicio</p>
                      <p className="font-medium">
                        {new Date(selectedReservation.startTime).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Horario</p>
                      <p className="font-medium">
                        {new Date(selectedReservation.startTime).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(selectedReservation.endTime).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Duración: {selectedReservation.duration} horas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Monto Total</p>
                      <p className="text-lg font-medium text-green-600">
                        ${selectedReservation.amount}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Comisión ParkeoYa (15%): $
                        {(Number.parseFloat(selectedReservation.amount) * 0.15).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {selectedReservation.status === 'active' && (
              <div className="mt-6 flex gap-3 border-t pt-6">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Contactar Conductor
                </Button>
                <Button variant="destructive" className="flex-1">
                  Cancelar Reserva
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
