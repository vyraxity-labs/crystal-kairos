'use client'

import { UserIcon } from 'lucide-react'
import InfoCard from './InfoCard'
import { MemberDetails } from '@/types/members.interface'
import InfoItem from './InfoItem'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'

const PersonalInfo = ({ data }: { data: MemberDetails['personalInfo'] }) => {
  const { t } = useTranslation('admin-members')

  return (
    <InfoCard Icon={UserIcon} title={t('details.personal_info.title')}>
      <div className='flex flex-col gap-5'>
        <div className='grid gap-5 sm:grid-cols-2'>
          <InfoItem
            label={t('details.personal_info.full_legal_name')}
            value={data.name}
          />
          <InfoItem
            label={t('details.personal_info.email')}
            value={data.email}
          />
          <InfoItem
            label={t('details.personal_info.phone')}
            value={data.phone ?? t('n_a')}
          />
          <InfoItem
            label={t('details.personal_info.gender')}
            value={data.gender ?? t('n_a')}
          />
          <InfoItem
            label={t('details.personal_info.date_of_birth')}
            value={
              data.dateOfBirth
                ? format(data.dateOfBirth, 'dd MMMM yyyy')
                : t('n_a')
            }
          />
          <InfoItem
            label={t('details.personal_info.occupation')}
            value={data.occupation ?? t('n_a')}
          />
        </div>
        <InfoItem
          label={t('details.personal_info.address')}
          value={data.address ?? t('n_a')}
        />
      </div>
    </InfoCard>
  )
}

export default PersonalInfo
