'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Square, Calendar, CheckCircle2, XCircle, Star, Settings, Car, Clock } from '@/lib/icons'
import { apiClient } from '@/lib/api/client'
import { getCurrentUser } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import type { ParkingResource, ReservationResource, DeviceResource } from '@/lib/api/types'

interface DashboardStats {
  totalSpaces: number
  occupiedSpaces: number
  availableSpaces: number
  todayReservations: number
  activeReservations: number
}

export function DashboardOverview() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalSpaces: 0,
    occupiedSpaces: 0,
    availableSpaces: 0,
    todayReservations: 0,
    activeReservations: 0,
  })
  const [recentReservations, setRecentReservations] = useState<ReservationResource[]>([])
  const [parking, setParking] = useState<ParkingResource | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadDashboardData = async () => {
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

        const reservations = await apiClient.getReservationsByParkingId(userParking.id)

        const today = new Date().toISOString().split('T')[0]
        const todayReservations = reservations.filter(r => r.date === today)
        const activeReservations = reservations.filter(
          r => r.status.toLowerCase() === 'active'
        ).length

        const spots = await apiClient.getParkingSpotsByParkingId(userParking.id)
        const occupiedSpots = spots.filter(s => s.status.toLowerCase() === 'occupied').length
        const availableSpots = userParking.totalSpots - occupiedSpots

        setStats({
          totalSpaces: userParking.totalSpots,
          occupiedSpaces: occupiedSpots,
          availableSpaces: availableSpots,
          todayReservations: todayReservations.length,
          activeReservations: activeReservations,
        })

        const sortedReservations = [...reservations]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
        setRecentReservations(sortedReservations)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los datos del dashboard',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [router, toast])

  const occupancyRate =
    stats.totalSpaces > 0 ? ((stats.occupiedSpaces / stats.totalSpaces) * 100).toFixed(1) : '0'

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel General - {parking?.name}</h1>
          <h3>Dirección: {parking?.address}</h3>
          <h3>Ciudad: {parking?.city}</h3>
          <p className="text-muted-foreground mt-1">Resumen de tu estacionamiento en tiempo real</p>
        </div>
        <Card className="min-w-fit px-4 py-3">
          <div className="flex items-center gap-3">
            <Clock className="text-primary h-6 w-6" />
            <div className="text-right">
              <div className="text-2xl font-bold tabular-nums">{formatTime(currentTime)}</div>
              <div className="text-muted-foreground text-xs capitalize">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
            <Car className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-muted-foreground text-xs">
              {stats.occupiedSpaces} de {stats.totalSpaces} espacios
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <CheckCircle2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableSpaces}</div>
            <p className="text-muted-foreground text-xs">Espacios libres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Hoy</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayReservations}</div>
            <p className="text-muted-foreground text-xs">Reservaciones programadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReservations}</div>
            <p className="text-muted-foreground text-xs">En este momento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/dashboard/spaces"
              className="hover:bg-accent flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <Square className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Ver Espacios IoT</p>
                <p className="text-muted-foreground text-sm">Monitoreo en tiempo real</p>
              </div>
            </Link>

            <Link
              href="/dashboard/reservations"
              className="hover:bg-accent flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Gestionar Reservas</p>
                <p className="text-muted-foreground text-sm">Ver reservas activas</p>
              </div>
            </Link>

            <Link
              href="/dashboard/reviews"
              className="hover:bg-accent flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">Ver Reseñas</p>
                <p className="text-muted-foreground text-sm">Gestionar comentarios</p>
              </div>
            </Link>

            <Link
              href="/dashboard/configuration"
              className="hover:bg-accent flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Configuración</p>
                <p className="text-muted-foreground text-sm">Ajustes del parqueadero</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reservas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservations.length === 0 ? (
                <p className="text-muted-foreground text-center text-sm">
                  No hay reservas recientes
                </p>
              ) : (
                recentReservations.map(reservation => {
                  const statusConfig = {
                    active: {
                      label: 'Activa',
                      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                      icon: CheckCircle2,
                    },
                    scheduled: {
                      label: 'Programada',
                      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
                      icon: Calendar,
                    },
                    completed: {
                      label: 'Completada',
                      color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                      icon: CheckCircle2,
                    },
                    cancelled: {
                      label: 'Cancelada',
                      color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
                      icon: XCircle,
                    },
                  }

                  const status =
                    statusConfig[reservation.status.toLowerCase() as keyof typeof statusConfig] ||
                    statusConfig.scheduled
                  const StatusIcon = status.icon

                  return (
                    <div key={reservation.id} className="flex items-start gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${status.color}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Espacio {reservation.parkingId}</p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(reservation.date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                          })}{' '}
                          - {status.label}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
