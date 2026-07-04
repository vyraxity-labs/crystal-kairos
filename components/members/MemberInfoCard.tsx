'use client'

import { MembershipTier } from '@/generated/prisma/enums'
import { getMemberById } from '@/models/members/query'
import { useEffect, useState } from 'react'
import { Badge } from '../ui/badge'
import { membershipTierData } from '../admin/members/data'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'

const MemberInfoCard = ({ userId }: { userId: string }) => {
  const [memberInfo, setMemberInfo] = useState<{
    name: string
    tier: MembershipTier
    membershipNumber: string
  }>({ name: '', tier: MembershipTier.MEMBER, membershipNumber: '' })
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation('admin-members')
  const { t: tM } = useTranslation('members-dashboard')

  const tierData = membershipTierData[memberInfo.tier] || {
    label: 'Member',
    icon: () => null,
    bgColor: 'bg-gray-500',
  }
  const { label, icon: Icon, bgColor } = tierData

  useEffect(() => {
    let active = true

    const getMemberInfo = async () => {
      setIsLoading(true)
      const response = await getMemberById(userId)
      if (!active) return
      setIsLoading(false)

      if (response.success && response.data) {
        setMemberInfo({
          name: response.data.name,
          tier: response.data.membership?.tier || MembershipTier.MEMBER,
          membershipNumber: response.data.membership?.membershipNumber || '',
        })
      }
    }

    getMemberInfo()

    return () => {
      active = false
    }
  }, [userId])

  return (
    <div
      className='w-full aspect-2/1 rounded-md p-5 text-on-primary'
      style={{
        background: `
      radial-gradient(ellipse at top left, #41558A 0%, transparent 60%),
      radial-gradient(ellipse at bottom right, #515D8D 0%, transparent 60%),
      radial-gradient(ellipse at top right, #6a7fb5 0%, transparent 50%),
      #6b72a8
    `,
      }}
    >
      <div className='flex flex-col justify-between h-full'>
        <div className='flex justify-between items-start'>
          <section className='w-full'>
            <span className='uppercase text-xs'>{tM('main_card.title')}</span>
            {isLoading ? (
              <div className='flex flex-col gap-2 w-2/3'>
                <Skeleton className='h-8 w-full' />
              </div>
            ) : (
              <h3 className='text-2xl font-semibold'>{memberInfo.name}</h3>
            )}
          </section>

          <Badge className={cn('p-3', bgColor)}>
            {isLoading ? (
              <Skeleton className='h-4 w-24' />
            ) : (
              <>
                <Icon /> <span>{t(label)}</span>
              </>
            )}
          </Badge>
        </div>

        <div className='flex justify-between items-end'>
          <section className='w-full'>
            <span className='uppercase text-xs'>
              {tM('main_card.member_id')}
            </span>
            {isLoading ? (
              <div className='flex flex-col gap-2 w-1/2'>
                <Skeleton className='h-8 w-full' />
              </div>
            ) : (
              <h3 className='text-xl font-bold'>
                {memberInfo.membershipNumber}
              </h3>
            )}
          </section>

          <div className='w-10 aspect-square bg-black flex justify-center items-center uppercase text-xs'>
            ckv
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberInfoCard
