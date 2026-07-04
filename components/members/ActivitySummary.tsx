'use client'

import { Banknote, Handshake, Wallet } from 'lucide-react'
import ActivitySummaryCard from './ActivitySummaryCard'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '@/lib/formatter'

const ActivitySummary = ({
  userId,
  summaryRecord,
}: {
  userId: string
  summaryRecord: {
    savings: number
    loan: number
    eAjo: number
  }
}) => {
  const { t } = useTranslation('members-dashboard')

  return (
    <div className='w-full flex flex-col gap-3 md:grid md:grid-cols-2 lg:flex lg:flex-row'>
      <ActivitySummaryCard
        label={t('activity_summary.card.savings.title')}
        href={`/dashboard/${userId}/savings`}
        value={`${formatCurrency(summaryRecord.savings)}`}
        Icon={Wallet}
        className='text-green-600 bg-green-600/15'
      />
      <ActivitySummaryCard
        label={t('activity_summary.card.e_ajo.title')}
        href={`/dashboard/${userId}/eajo`}
        value={`${summaryRecord.eAjo} ${t('activity_summary.card.e_ajo.suffix')}`}
        Icon={Handshake}
        className='text-blue-600 bg-blue-600/15'
      />
      <ActivitySummaryCard
        label={t('activity_summary.card.loans.title')}
        href={`/dashboard/${userId}/loans`}
        value={`${formatCurrency(summaryRecord.loan)}`}
        Icon={Banknote}
        className='text-red-600 bg-red-600/15'
      />
    </div>
  )
}

export default ActivitySummary
