"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "@/lib/icons"

// Mock reservation data - replace with real data from Supabase
const generateReservations = () => {
  const statuses = ["active", "scheduled", "completed", "cancelled"]
  const names = ["Juan Pérez", "María García", "Carlos López", "Ana Martínez", "Luis Rodríguez"]
  const vehicles = ["ABC-1234", "XYZ-5678", "DEF-9012", "GHI-3456", "JKL-7890"]

  return Array.from({ length: 20 }, (_, i) => {
    const status = i < 5 ? "active" : i < 10 ? "scheduled" : i < 15 ? "completed" : "cancelled"
    const startDate = new Date(Date.now() + (i - 5) * 86400000)
    const endDate = new Date(startDate.getTime() + Math.random() * 14400000)

    return {
      id: `RES-${(1000 + i).toString()}`,
      driverName: names[Math.floor(Math.random() * names.length)],
      driverEmail: `driver${i}@email.com`,
      driverPhone: `+593 99 ${Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(7, "0")}`,
      vehiclePlate: vehicles[Math.floor(Math.random() * vehicles.length)],
      spaceNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(Math.random() * 10 + 1)
        .toString()
        .padStart(2, "0")}`,
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
    label: "Activa",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
  },
  scheduled: {
    label: "Programada",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Clock,
  },
  completed: {
    label: "Completada",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelada",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
  },
}

export function ReservationsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReservation, setSelectedReservation] = useState<(typeof reservations)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const filterReservations = (status?: string) => {
    let filtered = reservations

    if (status && status !== "all") {
      filtered = filtered.filter((r) => r.status === status)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.spaceNumber.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }

  const stats = {
    active: reservations.filter((r) => r.status === "active").length,
    scheduled: reservations.filter((r) => r.status === "scheduled").length,
    completed: reservations.filter((r) => r.status === "completed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
        <p className="text-muted-foreground mt-1">Gestiona todas las reservas de tu estacionamiento</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
                <p className="text-sm text-muted-foreground">Programadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
                <p className="text-sm text-muted-foreground">Canceladas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ID, conductor, placa o espacio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
                {activeTab === "all"
                  ? "Todas las Reservas"
                  : activeTab === "active"
                    ? "Reservas Activas"
                    : activeTab === "scheduled"
                      ? "Reservas Programadas"
                      : activeTab === "completed"
                        ? "Reservas Completadas"
                        : "Reservas Canceladas"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filterReservations(activeTab === "all" ? undefined : activeTab).map((reservation) => {
                  const config = statusConfig[reservation.status as keyof typeof statusConfig]
                  const StatusIcon = config.icon

                  return (
                    <button
                      key={reservation.id}
                      onClick={() => setSelectedReservation(reservation)}
                      className={`w-full p-4 rounded-lg border transition-all hover:shadow-md text-left ${
                        selectedReservation?.id === reservation.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950/20"
                          : "border-border hover:border-blue-300"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Left: Basic Info */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-sm font-medium">{reservation.id}</span>
                            <Badge className={config.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{reservation.driverName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Car className="w-4 h-4" />
                              <span>{reservation.vehiclePlate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>Espacio {reservation.spaceNumber}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Time & Amount */}
                        <div className="flex items-center gap-6">
                          <div className="text-sm">
                            <p className="text-muted-foreground">Inicio</p>
                            <p className="font-medium">
                              {new Date(reservation.startTime).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                              })}{" "}
                              {new Date(reservation.startTime).toLocaleTimeString("es-ES", {
                                hour: "2-digit",
                                minute: "2-digit",
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
                })}

                {filterReservations(activeTab === "all" ? undefined : activeTab).length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
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
              <Badge className={statusConfig[selectedReservation.status as keyof typeof statusConfig].color}>
                {statusConfig[selectedReservation.status as keyof typeof statusConfig].label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Driver Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Información del Conductor</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p className="font-medium">{selectedReservation.driverName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedReservation.driverEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{selectedReservation.driverPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Placa del Vehículo</p>
                      <p className="font-medium font-mono">{selectedReservation.vehiclePlate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Detalles de la Reserva</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Espacio</p>
                      <p className="font-medium">{selectedReservation.spaceNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
                      <p className="font-medium">
                        {new Date(selectedReservation.startTime).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Horario</p>
                      <p className="font-medium">
                        {new Date(selectedReservation.startTime).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(selectedReservation.endTime).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">Duración: {selectedReservation.duration} horas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Monto Total</p>
                      <p className="font-medium text-lg text-green-600">${selectedReservation.amount}</p>
                      <p className="text-xs text-muted-foreground">
                        Comisión ParkeoYa (15%): ${(Number.parseFloat(selectedReservation.amount) * 0.15).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {selectedReservation.status === "active" && (
              <div className="mt-6 pt-6 border-t flex gap-3">
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
