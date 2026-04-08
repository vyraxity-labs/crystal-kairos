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
        variant={
          href === '/register'
            ? 'default'
            : href === '/login'
              ? 'secondary'
              : 'link'
        }
        className={cn(
          'w-full cursor-pointer',
          href === '/register' && 'text-on-primary',
          href === '/login' && 'text-on-secondary',
        )}
      >
        {t(label)}
      </Button>
    </Link>
  )
}

export default NavButton
