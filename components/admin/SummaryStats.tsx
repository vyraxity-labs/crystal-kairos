'use client'

import {
  ClipboardClock,
  TrendingDown,
  TrendingUp,
  Users,
  PiggyBank,
  Handshake,
  DollarSign,
} from 'lucide-react'
import StatsCard from '../molecules/StatsCard'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'

interface SummaryStatsProps {
  stats: {
    totalMembers: number
    pendingApprovals: number
    totalSavingsBalance: number
    totalLoansOutstanding: number
    totalAjoBalance: number
  }
  membersChange: number
}

const SummaryStats = ({ stats, membersChange }: SummaryStatsProps) => {
  const { t } = useTranslation('admin-dashboard')
  const iconSize = 16
  const isIncreased = membersChange >= 0

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="flex flex-wrap gap-4 w-full">
      <StatsCard
        Icon={Users}
        label={t('summary_stats.total_members') || 'Total Members'}
        number={String(stats.totalMembers)}
        color="oklch(0.3 0.18 264)"
        href="/admin/members"
        footer={
          <Badge
            className={cn(
              'flex gap-1 px-1 rounded-sm border-0',
              isIncreased
                ? 'bg-success/15 text-success'
                : 'bg-error/15 text-error'
            )}
          >
            {isIncreased ? (
              <TrendingUp size={iconSize} />
            ) : (
              <TrendingDown size={iconSize} />
            )}
            <p className="text-[10px] font-bold">
              {stats.totalMembers > 0
                ? ((membersChange * 100) / stats.totalMembers).toFixed(1)
                : 0}
              % {t('summary_stats.from_last_month') || 'vs last month'}
            </p>
          </Badge>
        }
      />

      <StatsCard
        Icon={ClipboardClock}
        label={t('summary_stats.pending_approvals') || 'Pending KYC'}
        number={String(stats.pendingApprovals)}
        color="oklch(0.44 0.2 27)"
        href="/admin/members?status=pending"
        footer={
          stats.pendingApprovals > 0 ? (
            <Badge
              variant="destructive"
              className="text-error bg-error/15 capitalize rounded-sm border-0 text-[9px] font-bold px-1.5 py-0.5"
            >
              {t('summary_stats.pending_approvals_action_required') || 'Action Required'}
            </Badge>
          ) : (
            <span className="text-[10px] text-muted-foreground font-semibold">KYC clean</span>
          )
        }
      />

      <StatsCard
        Icon={PiggyBank}
        label="Total Savings Locked"
        number={formatCurrency(stats.totalSavingsBalance)}
        color="oklch(0.62 0.17 145)"
        href="/admin/savings"
        footer={<span className="text-[10px] text-muted-foreground font-semibold">Active lockups</span>}
      />

      <StatsCard
        Icon={DollarSign}
        label="Active Loans Debt"
        number={formatCurrency(stats.totalLoansOutstanding)}
        color="oklch(0.6 0.18 29)"
        href="/admin/loans"
        footer={<span className="text-[10px] text-muted-foreground font-semibold">Outstanding capital</span>}
      />

      <StatsCard
        Icon={Handshake}
        label="Ajo Group Capital"
        number={formatCurrency(stats.totalAjoBalance)}
        color="oklch(0.55 0.16 200)"
        href="/admin/eajo"
        footer={<span className="text-[10px] text-muted-foreground font-semibold">Cycle deposits</span>}
      />
    </div>
  )
}

export default SummaryStats
