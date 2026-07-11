import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getMemberById } from '@/models/members/query'
import { getEAjoGroupForJoin } from '@/models/eajo/query'
import { NewAjoClient } from '@/components/eajo/NewAjoClient'
import { ShieldAlert } from 'lucide-react'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ users: string }>
  searchParams: Promise<{ groupId?: string }>
}

const NewEAjoPage = async ({ params, searchParams }: PageProps) => {
  const session = await auth()
  if (!session) redirect('/login')

  const profileId = (await params).users
  const isSelf = session.user.id === profileId
  const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'OWNER'

  if (!isSelf && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <ShieldAlert className="w-12 h-12 text-error" />
        <h3 className="font-bold text-lg text-primary">Access Denied</h3>
        <p className="text-muted-foreground text-sm max-w-sm text-center">
          You do not have permission to join Ajo groups.
        </p>
      </div>
    )
  }

  const query = await searchParams
  const groupId = query.groupId

  if (!groupId) redirect(`/dashboard/${profileId}/eajo`)

  const [memberResult, groupResult] = await Promise.all([
    getMemberById(profileId),
    getEAjoGroupForJoin(groupId),
  ])

  if (!memberResult.success || !memberResult.data) {
    return (
      <div className="p-6 text-center text-muted-foreground font-semibold">
        Member profile not found.
      </div>
    )
  }

  if (!groupResult.success || !groupResult.data) {
    return (
      <div className="p-6 text-center text-muted-foreground font-semibold">
        Ajo group not found or is no longer accepting applications.
      </div>
    )
  }

  // Fetch fee configs for this group's duration
  const durationMonthsMap: Record<string, number> = {
    FOUR_MONTHS: 4,
    SIX_MONTHS: 6,
    TWELVE_MONTHS: 12,
  }
  const months = durationMonthsMap[groupResult.data.duration] ?? 6
  const feeConfigs = await prisma.ajoFeeConfig.findMany({
    where: { durationMonths: months },
    orderBy: { pickPosition: 'asc' },
  })

  const bankAccounts = (memberResult.data.bankAccounts || []).map((acct) => ({
    id: acct.id,
    bankName: acct.bankName,
    accountNumber: acct.accountNumber,
    accountName: acct.accountName,
    isPrimary: acct.isPrimary,
  }))

  const serializedFeeConfigs = feeConfigs.map((f) => ({
    ...f,
    feePercentage: Number(f.feePercentage),
  }))

  return (
    <NewAjoClient
      userId={profileId}
      group={groupResult.data}
      feeConfigs={serializedFeeConfigs}
      bankAccounts={bankAccounts}
    />
  )
}

export default NewEAjoPage
