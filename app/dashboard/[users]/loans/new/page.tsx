import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getMemberById, getSavingsRecords } from '@/models/members/query'
import { NewLoanClient } from '@/components/loans/NewLoanClient'
import { ShieldAlert } from 'lucide-react'

interface PageProps {
  params: Promise<{ users: string }>
}

const NewLoanPage = async ({ params }: PageProps) => {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const profileId = (await params).users
  const isSelf = session.user.id === profileId
  const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'OWNER'

  if (!isSelf && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <ShieldAlert className="w-12 h-12 text-error" />
        <h3 className="font-bold text-lg text-primary">Access Denied</h3>
        <p className="text-muted-foreground text-sm max-w-sm text-center">
          You do not have permission to submit new loan applications.
        </p>
      </div>
    )
  }

  // 1. Fetch user's active savings to calculate borrow eligibility bounds
  const savingsRes = await getSavingsRecords(profileId)
  const activeSavings = savingsRes.success && savingsRes.data
    ? savingsRes.data.filter((s) => s.status === 'ACTIVE')
    : []
  const totalSavings = activeSavings.reduce((sum, s) => sum + Number(s.currentBalance), 0)

  // 2. Fetch member profile for saved bank payout accounts
  const memberResult = await getMemberById(profileId)

  if (!memberResult.success || !memberResult.data) {
    return (
      <div className="p-6 text-center text-muted-foreground font-semibold">
        Member profile not found.
      </div>
    )
  }

  const member = memberResult.data
  const bankAccounts = (member.bankAccounts || []).map((acct) => ({
    id: acct.id,
    bankName: acct.bankName,
    accountNumber: acct.accountNumber,
    accountName: acct.accountName,
    isPrimary: acct.isPrimary,
  }))

  return (
    <NewLoanClient
      userId={profileId}
      bankAccounts={bankAccounts}
      totalSavings={totalSavings}
    />
  )
}

export default NewLoanPage
