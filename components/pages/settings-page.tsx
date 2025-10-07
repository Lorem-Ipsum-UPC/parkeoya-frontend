'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, User, Bell, Shield } from '@/lib/icons'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1">Administra tu cuenta y preferencias</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="parking">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="parking">
            <Building2 className="mr-2 h-4 w-4" />
            Estacionamiento
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Seguridad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parking" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Estacionamiento</CardTitle>
              <CardDescription>Actualiza los detalles de tu estacionamiento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="parking-name">Nombre</Label>
                <Input id="parking-name" placeholder="Estacionamiento Centro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parking-address">Dirección</Label>
                <Input id="parking-address" placeholder="Calle Principal 123" />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualiza tu información de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" placeholder="Miguel Castro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="miguel@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" type="tel" placeholder="+593 99 999 9999" />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Configuración de notificaciones próximamente...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>Gestiona tu contraseña y seguridad de la cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Opciones de seguridad próximamente...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
