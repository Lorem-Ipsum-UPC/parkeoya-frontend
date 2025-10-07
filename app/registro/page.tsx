import { RegistrationForm } from "@/components/auth/registration-form"
import { Car } from "@/lib/icons"
import Link from "next/link"

export default function RegistroPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-2xl font-bold">ParkeoYa</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">Únete a la revolución del parqueo inteligente</h1>
          <p className="text-lg text-blue-100">Digitaliza tu estacionamiento y aumenta tu ocupación hasta un 40%.</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span>Monitoreo IoT en tiempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span>Reportes financieros detallados</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span>Gestión de reservas automatizada</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-blue-200">© 2025 ParkeoYa. Todos los derechos reservados.</div>
      </div>

      {/* Right side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">ParkeoYa</span>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Crear Cuenta</h2>
            <p className="text-muted-foreground">Completa el formulario para comenzar</p>
          </div>

          <RegistrationForm />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
