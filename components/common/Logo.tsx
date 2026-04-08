'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import logo from '@/public/logo.png'

const Logo = ({
  size = 'small',
  showText = true,
  alignment = 'horizontal',
  href = '/',
}: {
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
  alignment?: 'horizontal' | 'vertical'
  href?: string
}) => {
  const { t } = useTranslation('common')

  const logoSize = cn(
    'aspect-square',
    size === 'small' ? 'w-8' : size === 'medium' ? 'w-16' : 'w-24',
  )
  const textSizeClass = cn(
    size === 'small' ? 'text-xl' : size === 'medium' ? 'text-2xl' : 'text-3xl',
  )
  const alignmentClass = cn(
    alignment === 'horizontal' ? 'flex-row' : 'flex-col',
  )

  return (
    <Link
      href={href}
      className={cn('flex items-center justify-center gap-2', alignmentClass)}
    >
      <Image src={logo} alt='Logo' className={cn(logoSize)} />
      {showText && (
        <h2 className={cn('text-primary font-semibold', textSizeClass)}>
          {t('header.logo.app_name')}
        </h2>
      )}
    </Link>
  )
}

export default Logo
