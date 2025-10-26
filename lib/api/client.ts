import type {
  AuthResponse,
  SignUpRequest,
  SignInRequest,
  User,
  ParkingOwnerProfile,
  ApiError,
  CreateParkingRequest,
  ParkingResponse,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('parkeoya_token')
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken()

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config)

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const error: ApiError = await response.json()
          errorMessage = error.message || errorMessage
          console.error('API Error:', error)
        } catch {
          console.error('Response status:', response.status, response.statusText)
        }
        throw new Error(errorMessage)
      }

      return response.json()
    } catch (error) {
      console.error('Request failed:', {
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error',
        fullError: error,
      })
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Unknown error occurred')
    }
  }

  // Auth endpoints
  async signUp(data: SignUpRequest): Promise<User> {
    return this.request<User>('/api/v1/authentication/sign-up/parking-owner', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async signIn(data: SignInRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/authentication/sign-in', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/api/v1/users')
  }

  async getUserById(id: number): Promise<User> {
    return this.request<User>(`/api/v1/users/${id}`)
  }

  // Profile endpoints
  async getParkingOwnerProfile(userId: number): Promise<ParkingOwnerProfile> {
    return this.request<ParkingOwnerProfile>(`/api/v1/profiles/parking-owner/${userId}`)
  }

  // Parking endpoints
  async createParking(data: CreateParkingRequest): Promise<ParkingResponse> {
    return this.request<ParkingResponse>('/api/v1/parkings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getParkingsByOwnerId(ownerId: number): Promise<ParkingResponse[]> {
    return this.request<ParkingResponse[]>(`/api/v1/parkings/owner/${ownerId}`)
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
