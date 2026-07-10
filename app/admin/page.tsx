import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'
import { getAdminDashboardStats } from '@/models/admin/query'
import { getLastMonthMembersCount } from '@/models/members/query'
import { AlertCircle } from 'lucide-react'

const AdminDashboardPage = async () => {
  const [statsRes, lastMonthMembersRes] = await Promise.all([
    getAdminDashboardStats(),
    getLastMonthMembersCount(),
  ])

  if (!statsRes.success || !statsRes.data) {
    return (
      <div className="bg-error-container/10 border border-error-container/30 text-error p-4 rounded-lg flex items-start gap-2 text-xs">
        <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
        <span>Failed to load admin dashboard: {statsRes.error}</span>
      </div>
    )
  }

  const stats = statsRes.data
  const lastMonthCount = lastMonthMembersRes.success && lastMonthMembersRes.data ? lastMonthMembersRes.data : 0
  const membersChange = stats.activeMembersCount - lastMonthCount

  return (
    <AdminDashboardClient
      stats={stats}
      membersChange={membersChange >= 0 ? membersChange : 0}
    />
  )
}

export default AdminDashboardPage
