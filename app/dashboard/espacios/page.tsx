import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SpaceManagement } from "@/components/dashboard/space-management"

export default function EspaciosPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <SpaceManagement />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
