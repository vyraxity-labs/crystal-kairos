import { adminNavItems } from './data'
import Sidebar from './Sidebar'
import { UserRole } from '@/generated/prisma/enums'

const AdminSidebar = () => {
  return <Sidebar role={UserRole.ADMIN} data={adminNavItems} />
}

export default AdminSidebar
