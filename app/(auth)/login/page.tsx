import { LoginForm } from '@/components/forms/login-form'
import { Car } from '@/lib/icons'
import Link from 'next/link'

export default function LoginPage() {
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
            Gestiona tu estacionamiento de forma inteligente
          </h1>
          <p className="text-lg text-blue-100">
            Monitoreo en tiempo real, análisis financiero y control total de tus espacios de
            parqueo.
          </p>
        </div>

        <div className="text-sm text-blue-200">
          © 2025 ParkeoYa. Todos los derechos reservados.
        </div>
      </div>

      {/* Right side - Login Form */}
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
            <h2 className="text-3xl font-bold tracking-tight">Iniciar Sesión</h2>
            <p className="text-muted-foreground">
              Ingresa tus credenciales para acceder a tu panel
            </p>
          </div>

          <LoginForm />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">¿No tienes una cuenta? </span>
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
