export interface SignInResource {
  email: string
  password: string
}

export interface SignUpParkingOwnerResource {
  email: string
  password: string
  fullName: string
  city: string
  country: string
  phone: string
  companyName: string
  ruc: string
}

export interface SignUpDriverResource {
  email: string
  password: string
  fullName: string
  city: string
  country: string
  phone: string
  dni: string
}

export interface AuthenticatedUserResource {
  id: number
  email: string
  token: string
  roles: string[]
}

export interface UserResource {
  id: number
  email: string
  roles: string[]
}
export interface CreateParkingResource {
  ownerId: number
  name: string
  description: string
  address: string
  city: string
  province: string
  postalCode: string
  lat: number
  lng: number
  ratePerHour: string
  dailyRate: string
  monthlyRate: string
  totalSpots: string
  regularSpots: string
  disabledSpots: string
  electricSpots: string
  availableSpots: string
  totalRows: string
  totalColumns: string
  imageUrl?: string
  operatingDays: string
  open24Hours: boolean
  openingTime?: string
  closingTime?: string
}

export interface ParkingResource {
  id: number
  ownerId: number
  name: string
  description: string
  address: string
  city: string
  province: string
  postalCode: string
  lat: number
  lng: number
  ratePerHour: number
  dailyRate: number
  monthlyRate: number
  rating: number
  ratingCount: number
  totalSpots: number
  regularSpots: number
  disabledSpots: number
  electricSpots: number
  availableSpots: number
  totalRows: number
  totalColumns: number
  imageUrl?: string
  operatingDays: string
  open24Hours: boolean
  openingTime?: string
  closingTime?: string
}

export interface UpdateParkingResource {
  name?: string
  description?: string
  address?: string
  city?: string
  province?: string
  postalCode?: string
  lat?: number
  lng?: number
  ratePerHour?: number
  dailyRate?: number
  monthlyRate?: number
  open24hours?: boolean
  openingTime?: string
  closingTime?: string
  operatingDays?: string
  imageUrl?: string
  totalSpots?: number
  regularSpots?: number
  disabledSpots?: number
  electricSpots?: number
}

export interface AddParkingSpotResource {
  row: number
  column: number
  label: string
}

export interface ParkingSpotResource {
  id: string
  parkingId: number
  rowIndex: number
  columnIndex: number
  label: string
  status: string
}
export interface CreateEdgeServerResource {
  serverId: string
  apiKey: string
  name: string
  macAddress: string
  status: string
  parkingId: number
}

export interface EdgeServerResource {
  id: number
  serverId: string
  apiKey: string
  name: string
  ipAddress: string
  status: string
  lastHeartbeat: string
  connectedDevicesCount: number
  parkingId: number
}
export interface UpdateDeviceResource {
  edgeId?: string
  macAddress?: string
  type?: string
}

export interface DeviceResource {
  id: number
  macAddress: string
  type: string
  operationalStatus: string
  spotStatus: string
  spotLabel?: string
  parkingSpotId?: string
  parkingId: number
  edgeServerId?: string
  lastCommunication?: string
}
export interface CreateReservationResource {
  driverId: number
  vehiclePlate: string
  parkingId: number
  parkingSpotId: string
  date: string
  startTime: string
  endTime: string
}

export interface ReservationResource {
  id: number
  driverFullName: string
  driverId: number
  vehiclePlate: string
  parkingId: number
  parkingSpotId: string
  spotLabel: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
  status: string
}
export interface CreatePaymentResource {
  userId: number
  amount: number
  nameOnCard: string
  cardNumber: string
  cardExpiryDate: string
}

export interface PaymentResource {
  paymentType: string
  id: number
  amount: number
  paidAt: string
  reservationId: number
  subscriptionId?: number
}
export interface CreateReviewResource {
  driverId: number
  parkingId: number
  comment: string
  rating: number
}

export interface ReviewResource {
  id: number
  driverId: number
  driverName: string
  parkingId: number
  parkingName: string
  comment: string
  rating: number
  createdAt: string
}
export interface ParkingOwnerResource {
  userId: number
  parkingOwnerId: number
  fullName: string
  city: string
  country: string
  phone: string
  companyName: string
  ruc: string
}

export interface UpdateParkingOwnerResource {
  fullName?: string
  city?: string
  country?: string
  phone?: string
  companyName?: string
  ruc?: string
}

export interface DriverResource {
  userId: number
  driverId: number
  fullName: string
  city: string
  country: string
  phone: string
  dni: string
}
export interface RoleResource {
  id: number
  name: string
}
export interface ApiError {
  message: string
  status?: number
  timestamp?: string
}
export interface AuthResponse {
  id: number
  email: string
  token: string
  roles: string[]
}

export interface SignUpRequest extends SignUpParkingOwnerResource {}

export interface SignInRequest extends SignInResource {}

export interface User extends UserResource {}

export interface ParkingOwnerProfile extends ParkingOwnerResource {}

export interface CreateParkingRequest extends CreateParkingResource {}

export interface ParkingResponse extends ParkingResource {}
