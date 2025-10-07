import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ReviewsManagement } from "@/components/dashboard/reviews-management"

export default function ResenasPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ReviewsManagement />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
