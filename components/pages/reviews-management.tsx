'use client'

import { useState } from 'react'
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

// Mock reviews data - replace with real data from Supabase
const generateReviews = () => {
  const names = [
    'Juan Pérez',
    'María García',
    'Carlos López',
    'Ana Martínez',
    'Luis Rodríguez',
    'Sofia Torres',
  ]
  const comments = [
    'Excelente ubicación y muy seguro. El personal es muy amable.',
    'Buen servicio, pero los espacios son un poco estrechos.',
    'Perfecto para estacionar todo el día. Precios justos.',
    'Muy limpio y bien iluminado. Me siento seguro dejando mi auto aquí.',
    'El sistema de reservas es muy fácil de usar. Recomendado.',
    'Buena experiencia en general, aunque a veces está muy lleno.',
    'Espacios amplios y fácil acceso. Volveré sin duda.',
    'El precio es un poco alto, pero vale la pena por la seguridad.',
  ]

  return Array.from({ length: 25 }, (_, i) => {
    const rating = Math.floor(Math.random() * 3) + 3 // 3-5 stars
    const hasResponse = Math.random() > 0.5

    return {
      id: `REV-${(1000 + i).toString()}`,
      driverName: names[Math.floor(Math.random() * names.length)],
      rating,
      comment: comments[Math.floor(Math.random() * comments.length)],
      date: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
      reservation: `RES-${Math.floor(Math.random() * 1000 + 1000)}`,
      hasResponse,
      response: hasResponse
        ? 'Muchas gracias por tu comentario. Nos alegra que hayas tenido una buena experiencia.'
        : null,
      responseDate: hasResponse
        ? new Date(Date.now() - Math.random() * 20 * 86400000).toISOString()
        : null,
      helpful: Math.floor(Math.random() * 15),
    }
  })
}

const reviews = generateReviews()

const calculateStats = () => {
  const total = reviews.length
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / total
  const distribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  }
  const responseRate = (reviews.filter(r => r.hasResponse).length / total) * 100

  return { total, avgRating, distribution, responseRate }
}

const stats = calculateStats()

export function ReviewsManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRating, setFilterRating] = useState('all')
  const [selectedReview, setSelectedReview] = useState<(typeof reviews)[0] | null>(null)
  const [responseText, setResponseText] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filterReviews = () => {
    let filtered = reviews

    if (activeTab === 'pending') {
      filtered = filtered.filter(r => !r.hasResponse)
    } else if (activeTab === 'responded') {
      filtered = filtered.filter(r => r.hasResponse)
    }

    if (filterRating !== 'all') {
      filtered = filtered.filter(r => r.rating === Number.parseInt(filterRating))
    }

    if (searchQuery) {
      filtered = filtered.filter(
        r =>
          r.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const handleSubmitResponse = () => {
    if (!selectedReview || !responseText.trim()) return

    // Mock response submission - replace with actual API call
    console.log('Submitting response:', { reviewId: selectedReview.id, response: responseText })

    // Update local state
    selectedReview.hasResponse = true
    selectedReview.response = responseText
    selectedReview.responseDate = new Date().toISOString()

    setResponseText('')
    setSelectedReview(null)
  }

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
              <p className="mt-1 text-3xl font-bold">
                {reviews.filter(r => !r.hasResponse).length}
              </p>
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
              const percentage = (count / stats.total) * 100

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex w-20 items-center gap-1">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="bg-secondary h-2 flex-1 overflow-hidden rounded-full">
                    <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
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

      {/* Filters */}
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
          <TabsTrigger value="pending">
            Pendientes ({reviews.filter(r => !r.hasResponse).length})
          </TabsTrigger>
          <TabsTrigger value="responded">
            Respondidas ({reviews.filter(r => r.hasResponse).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filterReviews().map(review => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Review Header */}
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
                            {new Date(review.date).toLocaleDateString('es-ES', {
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
                      {!review.hasResponse && (
                        <Badge
                          variant="outline"
                          className="border-yellow-200 bg-yellow-50 text-yellow-700"
                        >
                          Pendiente
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-2">
                    <p className="text-sm leading-relaxed">{review.comment}</p>
                    <div className="text-muted-foreground flex items-center gap-4 text-xs">
                      <span>Reserva: {review.reservation}</span>
                      <button className="hover:text-foreground flex items-center gap-1 transition-colors">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{review.helpful} útiles</span>
                      </button>
                    </div>
                  </div>

                  {/* Owner Response */}
                  {review.hasResponse && review.response && (
                    <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                              Respuesta del propietario
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                              {new Date(review.responseDate!).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                              })}
                            </p>
                          </div>
                          <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200">
                            {review.response}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Response Form */}
                  {!review.hasResponse && selectedReview?.id === review.id && (
                    <div className="mt-4 space-y-3">
                      <Textarea
                        placeholder="Escribe tu respuesta..."
                        value={responseText}
                        onChange={e => setResponseText(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSubmitResponse}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Enviar Respuesta
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedReview(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {!review.hasResponse && selectedReview?.id !== review.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReview(review)}
                      className="bg-transparent"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Responder
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filterReviews().length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertCircle className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
                  <p className="text-muted-foreground">No se encontraron reseñas</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
