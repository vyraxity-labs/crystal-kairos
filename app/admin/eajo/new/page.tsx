import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AdminCreateEAjoGroupClient } from '@/components/admin/AdminCreateEAjoGroupClient'

const NewEAjoGroupPage = async () => {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') redirect('/dashboard')

  return <AdminCreateEAjoGroupClient />
}

export default NewEAjoGroupPage
