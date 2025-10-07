'use client'

// Mock auth utilities - replace with Supabase auth when integration is added
export function getCurrentUser() {
  if (typeof window === 'undefined') return null

  const userStr = localStorage.getItem('parkeoya_user')
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem('parkeoya_user')
  window.location.href = '/login'
}

export function isAuthenticated() {
  return getCurrentUser() !== null
}
