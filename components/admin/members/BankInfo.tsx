'use client'

import { MemberDetails } from '@/types/members.interface'
import InfoCard from './InfoCard'
import { useTranslation } from 'react-i18next'
import { Landmark } from 'lucide-react'
import InfoItem from './InfoItem'

const BankInfo = ({ data }: { data: MemberDetails['bankInfo'][] }) => {
  const { t } = useTranslation('admin-members')

  return (
    <InfoCard
      title={t('details.bank_info.title')}
      Icon={Landmark}
      variant='plain'
    >
      <div>
        {data.map((bank, index) => {
          return (
            <div className='grid gap-5 sm:grid-cols-2' key={index}>
              <InfoItem
                label={t('details.bank_info.bank_name')}
                value={bank.bankName}
              />
              <InfoItem
                label={t('details.bank_info.account_number')}
                value={bank.accountNumber}
              />
              <InfoItem
                label={t('details.bank_info.account_name')}
                value={bank.accountName}
              />
            </div>
          )
        })}
      </div>
    </InfoCard>
  )
}

export default BankInfo
