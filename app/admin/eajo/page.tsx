import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getAllEAjoGroups } from '@/models/admin/query'
import { AdminEAjoClient } from '@/components/admin/AdminEAjoClient'

const EAjoAdminPage = async () => {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') redirect('/dashboard')

  const result = await getAllEAjoGroups()
  const groups = result.success && result.data ? result.data : []

  return <AdminEAjoClient groups={groups as any} />
}

export default EAjoAdminPage
