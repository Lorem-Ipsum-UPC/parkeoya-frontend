'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Square,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from '@/lib/icons'

// Mock data - replace with real data from Supabase
const stats = {
  totalSpaces: 50,
  occupiedSpaces: 32,
  availableSpaces: 18,
  todayReservations: 45,
  todayRevenue: 287.5,
  monthlyRevenue: 8625.0,
}

const recentActivity = [
  { id: 1, type: 'reservation', message: 'Nueva reserva - Espacio A-12', time: 'Hace 5 min' },
  { id: 2, type: 'checkout', message: 'Salida - Espacio B-08', time: 'Hace 12 min' },
  { id: 3, type: 'sensor', message: 'Sensor C-15 desconectado', time: 'Hace 25 min', alert: true },
  { id: 4, type: 'reservation', message: 'Nueva reserva - Espacio A-05', time: 'Hace 32 min' },
]

export function DashboardOverview() {
  const occupancyRate = ((stats.occupiedSpaces / stats.totalSpaces) * 100).toFixed(1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel General</h1>
        <p className="text-muted-foreground mt-1">Resumen de tu estacionamiento en tiempo real</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Ocupación Actual
            </CardTitle>
            <Square className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.occupiedSpaces}/{stats.totalSpaces}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">{occupancyRate}% ocupado</p>
            <div className="bg-secondary mt-3 h-2 overflow-hidden rounded-full">
              <div className="h-full bg-blue-600" style={{ width: `${occupancyRate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Espacios Disponibles
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableSpaces}</div>
            <p className="mt-1 text-xs text-green-600">Listos para reservar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Reservas Hoy
            </CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayReservations}</div>
            <p className="text-muted-foreground mt-1 text-xs">+12% vs ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Ingresos Hoy
            </CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.todayRevenue.toFixed(2)}</div>
            <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +8.2% vs ayer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="hover:bg-accent flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <Square className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Ver Espacios IoT</p>
                <p className="text-muted-foreground text-sm">Monitoreo en tiempo real</p>
              </div>
            </button>

            <button className="hover:bg-accent flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Gestionar Reservas</p>
                <p className="text-muted-foreground text-sm">Ver reservas activas</p>
              </div>
            </button>

            <button className="hover:bg-accent flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Reportes Financieros</p>
                <p className="text-muted-foreground text-sm">Análisis de ingresos</p>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      activity.alert
                        ? 'bg-red-100 dark:bg-red-900'
                        : activity.type === 'reservation'
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'bg-green-100 dark:bg-green-900'
                    }`}
                  >
                    {activity.alert ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : activity.type === 'reservation' ? (
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-muted-foreground text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
