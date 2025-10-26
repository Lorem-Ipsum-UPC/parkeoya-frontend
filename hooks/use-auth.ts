'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { setAuthData, clearAuthData, fetchUserProfile } from '@/lib/auth'
import type { SignUpRequest, SignInRequest } from '@/lib/api'

export function useAuth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signUp = async (data: SignUpRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Create account
      await apiClient.signUp(data)

      // 2. Auto login after signup
      const authResponse = await apiClient.signIn({
        email: data.email,
        password: data.password,
      })

      // 3. Save auth data
      setAuthData(authResponse)

      // 4. Fetch complete profile
      await fetchUserProfile(authResponse.id)

      // 5. Redirect to onboarding (not dashboard)
      router.push('/onboarding')

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear cuenta'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (data: SignInRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Login
      const authResponse = await apiClient.signIn(data)

      // 2. Save auth data
      setAuthData(authResponse)

      // 3. Fetch complete profile
      await fetchUserProfile(authResponse.id)

      // 4. Redirect to dashboard
      router.push('/dashboard')

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    clearAuthData()
    router.push('/login')
  }

  return {
    signUp,
    signIn,
    logout,
    isLoading,
    error,
  }
}
