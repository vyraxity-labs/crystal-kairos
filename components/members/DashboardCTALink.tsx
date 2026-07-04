'use client'

import { LucideIcon } from 'lucide-react'
import { Card } from '../ui/card'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

const DashboardCTALink = ({
  Icon,
  label,
  description,
  variant = 'plain',
  href,
}: {
  Icon: LucideIcon
  label: string
  description: string
  variant?: 'blue' | 'plain'
  href: string
}) => {
  const { t } = useTranslation('members-dashboard')

  return (
    <Card className='w-full p-0 rounded-md'>
      <Link
        href={href}
        className={cn(
          'p-4 w-full h-full gap-4 flex flex-col justify-between',
          variant === 'blue' ? 'bg-primary text-on-primary' : 'text-foreground',
        )}
      >
        <section
          className={cn(
            'w-10 aspect-square flex justify-center items-center rounded-sm',
            variant === 'blue'
              ? 'bg-background text-foreground'
              : 'bg-orange-600/15 text-orange-600',
          )}
        >
          <Icon size={28} />
        </section>

        <section className='flex flex-col gap-2'>
          <h3 className='text-xl'>{t(label)}</h3>
          <p>{t(description)}</p>
        </section>
      </Link>
    </Card>
  )
}

export default DashboardCTALink
