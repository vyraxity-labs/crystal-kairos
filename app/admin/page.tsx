import SummaryStats from '@/components/admin/SummaryStats'
import {
  getLastMonthMembersCount,
  getMembersCount,
  getPendingApprovalsCount,
} from '@/models/members/query'

const AdminDashboardPage = async () => {
  const [
    { data: membersCount },
    { data: lastMonthMembersCount },
    { data: pendingApprovalsCount },
  ] = await Promise.all([
    getMembersCount(),
    getLastMonthMembersCount(),
    getPendingApprovalsCount(),
  ])
  const membersChange = membersCount - lastMonthMembersCount

  return (
    <div>
      <SummaryStats
        membersCount={membersCount}
        membersChange={membersChange}
        pendingApprovalCount={pendingApprovalsCount}
      />
    </div>
  )
}

export default AdminDashboardPage
