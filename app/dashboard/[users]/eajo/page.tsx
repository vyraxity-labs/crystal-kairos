import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'
import { getUserEAjoMemberships, getOpenEAjoGroups } from '@/models/eajo/query'
import { EAjoDashboardClient } from '@/components/eajo/EAjoDashboardClient'

interface PageProps {
  params: Promise<{ users: string }>
}

const EAjoPage = async ({ params }: PageProps) => {
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
          You do not have permission to access this Ajo dashboard.
        </p>
      </div>
    )
  }

  const [membershipsResult, openGroupsResult] = await Promise.all([
    getUserEAjoMemberships(profileId),
    getOpenEAjoGroups(),
  ])

  const memberships = membershipsResult.success && membershipsResult.data ? membershipsResult.data : []
  const openGroups = openGroupsResult.success && openGroupsResult.data ? openGroupsResult.data : []

  return (
    <EAjoDashboardClient
      userId={profileId}
      memberships={memberships as any}
      openGroups={openGroups as any}
    />
  )
}

export default EAjoPage
