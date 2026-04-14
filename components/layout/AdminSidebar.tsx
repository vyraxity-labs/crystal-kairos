'use client'

import { useSession } from 'next-auth/react'
import Logo from '../common/Logo'
import UserAvatar from '../common/UserAvatar'
import { adminNavItems } from './data'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Logout from '../common/logout'
import { Button } from '../ui/button'
import { Plus, Settings } from 'lucide-react'
import { Separator } from '../ui/separator'
import AddPopUp from './AddPopUp'

const AdminSidebar = () => {
  const session = useSession()
  const { t } = useTranslation('admin')
  const pathname = usePathname()

  return (
    <div className='hidden md:flex md:flex-col w-80 bg-sidebar'>
      <div className='p-3 bg-tertiary flex justify-start'>
        <Logo />
      </div>

      <div className='p-3'>
        <Link
          href='/admin/profile'
          className='p-3 bg-sidebar-accent flex gap-2 rounded-md'
        >
          <UserAvatar />
          <div className='text-sidebar-foreground'>
            <h3>System Admin</h3>
            <p className='text-xs'>{session.data?.user.name}</p>
          </div>
        </Link>
      </div>

      <div className='p-3 flex flex-col gap-1 flex-1'>
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              href={item.href}
              key={item.id}
              className={cn(
                'flex gap-2 items-center p-3 text-sidebar-foreground rounded-md hover:bg-sidebar-accent',
                isActive ? 'bg-secondary' : '',
              )}
            >
              <item.icon />
              <span>{t(item.label)}</span>
            </Link>
          )
        })}
      </div>

      <div className='p-3'>
        <AddPopUp
          trigger={
            <Button
              variant='secondary'
              className='w-full rounded-sm text-on-secondary'
            >
              <Plus />
              {t('layout.mobile-bottom-bar.add.add')}
            </Button>
          }
        />
      </div>

      <Separator className='bg-tertiary' />

      <div className='p-3 flex flex-col gap-2'>
        <Button
          asChild
          variant='ghost'
          className='w-full justify-start py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-md'
        >
          <Link href='/admin/settings'>
            <Settings /> {t('layout.sidebar.menu-items.settings')}
          </Link>
        </Button>
        <Logout />
      </div>
    </div>
  )
}

export default AdminSidebar
