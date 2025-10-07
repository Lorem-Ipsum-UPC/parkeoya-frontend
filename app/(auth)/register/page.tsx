import { RegistrationForm } from '@/components/forms/registration-form'
import { Car } from '@/lib/icons'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-500 to-green-300 p-12 text-white lg:flex lg:w-1/2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <Car className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-2xl font-bold">ParkeoYa</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl leading-tight font-bold">
            Únete a la revolución del parqueo inteligente
          </h1>
          <p className="text-lg text-blue-100">
            Digitaliza tu estacionamiento y aumenta tu ocupación hasta un 40%.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold">
                ✓
              </div>
              <span>Monitoreo IoT en tiempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold">
                ✓
              </div>
              <span>Reportes financieros detallados</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold">
                ✓
              </div>
              <span>Gestión de reservas automatizada</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-blue-200">
          © 2025 ParkeoYa. Todos los derechos reservados.
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="bg-background flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="mb-8 text-center lg:hidden">
            <div className="mb-4 inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-foreground text-2xl font-bold">ParkeoYa</span>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Crear Cuenta</h2>
            <p className="text-muted-foreground">Completa el formulario para comenzar</p>
          </div>

          <RegistrationForm />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
