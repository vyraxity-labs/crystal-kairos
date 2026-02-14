'use client'

import { RootState } from '@/store'
import { cx } from '@emotion/css'
import { useDispatch, useSelector } from 'react-redux'
import Logo from '../common/Logo'
import { Button, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { setIsMobileNavOpen } from '@/store/nav.store'
import { navItems } from './data'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const PublicMobileNav = () => {
  const { isMobileNavOpen } = useSelector((store: RootState) => store.nav)
  const dispatch = useDispatch()
  const { t } = useTranslation('common')

  const handleClose = () => {
    dispatch(setIsMobileNavOpen(false))
  }

  return (
    <div
      className={cx(
        'w-full fixed h-screen top-0 bg-black/30 backdrop-blur-sm transition-all z-50',
        isMobileNavOpen ? 'left-0' : 'left-[-5000px]',
      )}
      onClick={handleClose}
    >
      <div
        className='w-[300px] h-full bg-bg-paper'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center px-2 py-2 border-b border-amber-200/30'>
          <Logo />
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className='px-2 flex flex-col gap-2'>
          {navItems.map((item) => {
            return (
              <Link href={item.href} key={item.id}>
                <Button
                  fullWidth
                  variant={
                    ['/register', '/login'].includes(item.href)
                      ? 'contained'
                      : 'text'
                  }
                  color={item.href === '/register' ? 'primary' : 'secondary'}
                >
                  {t(item.label)}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PublicMobileNav
