import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getEAjoGroupById } from '@/models/admin/query'
import { AdminEAjoGroupDetailClient } from '@/components/admin/AdminEAjoGroupDetailClient'

interface Props {
  params: Promise<{ groupId: string }>
}

const EAjoGroupDetailPage = async ({ params }: Props) => {
  const { groupId } = await params

  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') redirect('/dashboard')

  const result = await getEAjoGroupById(groupId)
  if (!result.success || !result.data) redirect('/admin/eajo')

  return <AdminEAjoGroupDetailClient group={result.data as any} />
}

export default EAjoGroupDetailPage
