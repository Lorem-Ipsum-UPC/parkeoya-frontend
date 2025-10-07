'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Car,
  LayoutDashboard,
  Square,
  Calendar,
  DollarSign,
  Star,
  Settings,
  Menu,
  X,
  LogOut,
} from '@/lib/icons'
import { logout, getCurrentUser } from '@/lib/auth'
import { MapPin } from 'lucide-react'

const navigation = [
  { name: 'Panel General', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Espacios IoT', href: '/dashboard/spaces', icon: Square },
  { name: 'Reservas', href: '/dashboard/reservations', icon: Calendar },
  { name: 'Finanzas', href: '/dashboard/finances', icon: DollarSign },
  { name: 'Reseñas', href: '/dashboard/reviews', icon: Star },
  { name: 'Configuración', href: '/dashboard/configuration', icon: Settings },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = getCurrentUser()

  return (
    <div className="bg-background min-h-screen">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-card fixed top-0 left-0 z-50 h-full w-64 transform border-r transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b p-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-green-300">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">ParkeoYa</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map(item => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-green-300 text-white'
                      : 'text-muted-foreground hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-300 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="bg-card sticky top-0 z-30 border-b lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">ParkeoYa</span>
            </div>
            <div className="w-6" />
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
