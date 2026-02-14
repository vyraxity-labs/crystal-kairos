'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Typography } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import RegistrationStepper from './RegistrationStepper'

interface RegistrationLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  showStepper?: boolean
}

const RegistrationLayout = ({
  children,
  title,
  subtitle,
  showStepper = true,
}: RegistrationLayoutProps) => {
  const { t } = useTranslation('auth')

  return (
    <div className='min-h-screen py-8 px-4' style={{ backgroundColor: 'var(--color-bg-main)' }}>
      <div className='max-w-2xl mx-auto'>
        <div className='text-center mb-4'>
          <Typography variant='h4' fontWeight={700} color='text.primary'>
            {title ?? t('register.title')}
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
            {subtitle ?? t('register.subtitle')}
          </Typography>
        </div>

        {showStepper && (
          <div className='mb-6'>
            <RegistrationStepper />
          </div>
        )}

        {children}

        <div className='text-center mt-8'>
          <Typography variant='body2' color='text.secondary'>
            {t('register.support_text')}{' '}
            <Link href='/help' className='text-primary hover:underline'>
              {t('register.support_link')}
            </Link>
          </Typography>
        </div>
      </div>

      <button
        type='button'
        className='fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50'
        style={{ backgroundColor: 'var(--color-accent)' }}
        aria-label='Help'
      >
        <HelpOutlineIcon sx={{ color: 'white', fontSize: 28 }} />
      </button>
    </div>
  )
}

export default RegistrationLayout
