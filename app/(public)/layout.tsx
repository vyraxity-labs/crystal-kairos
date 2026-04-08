import PublicFooter from '@/components/layout/PublicFooter'
import PublicHeader from '@/components/layout/PublicHeader'
import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <PublicHeader />
      <main className='min-h-screen'>{children}</main>
      <PublicFooter />
    </div>
  )
}

export default Layout
