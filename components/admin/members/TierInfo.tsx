'use client'

import { MembershipTier } from '@/generated/prisma/enums'
import InfoCard from './InfoCard'
import { useTranslation } from 'react-i18next'
import { membershipTierData } from './data'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

const TierInfo = ({ tier }: { tier: MembershipTier }) => {
  const { t } = useTranslation('admin-members')
  const {
    icon: Icon,
    description,
    label,
    textColor,
    bgColor,
  } = membershipTierData[tier]

  return (
    <InfoCard title={t('details.tier_info.title')}>
      <div>
        <section className='flex gap-2 items-center'>
          <h2 className='text-2xl'>{t(label)}</h2>
          <Button
            variant='ghost'
            className={cn(
              'text-2xl rounded-sm pointer-events-none',
              textColor,
              bgColor,
            )}
          >
            <Icon />
          </Button>
        </section>

        <Separator className='bg-outline-variant/40 mt-8 mb-8' />

        <p>{t(description)}</p>
      </div>
    </InfoCard>
  )
}

export default TierInfo
