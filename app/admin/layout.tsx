import AdminHeader from '@/components/layout/AdminHeader'
import AdminMobileBottomBar from '@/components/layout/AdminMobileBottomBar'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex h-screen'>
      <AdminSidebar />
      <div className='flex-1 flex flex-col overflow-auto'>
        <AdminHeader />
        <div className='flex-1'>{children}</div>
        <AdminMobileBottomBar />
      </div>
    </div>
  )
}

export default Layout
