'use client'

import Link from 'next/link'
import { navItems } from './data'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

const PublicDesktopNav = () => {
  const { t } = useTranslation('common')

  return (
    <div className='flex gap-4 items-center'>
      {navItems
        .sort((a, b) => Number(a.id) - Number(b.id))
        .map((item) => {
          return (
            <Link href={item.href} key={item.id} className='hover:underline'>
              {['/register', '/login'].includes(item.href) ? (
                <Button
                  variant='contained'
                  color={item.href === '/register' ? 'primary' : 'secondary'}
                >
                  {t(item.label)}
                </Button>
              ) : (
                t(item.label)
              )}
            </Link>
          )
        })}
    </div>
  )
}

export default PublicDesktopNav
