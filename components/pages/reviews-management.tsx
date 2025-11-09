'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Star, Search, MessageSquare, ThumbsUp, AlertCircle, Send } from '@/lib/icons'
import { apiClient } from '@/lib/api/client'
import { getCurrentUser } from '@/lib/auth'
import type { ReviewResource } from '@/lib/api/types'
import { useToast } from '@/hooks/use-toast'

export function ReviewsManagement() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<ReviewResource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRating, setFilterRating] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  const loadReviews = useCallback(async () => {
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
        setReviews([])
        return
      }

      const parkingReviews = await apiClient.getReviewsByParkingId(parkings[0].id)
      setReviews(parkingReviews)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las reseñas',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const calculateStats = () => {
    if (reviews.length === 0) {
      return {
        total: 0,
        avgRating: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        responseRate: 0,
      }
    }

    const total = reviews.length
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / total
    const distribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    }
    const responseRate = 0

    return { total, avgRating, distribution, responseRate }
  }

  const stats = calculateStats()

  const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`${starSize} ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`}
          />
        ))}
      </div>
    )
  }

  const filterReviews = () => {
    let filtered = reviews

    if (activeTab === 'pending') {
      filtered = []
    } else if (activeTab === 'responded') {
      filtered = reviews
    }

    if (filterRating !== 'all') {
      filtered = filtered.filter(r => r.rating === Number.parseInt(filterRating))
    }

    if (searchQuery) {
      filtered = filtered.filter(
        r =>
          r.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reseñas</h1>
        <p className="text-muted-foreground mt-1">Gestiona las opiniones de tus clientes</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Calificación Promedio</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-3xl font-bold">{stats.avgRating.toFixed(1)}</span>
                  <StarRating rating={Math.round(stats.avgRating)} size="lg" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-muted-foreground text-sm">Total de Reseñas</p>
              <p className="mt-1 text-3xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-muted-foreground text-sm">Tasa de Respuesta</p>
              <p className="mt-1 text-3xl font-bold">{stats.responseRate.toFixed(0)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-muted-foreground text-sm">Pendientes</p>
              <p className="mt-1 text-3xl font-bold">{reviews.filter(r => true).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Calificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = stats.distribution[rating as keyof typeof stats.distribution]
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex w-20 items-center gap-1">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star
                      className={`h-4 w-4 ${stats.total === 0 ? 'fill-gray-400 text-gray-400 dark:fill-gray-600 dark:text-gray-600' : 'fill-yellow-400 text-yellow-400'}`}
                    />
                  </div>
                  <div className="bg-secondary h-2 flex-1 overflow-hidden rounded-full">
                    <div
                      className={`h-full ${stats.total === 0 ? 'bg-gray-400 dark:bg-gray-600' : 'bg-yellow-400'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground w-16 text-right text-sm">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar reseñas..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por calificación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las estrellas</SelectItem>
            <SelectItem value="5">5 estrellas</SelectItem>
            <SelectItem value="4">4 estrellas</SelectItem>
            <SelectItem value="3">3 estrellas</SelectItem>
            <SelectItem value="2">2 estrellas</SelectItem>
            <SelectItem value="1">1 estrella</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas ({reviews.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendientes (0)</TabsTrigger>
          <TabsTrigger value="responded">Respondidas ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="text-muted-foreground mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                  <p className="text-muted-foreground">Cargando reseñas...</p>
                </div>
              </CardContent>
            </Card>
          ) : filterReviews().length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertCircle className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
                  <p className="text-muted-foreground">
                    {activeTab === 'pending'
                      ? 'No hay reseñas pendientes'
                      : 'No se encontraron reseñas'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filterReviews().map(review => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              {review.driverName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{review.driverName}</p>
                            <p className="text-muted-foreground text-sm">
                              {new Date(review.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm leading-relaxed">{review.comment}</p>
                      <div className="text-muted-foreground flex items-center gap-4 text-xs">
                        <span>Estacionamiento: {review.parkingName}</span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Funcionalidad próximamente
                          </p>
                          <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200">
                            La capacidad para responder reseñas estará disponible en futuras
                            actualizaciones.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
