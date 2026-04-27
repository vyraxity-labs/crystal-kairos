'use client'

import { UserRole } from '@/generated/prisma/enums'
import Sidebar from './Sidebar'
import { userNavItems } from './data'

const UserSidebar = () => {
  return <Sidebar role={UserRole.USER} data={userNavItems} />
}

export default UserSidebar
