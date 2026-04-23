'use client'

import { MemberDetails } from '@/types/members.interface'
import InfoCard from './InfoCard'
import { useTranslation } from 'react-i18next'
import { Network } from 'lucide-react'
import InfoItem from './InfoItem'

const NextOfKinInfo = ({ data }: { data: MemberDetails['nextOfKinInfo'] }) => {
  const { t } = useTranslation('admin-members')
  return (
    <InfoCard
      title={t('details.next_of_kin_info.title')}
      Icon={Network}
      variant='plain'
    >
      <div className='grid gap-5'>
        <InfoItem
          label={t('details.next_of_kin_info.name')}
          value={data.name || t('n_a')}
        />
        <InfoItem
          label={t('details.next_of_kin_info.relationship')}
          value={data.relationship || t('n_a')}
        />
        <InfoItem
          label={t('details.next_of_kin_info.phone_number')}
          value={data.phoneNumber || t('n_a')}
        />
      </div>
    </InfoCard>
  )
}

export default NextOfKinInfo
