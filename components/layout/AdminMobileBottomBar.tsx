'use client'

import { usePathname } from 'next/navigation'
import { adminNavItems } from './data'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import AddPopUp from './AddPopUp'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

const AdminMobileBottomBar = () => {
  const pathname = usePathname()
  const { t } = useTranslation('admin')

  return (
    <div className='md:hidden bg-sidebar fixed w-full bottom-0'>
      <div className='grid grid-cols-5'>
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              href={item.href}
              key={item.id}
              className={cn(
                'flex flex-col gap-2 items-center py-2 text-sidebar-foreground hover:bg-sidebar-accent',
                isActive ? 'bg-secondary' : '',
              )}
            >
              <item.icon size={20} />
              <span className='text-xs'>{t(item.label)}</span>
            </Link>
          )
        })}
      </div>

      <div className='absolute left-0 right-0 mx-auto top-[-70%] aspect-square w-fit'>
        <AddPopUp
          trigger={
            <Button
              size='icon'
              className='bg-tertiary hover:bg-tertiary-dim w-12 h-12 shadow-2xl'
            >
              <Plus size={32} />
            </Button>
          }
        />
      </div>
    </div>
  )
}

export default AdminMobileBottomBar
