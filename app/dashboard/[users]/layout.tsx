import Header from '@/components/layout/Header'
import MobileBottomBar from '@/components/layout/MobileBottomBar'
import UserSidebar from '@/components/layout/UserSidebar'
import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex h-screen'>
      <UserSidebar />
      <div className='flex-1 flex flex-col overflow-auto'>
        <Header />
        <div className='flex-1 p-3 mb-20'>{children}</div>
        <MobileBottomBar />
      </div>
    </div>
  )
}

export default Layout
