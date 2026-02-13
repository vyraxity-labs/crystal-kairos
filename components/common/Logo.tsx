'use client'

import theme from '@/lib/theme'
import { Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { cx } from '@emotion/css'

const Logo = ({
  size = 'small',
  showText = true,
  alignment = 'horizontal',
}: {
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
  alignment?: 'horizontal' | 'vertical'
}) => {
  const { t } = useTranslation('common')

  const logoSize = cx(
    'w-8 aspect-square',
    size === 'small' ? 'w-8' : size === 'medium' ? 'w-16' : 'w-24',
  )
  const textSize = cx(
    size === 'small' ? '20px' : size === 'medium' ? '24px' : '32px',
  )
  const alignmentClass = cx(
    alignment === 'horizontal' ? 'flex-row' : 'flex-col',
  )

  return (
    <Link
      href='/'
      className={cx('flex items-center justify-center gap-2', alignmentClass)}
    >
      <Image
        src='/logo.png'
        width={50}
        height={50}
        alt='Logo'
        className={cx(logoSize, 'aspect-square')}
      />
      {showText && (
        <Typography
          variant='h5'
          sx={{ color: theme.palette.primary.main, fontSize: textSize }}
        >
          {t('header.logo.app_name')}
        </Typography>
      )}
    </Link>
  )
}

export default Logo
