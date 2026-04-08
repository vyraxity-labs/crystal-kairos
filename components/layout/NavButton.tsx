'use client'

import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const NavButton = ({ href, label }: { href: string; label: string }) => {
  const { t } = useTranslation('common')

  return (
    <Link href={href}>
      <Button
        variant={['/register', '/login'].includes(href) ? 'default' : 'link'}
        className={cn(
          'w-full cursor-pointer',
          href === '/register'
            ? 'bg-primary text-on-primary'
            : href === '/login'
              ? 'bg-secondary text-on-secondary hover:bg-secondary/80'
              : 'bg-transparent',
        )}
      >
        {t(label)}
      </Button>
    </Link>
  )
}

export default NavButton
