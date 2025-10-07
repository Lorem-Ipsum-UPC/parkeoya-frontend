import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ReservationsManagement } from "@/components/dashboard/reservations-management"

export default function ReservasPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ReservationsManagement />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
