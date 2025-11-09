'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated, getCurrentUser } from '@/lib/auth'
import { apiClient } from '@/lib/api/client'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push('/login')
        return
      }

      if (pathname?.startsWith('/onboarding')) {
        setIsChecking(false)
        return
      }

      const user = getCurrentUser()
      if (user?.id) {
        try {
          const parkings = await apiClient.getParkingsByOwnerId(user.id)
          if (parkings.length === 0) {
            router.push('/onboarding')
            return
          }
        } catch (error) {}
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [router, pathname])

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    )
  }

  return <>{children}</>
}
