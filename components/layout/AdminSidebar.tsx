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
import { ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react'
import { Separator } from '../ui/separator'
import AddPopUp from './AddPopUp'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { setSidebarIsCollapsed } from '@/store/nav.store'

const AdminSidebar = () => {
  const session = useSession()
  const { t } = useTranslation('admin')
  const pathname = usePathname()
  const { sidebarIsCollapsed } = useSelector((store: RootState) => store.nav)
  const dispatch = useDispatch()

  return (
    <div
      className={cn(
        'hidden md:flex md:flex-col bg-sidebar relative dark:border-r-2',
        sidebarIsCollapsed ? 'w-20' : 'w-60',
      )}
    >
      <Button
        size='icon'
        className='absolute right-0 translate-x-[50%] top-2 bg-tertiary hover:bg-tertiary-dim text-white border-surface-container-low'
        onClick={() => dispatch(setSidebarIsCollapsed(!sidebarIsCollapsed))}
      >
        {sidebarIsCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </Button>
      <div
        className={cn(
          'p-3 bg-tertiary flex',
          sidebarIsCollapsed ? 'justify-center' : 'justify-start',
        )}
      >
        <Logo showText={!sidebarIsCollapsed} />
      </div>

      <div className='p-3'>
        <Link
          href='/admin/profile'
          className='p-3 bg-sidebar-accent flex gap-2 rounded-md'
          title={session.data?.user?.name ?? ''}
        >
          <UserAvatar />
          <div
            className={cn(
              'text-sidebar-foreground',
              sidebarIsCollapsed ? 'hidden' : 'block',
            )}
          >
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
                sidebarIsCollapsed ? 'justify-center' : 'justify-start',
              )}
              title={t(item.label)}
            >
              <item.icon />
              <span className={cn(sidebarIsCollapsed ? 'hidden' : 'block')}>
                {t(item.label)}
              </span>
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
              title={t('layout.mobile-bottom-bar.add.add')}
            >
              <Plus />
              <span className={cn(sidebarIsCollapsed ? 'hidden' : 'block')}>
                {t('layout.mobile-bottom-bar.add.add')}
              </span>
            </Button>
          }
        />
      </div>

      <Separator className='bg-tertiary' />

      <div className='p-3 flex flex-col gap-2'>
        <Button
          asChild
          variant='ghost'
          className={cn(
            'w-full py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-md',
            sidebarIsCollapsed ? 'justify-center' : 'justify-start',
          )}
          title={t('layout.sidebar.menu-items.settings')}
        >
          <Link href='/admin/settings'>
            <Settings />
            <span className={cn(sidebarIsCollapsed ? 'hidden' : 'block')}>
              {t('layout.sidebar.menu-items.settings')}
            </span>
          </Link>
        </Button>
        <Logout showText={!sidebarIsCollapsed} />
      </div>
    </div>
  )
}

export default AdminSidebar
