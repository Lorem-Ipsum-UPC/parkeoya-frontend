'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, Wifi, WifiOff, CheckCircle2, XCircle } from '@/lib/icons'

// Mock IoT sensor data - replace with real data from Supabase
const generateSpaces = () => {
  const spaces = []
  const rows = ['A', 'B', 'C', 'D', 'E']
  const statuses = ['available', 'occupied', 'reserved', 'offline']

  for (const row of rows) {
    for (let i = 1; i <= 10; i++) {
      const spaceNumber = `${row}-${i.toString().padStart(2, '0')}`
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      spaces.push({
        id: spaceNumber,
        number: spaceNumber,
        status: randomStatus,
        sensorId: `SENSOR-${spaceNumber}`,
        lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        type: i <= 8 ? 'regular' : i === 9 ? 'disabled' : 'electric',
      })
    }
  }
  return spaces
}

const spaces = generateSpaces()

const statusConfig = {
  available: {
    label: 'Disponible',
    color: 'bg-green-500',
    textColor: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    icon: CheckCircle2,
  },
  occupied: {
    label: 'Ocupado',
    color: 'bg-red-500',
    textColor: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: XCircle,
  },
  reserved: {
    label: 'Reservado',
    color: 'bg-blue-500',
    textColor: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: CheckCircle2,
  },
  offline: {
    label: 'Sin señal',
    color: 'bg-gray-400',
    textColor: 'text-gray-700 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    icon: WifiOff,
  },
}

export function SpaceManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpace, setSelectedSpace] = useState<(typeof spaces)[0] | null>(null)

  const stats = {
    available: spaces.filter(s => s.status === 'available').length,
    occupied: spaces.filter(s => s.status === 'occupied').length,
    reserved: spaces.filter(s => s.status === 'reserved').length,
    offline: spaces.filter(s => s.status === 'offline').length,
  }

  const filteredSpaces = spaces.filter(space =>
    space.number.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Espacios IoT</h1>
          <p className="text-muted-foreground mt-1">Monitoreo en tiempo real de sensores</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Wifi className="h-4 w-4 text-green-600" />
            <span className="text-muted-foreground">
              {spaces.length - stats.offline}/{spaces.length} sensores activos
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.available}</p>
                <p className="text-muted-foreground text-sm">Disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.occupied}</p>
                <p className="text-muted-foreground text-sm">Ocupados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.reserved}</p>
                <p className="text-muted-foreground text-sm">Reservados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-gray-400" />
              <div>
                <p className="text-2xl font-bold">{stats.offline}</p>
                <p className="text-muted-foreground text-sm">Sin señal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar espacio (ej: A-05)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Space Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Espacios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
            {filteredSpaces.map(space => {
              const config = statusConfig[space.status as keyof typeof statusConfig]
              const Icon = config.icon

              return (
                <button
                  key={space.id}
                  onClick={() => setSelectedSpace(space)}
                  className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedSpace?.id === space.id
                      ? 'border-blue-600 ring-2 ring-blue-600/20'
                      : 'border-transparent'
                  } ${config.bgColor}`}
                  title={`${space.number} - ${config.label}`}
                >
                  <div className="flex h-full flex-col items-center justify-center p-1">
                    <Icon className={`mb-1 h-4 w-4 ${config.textColor}`} />
                    <span className={`text-xs font-medium ${config.textColor}`}>
                      {space.number}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Space Details */}
      {selectedSpace && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Espacio {selectedSpace.number}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Estado</p>
                  <Badge
                    className={
                      statusConfig[selectedSpace.status as keyof typeof statusConfig].bgColor
                    }
                  >
                    <span
                      className={
                        statusConfig[selectedSpace.status as keyof typeof statusConfig].textColor
                      }
                    >
                      {statusConfig[selectedSpace.status as keyof typeof statusConfig].label}
                    </span>
                  </Badge>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1 text-sm">ID del Sensor</p>
                  <p className="font-mono text-sm">{selectedSpace.sensorId}</p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Tipo de Espacio</p>
                  <p className="text-sm capitalize">
                    {selectedSpace.type === 'regular'
                      ? 'Regular'
                      : selectedSpace.type === 'disabled'
                        ? 'Discapacitados'
                        : 'Carga Eléctrica'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Última Actualización</p>
                  <p className="text-sm">
                    {new Date(selectedSpace.lastUpdate).toLocaleString('es-ES')}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Conexión del Sensor</p>
                  <div className="flex items-center gap-2">
                    {selectedSpace.status === 'offline' ? (
                      <>
                        <WifiOff className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">Sin conexión</span>
                      </>
                    ) : (
                      <>
                        <Wifi className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Conectado</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
