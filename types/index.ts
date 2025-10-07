// Common types used across the application

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'owner' | 'user'
  avatar?: string
}

export interface Space {
  id: string
  name: string
  description: string
  capacity: number
  pricePerHour: number
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  amenities: string[]
  images: string[]
  ownerId: string
  availability: TimeSlot[]
}

export interface TimeSlot {
  day: number // 0-6 (Sunday-Saturday)
  startTime: string // HH:MM format
  endTime: string // HH:MM format
}

export interface Reservation {
  id: string
  spaceId: string
  userId: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
}

export interface Review {
  id: string
  spaceId: string
  userId: string
  rating: number // 1-5
  comment?: string
  createdAt: string
}

export interface FinancialReport {
  totalRevenue: number
  totalReservations: number
  averageRating: number
  period: {
    start: string
    end: string
  }
}
