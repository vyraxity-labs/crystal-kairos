import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getEarningRecords } from '@/models/members/query'
import { EAjoDashboardClient } from '@/components/eajo/EAjoDashboardClient'
import { ShieldAlert } from 'lucide-react'

interface PageProps {
  params: Promise<{ users: string }>
}

const EAjoPage = async ({ params }: PageProps) => {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const profileId = (await params).users
  const isSelf = session.user.id === profileId
  const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'OWNER'

  if (!isSelf && !isAdmin) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] gap-3'>
        <ShieldAlert className='w-12 h-12 text-error' />
        <h3 className='font-bold text-lg text-primary'>Access Denied</h3>
        <p className='text-muted-foreground text-sm max-w-sm text-center'>
          You do not have permission to access this Ajo dashboard.
        </p>
      </div>
    )
  }

  const earningResult = await getEarningRecords(profileId)
  const earningRecords =
    earningResult.success && earningResult.data ? earningResult.data : []

  // Map earnings records to dashboard client format
  const ajoRecords = earningRecords.map((earning) => ({
    id: earning.id,
    contributionAmount: Number(earning.contributionAmount),
    totalParticipants: earning.totalParticipants,
    duration: earning.duration,
    frequency: earning.frequency,
    payoutPosition: earning.payoutPosition,
    netPayoutAmount: Number(earning.netPayoutAmount),
    currentBalance: Number(earning.currentBalance),
    totalContributed: Number(earning.totalContributed),
    status: earning.status,
    createdAt: earning.createdAt,
  }))

  return <EAjoDashboardClient userId={profileId} ajoRecords={ajoRecords} />
}

export default EAjoPage
