import { auth } from '@/auth'
import Logout from '@/components/admin/logout'

const UserPage = async () => {
  const session = await auth()
  return (
    <div>
      <h2>{session?.user.name}</h2>
      <p>{session?.user.role}</p>
      <Logout />
    </div>
  )
}

export default UserPage
