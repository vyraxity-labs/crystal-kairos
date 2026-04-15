'use client'

import { ClipboardClock, TrendingDown, TrendingUp, Users } from 'lucide-react'
import StatsCard from '../molecules/StatsCard'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'

const SummaryStats = ({
  membersCount,
  membersChange,
  pendingApprovalCount,
}: {
  membersCount: number
  membersChange: number
  pendingApprovalCount: number
}) => {
  const { t } = useTranslation('admin-dashboard')
  const iconSize = 16
  const isIncreased = membersChange >= 0

  return (
    <div className='flex gap-2'>
      <StatsCard
        Icon={Users}
        label={t('summary_stats.total_members')}
        number={String(membersCount)}
        color='oklch(0.3 0.18 264)'
        href='/admin/members'
        footer={
          <Badge
            className={cn(
              'flex gap-1 px-1 rounded-sm',
              isIncreased
                ? 'bg-success/15 text-success'
                : 'bg-error/15 text-error',
            )}
          >
            {isIncreased ? (
              <TrendingUp size={iconSize} />
            ) : (
              <TrendingDown size={iconSize} />
            )}
            <p className='text-xs'>
              {(membersChange * 100) / membersCount}%{' '}
              {t('summary_stats.from_last_month')}
            </p>
          </Badge>
        }
      />

      <StatsCard
        Icon={ClipboardClock}
        label={t('summary_stats.pending_approvals')}
        number={String(pendingApprovalCount)}
        color='oklch(0.44 0.2 27)'
        href='/admin/members?status=pending'
        footer={
          pendingApprovalCount > 0 ? (
            <Badge
              variant='destructive'
              className='text-error bg-error/15 capitalize rounded-sm'
            >
              {t('summary_stats.pending_approvals_action_required')}
            </Badge>
          ) : null
        }
      />
    </div>
  )
}

export default SummaryStats
