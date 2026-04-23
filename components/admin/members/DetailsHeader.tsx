'use client'

import BreadCrumb from '@/components/molecules/BreadCrumb'
import StatusChip from '@/components/molecules/StatusChip'
import { Button } from '@/components/ui/button'
import { MembershipStatus } from '@/generated/prisma/enums'
import { CopyIcon } from 'lucide-react'
import { breadcrumbData } from './data'
import { cn } from '@/lib/utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useTranslation } from 'react-i18next'
import ApproveMemberDialog from './ApproveMemberDialog'

interface Props {
  name: string
  membershipNumber: string | null
  status: MembershipStatus
  userId: string
}

const DetailsHeader = ({ name, membershipNumber, status, userId }: Props) => {
  const { sidebarIsCollapsed } = useSelector((store: RootState) => store.nav)
  const { t } = useTranslation('admin-members')

  return (
    <div className='mb-6'>
      <div className='mb-3'>
        <BreadCrumb data={breadcrumbData} />
      </div>

      <h2 className='text-4xl font-bold'>{name}</h2>

      <div
        className={cn(
          'flex flex-col sm:flex-row sm:justify-between sm:items-end',
          sidebarIsCollapsed
            ? 'md:flex-row'
            : 'md:flex-col md:items-start lg:flex-row lg:items-end',
        )}
      >
        <section className='flex items-center gap-2 mb-2'>
          <span className='flex text-xs text-muted-foreground'>
            MembershipID:{' '}
            {membershipNumber || t('details.header.not_yet_assigned')}
          </span>
          {membershipNumber && (
            <Button variant='ghost' size='icon-sm'>
              <CopyIcon />
            </Button>
          )}

          <StatusChip status={status} />
        </section>

        {status === MembershipStatus.PENDING && (
          <section className='flex gap-2'>
            <Button variant='destructive' className='rounded-sm'>
              Reject Membership
            </Button>
            <ApproveMemberDialog userId={userId} name={name} />
          </section>
        )}
      </div>
    </div>
  )
}

export default DetailsHeader
