'use client'

import { cn } from '@/lib/utils'
import { RootState } from '@/store'
import { setIsMobileNavOpen } from '@/store/nav.store'
import { useDispatch, useSelector } from 'react-redux'
import Logo from '../common/Logo'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { navItems } from './data'
import NavButton from './NavButton'

const PublicMobileNav = () => {
  const { isMobileNavOpen } = useSelector((store: RootState) => store.nav)
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(setIsMobileNavOpen(false))
  }

  return (
    <div
      className={cn(
        'w-full fixed h-screen top-0 bg-black/30 backdrop-blur-sm transition-all z-50',
        isMobileNavOpen ? 'left-0' : 'left-[-5000px]',
      )}
      onClick={handleClose}
    >
      <div
        className='w-[300px] h-full bg-background text-foreground'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center px-2 py-2 border-b border-outline-variant'>
          <Logo />
          <Button
            onClick={handleClose}
            variant='outline'
            size='icon'
            className='cursor-pointer'
          >
            <X />
          </Button>
        </div>

        <div className='px-2 flex flex-col gap-2'>
          {navItems.map((item) => {
            return (
              <NavButton href={item.href} label={item.label} key={item.id} />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PublicMobileNav
