import type {
  AuthResponse,
  SignUpRequest,
  SignInRequest,
  User,
  ParkingOwnerProfile,
  ApiError,
  CreateParkingRequest,
  ParkingResponse,
  CreateParkingResource,
  ParkingResource,
  AddParkingSpotResource,
  ParkingSpotResource,
  CreateEdgeServerResource,
  EdgeServerResource,
  CreateReservationResource,
  ReservationResource,
  CreatePaymentResource,
  PaymentResource,
  CreateReviewResource,
  ReviewResource,
  ParkingOwnerResource,
  DriverResource,
  RoleResource,
  DeviceResource,
  UpdateDeviceResource,
} from './types'

// Use NEXT_PUBLIC_API_URL when provided, otherwise default to the deployed backend
// NOTE: default is set to the deployed backend domain (no trailing slash). If you
// prefer to point to the Swagger UI directly, set NEXT_PUBLIC_API_URL in your
// environment to the full swagger URL provided by the backend.
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
        } catch {}
        throw new Error(errorMessage)
      }

      return response.json()
    } catch (error) {
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

  async getDriverProfile(userId: number): Promise<DriverResource> {
    return this.request<DriverResource>(`/api/v1/profiles/driver/${userId}`)
  }

  // Parking endpoints
  async createParking(data: CreateParkingRequest): Promise<ParkingResponse> {
    return this.request<ParkingResponse>('/api/v1/parkings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getAllParkings(): Promise<ParkingResource[]> {
    return this.request<ParkingResource[]>('/api/v1/parkings')
  }

  async getParkingById(parkingId: number): Promise<ParkingResource> {
    return this.request<ParkingResource>(`/api/v1/parkings/${parkingId}`)
  }

  async getParkingsByOwnerId(ownerId: number): Promise<ParkingResource[]> {
    return this.request<ParkingResource[]>(`/api/v1/parkings/owner/${ownerId}`)
  }

  // Parking spots endpoints
  async getParkingSpotsByParkingId(parkingId: number): Promise<ParkingSpotResource[]> {
    return this.request<ParkingSpotResource[]>(`/api/v1/parkings/${parkingId}/spots`)
  }

  async addParkingSpot(
    parkingId: number,
    data: AddParkingSpotResource
  ): Promise<ParkingSpotResource> {
    return this.request<ParkingSpotResource>(`/api/v1/parkings/${parkingId}/spots`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Edge server endpoints
  async createEdgeServer(data: CreateEdgeServerResource): Promise<EdgeServerResource> {
    return this.request<EdgeServerResource>('/api/v1/edge-servers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getEdgeServersByParkingId(parkingId: number): Promise<EdgeServerResource[]> {
    return this.request<EdgeServerResource[]>(`/api/v1/edge-servers/parking/${parkingId}`)
  }

  // Device endpoints
  async updateDevice(deviceId: string, data: UpdateDeviceResource): Promise<DeviceResource> {
    return this.request<DeviceResource>(`/api/v1/devices/${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async updateDeviceMacAddress(deviceId: number, macAddress: string): Promise<DeviceResource> {
    return this.request<DeviceResource>(
      `/api/v1/devices/${deviceId}?macAddress=${encodeURIComponent(macAddress)}`,
      {
        method: 'PATCH',
      }
    )
  }

  async getUnassignedDevicesByParkingId(parkingId: number): Promise<DeviceResource[]> {
    return this.request<DeviceResource[]>(`/api/v1/devices/unassigned/${parkingId}`)
  }

  async getDevicesByEdgeServerId(edgeServerId: string): Promise<DeviceResource[]> {
    return this.request<DeviceResource[]>(`/api/v1/devices/edge-server/${edgeServerId}`)
  }

  // Reservation endpoints
  async createReservation(data: CreateReservationResource): Promise<ReservationResource> {
    return this.request<ReservationResource>('/api/v1/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateReservationStatus(
    reservationId: number,
    status: string
  ): Promise<ReservationResource> {
    return this.request<ReservationResource>(
      `/api/v1/reservations/${reservationId}?status=${encodeURIComponent(status)}`,
      {
        method: 'PATCH',
      }
    )
  }

  async getReservationsByParkingId(parkingId: number): Promise<ReservationResource[]> {
    return this.request<ReservationResource[]>(`/api/v1/reservations/parking/${parkingId}`)
  }

  async getReservationsByDriverIdAndStatus(
    driverId: number,
    status: string
  ): Promise<ReservationResource[]> {
    return this.request<ReservationResource[]>(
      `/api/v1/reservations/driver/${driverId}/status/${status}`
    )
  }

  // Payment endpoints
  async createReservationPayment(
    reservationId: number,
    data: CreatePaymentResource
  ): Promise<PaymentResource> {
    return this.request<PaymentResource>(`/api/v1/payments/reservation/${reservationId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Review endpoints
  async createReview(data: CreateReviewResource): Promise<ReviewResource> {
    return this.request<ReviewResource>('/api/v1/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getReviewsByParkingId(parkingId: number): Promise<ReviewResource[]> {
    return this.request<ReviewResource[]>(`/api/v1/reviews/parking/${parkingId}`)
  }

  async getReviewsByDriverId(driverId: number): Promise<ReviewResource[]> {
    return this.request<ReviewResource[]>(`/api/v1/reviews/driver/${driverId}`)
  }

  // Notification endpoints
  async sendNotification(token: string, title: string, body: string): Promise<string> {
    return this.request<string>(
      `/api/v1/notifications/send?token=${encodeURIComponent(token)}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`,
      {
        method: 'POST',
      }
    )
  }

  async registerNotificationToken(userId: number, token: string): Promise<void> {
    return this.request<void>(
      `/api/v1/notifications/register-token?userId=${userId}&token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
      }
    )
  }

  async unregisterNotificationToken(token: string): Promise<void> {
    return this.request<void>(
      `/api/v1/notifications/unregister-token?token=${encodeURIComponent(token)}`,
      {
        method: 'DELETE',
      }
    )
  }

  // Role endpoints
  async getAllRoles(): Promise<RoleResource[]> {
    return this.request<RoleResource[]>('/api/v1/roles')
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
