'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, Wifi, WifiOff, CheckCircle2, XCircle } from '@/lib/icons'
import { apiClient } from '@/lib/api/client'
import { getCurrentUser } from '@/lib/auth'
import type { ParkingResource, ParkingSpotResource, DeviceResource } from '@/lib/api/types'
import { useToast } from '@/hooks/use-toast'

const getSpaceStatus = (device: DeviceResource | undefined): string => {
  if (!device || device.operationalStatus === 'OFFLINE') return 'offline'
  if (device.spotStatus === 'AVAILABLE') return 'available'
  if (device.spotStatus === 'OCCUPIED') return 'occupied'
  if (device.spotStatus === 'RESERVED') return 'reserved'
  return 'offline'
}

interface SpaceWithDevice extends ParkingSpotResource {
  device?: DeviceResource
  displayStatus: string
}

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
  const { toast } = useToast()
  const [spaces, setSpaces] = useState<SpaceWithDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpace, setSelectedSpace] = useState<SpaceWithDevice | null>(null)
  const [parking, setParking] = useState<ParkingResource | null>(null)

  const loadSpaces = useCallback(async () => {
    try {
      setLoading(true)
      const user = getCurrentUser()
      if (!user?.id) {
        toast({
          title: 'Error',
          description: 'Usuario no encontrado',
          variant: 'destructive',
        })
        return
      }

      const parkings = await apiClient.getParkingsByOwnerId(user.id)
      if (parkings.length === 0) {
        setSpaces([])
        return
      }

      const userParking = parkings[0]
      setParking(userParking)
      const parkingSpots = await apiClient.getParkingSpotsByParkingId(parkings[0].id)
      const edgeServers = await apiClient.getEdgeServersByParkingId(parkings[0].id)

      let allDevices: DeviceResource[] = []
      for (const edgeServer of edgeServers) {
        const devices = await apiClient.getDevicesByEdgeServerId(edgeServer.serverId)
        allDevices = [...allDevices, ...devices]
      }

      const spacesWithDevices: SpaceWithDevice[] = parkingSpots.map(spot => {
        const device = allDevices.find(d => d.parkingSpotId === spot.id)
        return {
          ...spot,
          device,
          displayStatus: getSpaceStatus(device),
        }
      })

      setSpaces(spacesWithDevices)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los espacios',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadSpaces()
  }, [loadSpaces])

  const stats = {
    available: spaces.filter(s => s.displayStatus === 'available').length,
    occupied: spaces.filter(s => s.displayStatus === 'occupied').length,
    reserved: spaces.filter(s => s.displayStatus === 'reserved').length,
    offline: spaces.filter(s => s.displayStatus === 'offline').length,
  }

  const filteredSpaces = spaces.filter(space =>
    space.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Espacios IoT - {parking?.name}</h1>
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

      <Card>
        <CardHeader>
          <CardTitle>Matriz de Espacios</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center">
              <div className="text-muted-foreground mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              <p className="text-muted-foreground">Cargando espacios...</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
              {filteredSpaces.map(space => {
                const config = statusConfig[space.displayStatus as keyof typeof statusConfig]
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
                    title={`${space.label} - ${config.label}`}
                  >
                    <div className="flex h-full flex-col items-center justify-center p-1">
                      <Icon className={`mb-1 h-4 w-4 ${config.textColor}`} />
                      <span className={`text-xs font-medium ${config.textColor}`}>
                        {space.label}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSpace && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Espacio {selectedSpace.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Estado</p>
                  <Badge
                    className={
                      statusConfig[selectedSpace.displayStatus as keyof typeof statusConfig].bgColor
                    }
                  >
                    <span
                      className={
                        statusConfig[selectedSpace.displayStatus as keyof typeof statusConfig]
                          .textColor
                      }
                    >
                      {statusConfig[selectedSpace.displayStatus as keyof typeof statusConfig].label}
                    </span>
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">ID del Espacio</p>
                  <p className="font-mono text-sm">{selectedSpace.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Posición</p>
                  <p className="text-sm">
                    Fila {selectedSpace.rowIndex}, Columna {selectedSpace.columnIndex}
                  </p>
                </div>
                {selectedSpace.device && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">Dispositivo IoT</p>
                    <p className="font-mono text-sm">{selectedSpace.device.macAddress}</p>
                    <p className="text-muted-foreground text-xs">
                      Tipo: {selectedSpace.device.type}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {selectedSpace.device?.lastCommunication && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">Última Comunicación</p>
                    <p className="text-sm">
                      {new Date(selectedSpace.device.lastCommunication).toLocaleString('es-ES')}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Estado del Sensor</p>
                  <div className="flex items-center gap-2">
                    {selectedSpace.displayStatus === 'offline' ||
                    !selectedSpace.device ||
                    selectedSpace.device.operationalStatus === 'OFFLINE' ? (
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
                {selectedSpace.device && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">Estado Operacional</p>
                    <p className="text-sm capitalize">
                      {selectedSpace.device.operationalStatus.toLowerCase()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
