import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FinancialReports } from "@/components/dashboard/financial-reports"

export default function FinanzasPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <FinancialReports />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
