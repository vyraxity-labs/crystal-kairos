import { DisbursementsQueueClient } from '@/components/admin/DisbursementsQueueClient'
import { getPendingDisbursements } from '@/models/admin/query'
import { auth } from '@/auth'
import { AlertCircle } from 'lucide-react'

const AdminDisbursementsQueuePage = async () => {
  const session = await auth()
  if (!session?.user) {
    return null
  }

  const disbursementsRes = await getPendingDisbursements()

  if (!disbursementsRes.success || !disbursementsRes.data) {
    return (
      <div className="bg-error-container/10 border border-error-container/30 text-error p-4 rounded-lg flex items-start gap-2 text-xs">
        <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
        <span>Failed to load disbursement queue: {disbursementsRes.error}</span>
      </div>
    )
  }

  const disbursements = disbursementsRes.data

  return (
    <div className="container mx-auto py-6">
      <DisbursementsQueueClient
        disbursements={disbursements}
        adminId={session.user.id}
      />
    </div>
  )
}

export default AdminDisbursementsQueuePage
