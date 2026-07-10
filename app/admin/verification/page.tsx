import { VerificationQueueClient } from '@/components/admin/VerificationQueueClient'
import { getPendingReceipts } from '@/models/admin/query'
import { auth } from '@/auth'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const AdminVerificationQueuePage = async () => {
  const session = await auth()
  if (!session?.user) {
    return null
  }

  const receiptsRes = await getPendingReceipts()

  if (!receiptsRes.success || !receiptsRes.data) {
    return (
      <div className="bg-error-container/10 border border-error-container/30 text-error p-4 rounded-lg flex items-start gap-2 text-xs">
        <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
        <span>Failed to load verification queue: {receiptsRes.error}</span>
      </div>
    )
  }

  const receipts = receiptsRes.data

  return (
    <div className="container mx-auto py-6">
      <VerificationQueueClient
        receipts={receipts}
        adminId={session.user.id}
      />
    </div>
  )
}

export default AdminVerificationQueuePage
