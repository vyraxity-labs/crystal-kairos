'use client'

import Logo from '../common/Logo'
import { Button } from '../ui/button'
import PublicMobileNav from './PublicMobileNav'
import { useDispatch } from 'react-redux'
import { SquareMenu } from 'lucide-react'
import { setIsMobileNavOpen } from '@/store/nav.store'
import PublicDesktopNav from './PublicDesktopNav'

const PublicHeader = () => {
  const dispatch = useDispatch()

  return (
    <nav>
      <div className='w-[90%] max-w-300 mx-auto py-3 flex justify-between items-center'>
        <Logo />

        <div className='hidden md:flex'>
          <PublicDesktopNav />
        </div>

        <div className='flex md:hidden'>
          <Button
            size='icon'
            variant='outline'
            className='cursor-pointer'
            onClick={() => dispatch(setIsMobileNavOpen(true))}
          >
            <SquareMenu />
          </Button>

          <PublicMobileNav />
        </div>
      </div>
    </nav>
  )
}

export default PublicHeader
