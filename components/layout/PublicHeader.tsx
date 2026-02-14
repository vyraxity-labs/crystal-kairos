'use client'

import { IconButton } from '@mui/material'
import Logo from '../common/Logo'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import PublicMobileNav from './PublicMobileNav'
import { useDispatch } from 'react-redux'
import { setIsMobileNavOpen } from '@/store/nav.store'
import PublicDesktopNav from './PublicDesktopNav'

const PublicHeader = () => {
  const dispatch = useDispatch()

  return (
    <nav className='w-full bg-bg-paper'>
      <div className='w-[90%] max-w-300 mx-auto py-3 flex justify-between items-center'>
        <Logo />

        <div className='hidden md:flex'>
          <PublicDesktopNav />
        </div>

        <div className='flex md:hidden'>
          <IconButton onClick={() => dispatch(setIsMobileNavOpen(true))}>
            <MenuRoundedIcon />
          </IconButton>

          <PublicMobileNav />
        </div>
      </div>
    </nav>
  )
}

export default PublicHeader
