// API Response Types matching backend endpoints

export interface ApiError {
  path: string
  message: string
  timestamp: string
}

export interface User {
  id: number
  email: string
  roles: string[]
}

export interface AuthResponse {
  id: number
  email: string
  token: string
  roles: string[]
}

export interface ParkingOwnerProfile {
  userId: number
  parkingOwnerId: number
  fullName: string
  city: string
  country: string
  phone: string
  companyName: string
  ruc: string
}

// API Request Types

export interface SignUpRequest {
  email: string
  password: string
  fullName: string
  city: string
  country: string
  phone: string
  companyName: string
  ruc: string
}

export interface SignInRequest {
  email: string
  password: string
}

// Parking Types

export interface CreateParkingRequest {
  ownerId: number
  name: string
  description: string
  address: string
  ratePerHour: number
  totalSpots: number
  availableSpots: number
  totalRows: number
  totalColumns: number
  imageUrl: string // Backend requiere @NotNull
}

export interface ParkingResponse {
  id: number
  ownerId: number
  name: string
  description: string
  address: string
  ratePerHour: number
  totalSpots: number
  availableSpots: number
  totalRows: number
  totalColumns: number
  imageUrl?: string
  createdAt: string
  updatedAt: string
}
