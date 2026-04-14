import { auth } from '@/auth'

const AdminDashboardPage = async () => {
  const session = await auth()
  return (
    <div>
      <h2>{session?.user.name}</h2>
      <p>{session?.user.role}</p>
    </div>
  )
}

export default AdminDashboardPage
