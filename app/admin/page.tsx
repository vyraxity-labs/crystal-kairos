import SummaryStats from '@/components/admin/SummaryStats'
import {
  getAllMembers,
  getMembersLastMonth,
  getPendingApprovals,
} from '@/models/members/query'

const AdminDashboardPage = async () => {
  const members = (await getAllMembers()).data
  const lastMonthMembers = (await getMembersLastMonth()).data
  const pendingApprovals = (await getPendingApprovals()).data

  return (
    <div>
      <SummaryStats
        membersCount={members.length}
        membersChange={members.length - lastMonthMembers.length}
        pendingApprovalCount={pendingApprovals.length}
      />
    </div>
  )
}

export default AdminDashboardPage
