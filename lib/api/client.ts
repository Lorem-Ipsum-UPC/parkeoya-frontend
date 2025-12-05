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
  UpdateParkingResource,
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
  UpdateParkingOwnerResource,
  DriverResource,
  RoleResource,
  DeviceResource,
  UpdateDeviceResource,
} from './types'

// 🔧 MODO DESARROLLO: Backend local activado
//const API_BASE_URL = 'http://localhost:8080'

// 🌐 PRODUCCIÓN: Comentado temporalmente para pruebas locales
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://parkeoya-backend-latest-1.onrender.com'

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
        let errorMessage = `Error ${response.status}`
        let errorDetails = ''

        try {
          const errorData = await response.json()

          // Intentar extraer el mensaje de error del backend
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.error) {
            errorMessage = errorData.error
          } else if (errorData.detail) {
            errorMessage = errorData.detail
          } else if (errorData.title) {
            errorMessage = errorData.title
          } else if (typeof errorData === 'string') {
            errorMessage = errorData
          }

          // Agregar detalles adicionales si existen
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorDetails = errorData.errors.map((e: any) => e.message || e).join(', ')
          } else if (errorData.details && typeof errorData.details === 'object') {
            errorDetails = JSON.stringify(errorData.details)
          } else if (errorData.details && typeof errorData.details === 'string') {
            errorDetails = errorData.details
          }

          // Si hay detalles, agregarlos al mensaje
          if (errorDetails) {
            errorMessage += `: ${errorDetails}`
          }

          // Si aún no tenemos un mensaje específico, intentar con el objeto completo
          if (errorMessage === `Error ${response.status}` && Object.keys(errorData).length > 0) {
            errorMessage = JSON.stringify(errorData)
          }
        } catch (parseError) {
          // Si no se puede parsear, usar el status text
          errorMessage = `${response.statusText || errorMessage}`
        }

        throw new Error(errorMessage)
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Error desconocido. Por favor, intenta de nuevo.')
    }
  }

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

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/api/v1/users')
  }

  async getUserById(id: number): Promise<User> {
    return this.request<User>(`/api/v1/users/${id}`)
  }

  async getParkingOwnerProfile(userId: number): Promise<ParkingOwnerProfile> {
    return this.request<ParkingOwnerProfile>(`/api/v1/profiles/parking-owner/${userId}`)
  }

  async updateParkingOwnerProfile(
    parkingOwnerId: number,
    data: UpdateParkingOwnerResource
  ): Promise<ParkingOwnerResource> {
    return this.request<ParkingOwnerResource>(`/api/v1/profiles/parking-owner/${parkingOwnerId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async getDriverProfile(userId: number): Promise<DriverResource> {
    return this.request<DriverResource>(`/api/v1/profiles/driver/${userId}`)
  }

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

  async updateParking(parkingId: number, data: UpdateParkingResource): Promise<ParkingResource> {
    return this.request<ParkingResource>(`/api/v1/parkings/${parkingId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

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

  async createEdgeServer(data: CreateEdgeServerResource): Promise<EdgeServerResource> {
    return this.request<EdgeServerResource>('/api/v1/edge-servers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getEdgeServersByParkingId(parkingId: number): Promise<EdgeServerResource[]> {
    return this.request<EdgeServerResource[]>(`/api/v1/edge-servers/parking/${parkingId}`)
  }

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
    console.log(`🌐 URL completa: ${this.baseUrl}/api/v1/devices/edge-server/${edgeServerId}`)
    return this.request<DeviceResource[]>(`/api/v1/devices/edge-server/${edgeServerId}`)
  }

  async getDevicesByParkingId(parkingId: number): Promise<DeviceResource[]> {
    console.log(`🔍 Obteniendo dispositivos para parking ${parkingId}`)
    const edgeServers = await this.getEdgeServersByParkingId(parkingId)
    console.log(`🖥️ Edge Servers encontrados:`, edgeServers)
    
    let allDevices: DeviceResource[] = []
    for (const edgeServer of edgeServers) {
      console.log(`📡 Consultando dispositivos del edge server: ${edgeServer.serverId}`)
      const devices = await this.getDevicesByEdgeServerId(edgeServer.serverId)
      console.log(`   ↳ Dispositivos obtenidos:`, devices)
      allDevices = [...allDevices, ...devices]
    }
    
    console.log(`✅ Total dispositivos para parking ${parkingId}:`, allDevices.length)
    return allDevices
  }

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

  async createReservationPayment(
    reservationId: number,
    data: CreatePaymentResource
  ): Promise<PaymentResource> {
    return this.request<PaymentResource>(`/api/v1/payments/reservation/${reservationId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

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

  async getAllRoles(): Promise<RoleResource[]> {
    return this.request<RoleResource[]>('/api/v1/roles')
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
