import { apiClient } from './api'
import type { User, AuthResponse, ParkingOwnerProfile } from './api'

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null

  const userStr = localStorage.getItem('parkeoya_user')
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('parkeoya_token')
}

export function setAuthData(authResponse: AuthResponse): void {
  const user: User = {
    id: authResponse.id,
    email: authResponse.email,
    roles: authResponse.roles,
  }

  localStorage.setItem('parkeoya_user', JSON.stringify(user))
  localStorage.setItem('parkeoya_token', authResponse.token)
}

export function clearAuthData(): void {
  localStorage.removeItem('parkeoya_user')
  localStorage.removeItem('parkeoya_token')
  localStorage.removeItem('parkeoya_profile')
}

export function logout(): void {
  clearAuthData()
  window.location.href = '/login'
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null && getAuthToken() !== null
}

export async function fetchUserProfile(userId: number): Promise<ParkingOwnerProfile> {
  const profile = await apiClient.getParkingOwnerProfile(userId)
  localStorage.setItem('parkeoya_profile', JSON.stringify(profile))
  return profile
}

export function getCachedProfile(): ParkingOwnerProfile | null {
  if (typeof window === 'undefined') return null

  const profileStr = localStorage.getItem('parkeoya_profile')
  if (!profileStr) return null

  try {
    return JSON.parse(profileStr)
  } catch {
    return null
  }
}
