import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getMemberById } from '@/models/members/query'
import { getAjoFeeConfigsForDuration } from '@/models/eajo/query'
import { NewAjoClient } from '@/components/eajo/NewAjoClient'
import { EAjoDuration } from '@/generated/prisma/enums'
import { ShieldAlert } from 'lucide-react'

interface PageProps {
  params: Promise<{ users: string }>
  searchParams: Promise<{
    duration?: string
    amount?: string
    slots?: string
  }>
}

const NewEAjoPage = async ({ params, searchParams }: PageProps) => {
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
          You do not have permission to subscribe to Ajo pools.
        </p>
      </div>
    )
  }

  const query = await searchParams
  const duration = (query.duration as EAjoDuration) || EAjoDuration.SIX_MONTHS
  const amount = Number(query.amount) || 50000
  const slots = Number(query.slots) || 6

  // Fetch member profile details (including bank accounts) and fee configs
  const [memberResult, feeConfigsResult] = await Promise.all([
    getMemberById(profileId),
    getAjoFeeConfigsForDuration(duration),
  ])

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

  const feeConfigs = feeConfigsResult.success && feeConfigsResult.data ? feeConfigsResult.data : []

  return (
    <NewAjoClient
      userId={profileId}
      duration={duration}
      amount={amount}
      slots={slots}
      feeConfigs={feeConfigs}
      bankAccounts={bankAccounts}
    />
  )
}

export default NewEAjoPage
