import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getMemberById } from '@/models/members/query'
import { NewSavingsClient } from '@/components/savings/NewSavingsClient'
import { ShieldAlert } from 'lucide-react'

interface PageProps {
  params: Promise<{ users: string }>
  searchParams: Promise<{
    type?: string
  }>
}

const NewSavingsPlanPage = async ({ params, searchParams }: PageProps) => {
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
          You do not have permission to configure new savings plans.
        </p>
      </div>
    )
  }

  const query = await searchParams
  const initialType = query.type || 'FIXED'

  // Fetch member profile details including verified bank accounts
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
    <NewSavingsClient
      userId={profileId}
      bankAccounts={bankAccounts}
      initialType={initialType}
    />
  )
}

export default NewSavingsPlanPage
