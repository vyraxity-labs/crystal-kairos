'use client'

import { Typography } from '@mui/material'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const RegisterSuccessPage = () => {
  const { t } = useTranslation('auth')

  return (
    <div
      className='min-h-screen flex flex-col items-center justify-center px-4'
      style={{ backgroundColor: 'var(--color-bg-main)' }}
    >
      <CheckCircleIcon sx={{ fontSize: 80, color: 'var(--color-primary)' }} />
      <Typography
        variant='h4'
        fontWeight={700}
        sx={{ mt: 2, textAlign: 'center' }}
      >
        {t('success.title')}
      </Typography>
      <Typography
        variant='body1'
        color='text.secondary'
        sx={{ mt: 1, textAlign: 'center', maxWidth: 400 }}
      >
        {t('success.message')}
      </Typography>
      <Link
        href='/'
        className='mt-8 px-6 py-3 rounded-lg font-semibold text-white'
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        {t('success.back_home')}
      </Link>
    </div>
  )
}

export default RegisterSuccessPage
