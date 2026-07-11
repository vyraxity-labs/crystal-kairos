'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Users,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type EAjoGroupStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'APPROVED' | 'REJECTED'

interface EAjoGroupItem {
  id: string
  title: string
  description: string | null
  contributionAmount: number
  frequency: string
  duration: string
  totalSlots: number
  filledSlots: number
  status: EAjoGroupStatus
  startDate: Date | null
  createdAt: Date
  createdByUser: { name: string }
  _count: { members: number }
}

interface AdminEAjoClientProps {
  groups: EAjoGroupItem[]
}

const STATUS_STYLES: Record<EAjoGroupStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  APPROVED: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-slate-100 text-slate-600 border-slate-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
}

const STATUS_ICONS: Record<EAjoGroupStatus, React.ElementType> = {
  PENDING: Clock,
  ACTIVE: TrendingUp,
  APPROVED: CheckCircle2,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
  REJECTED: XCircle,
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(val)

const formatDuration = (d: string) =>
  d === 'FOUR_MONTHS' ? '4 Months' : d === 'SIX_MONTHS' ? '6 Months' : '12 Months'

export const AdminEAjoClient = ({ groups }: AdminEAjoClientProps) => {
  const totalActive = groups.filter((g) => g.status === 'ACTIVE').length
  const totalPending = groups.filter((g) => g.status === 'PENDING').length

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-primary leading-tight">eAjo Group Management</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage rotating savings group pools for members.
          </p>
        </div>
        <Button asChild className="bg-primary text-on-primary hover:bg-primary/90 h-9 px-5 text-sm font-bold rounded-lg flex items-center gap-2 cursor-pointer self-start md:self-auto">
          <Link href="/admin/eajo/new">
            <Plus className="w-4 h-4" />
            Create New Group
          </Link>
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Groups', value: groups.length, icon: Users },
          { label: 'Active', value: totalActive, icon: TrendingUp },
          { label: 'Accepting Applications', value: totalPending, icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="bg-surface-container shadow-none border-0 rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-primary font-mono">{value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Groups list */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest">All Groups</h3>

        {groups.length === 0 ? (
          <div className="border border-dashed border-outline-variant/30 rounded-xl py-20 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-7 h-7" />
            </div>
            <p className="text-sm text-muted-foreground font-medium text-center max-w-xs">
              No eAjo groups created yet. Create the first group to allow members to apply.
            </p>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/5 text-xs font-bold h-9 px-5 rounded-lg cursor-pointer">
              <Link href="/admin/eajo/new">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Create First Group
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => {
              const StatusIcon = STATUS_ICONS[group.status]
              const fillPct = group.totalSlots > 0 ? (group.filledSlots / group.totalSlots) * 100 : 0
              return (
                <Card
                  key={group.id}
                  className="bg-surface-container border-0 shadow-none rounded-xl hover:ring-1 hover:ring-primary/20 transition-all"
                >
                  <CardContent className="p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-primary text-sm truncate">{group.title}</h4>
                        {group.description && (
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{group.description}</p>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${STATUS_STYLES[group.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {group.status}
                      </span>
                    </div>

                    {/* Key metrics row */}
                    <div className="grid grid-cols-3 gap-2 text-xs py-2 border-y border-outline-variant/15">
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Contribution</span>
                        <span className="font-bold text-primary font-mono text-[11px]">{formatCurrency(group.contributionAmount)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Frequency</span>
                        <span className="font-semibold text-primary capitalize text-[11px]">{group.frequency.toLowerCase()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Duration</span>
                        <span className="font-semibold text-primary text-[11px]">{formatDuration(group.duration)}</span>
                      </div>
                    </div>

                    {/* Slot fill indicator */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                        <span>Slots filled: {group.filledSlots} / {group.totalSlots}</span>
                        <span>{fillPct.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-outline-variant/25 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {group.startDate
                            ? `Starts ${new Date(group.startDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}`
                            : 'No start date set'}
                        </span>
                      </div>
                      <Button asChild variant="ghost" className="text-primary hover:bg-primary/5 h-7 px-3 text-[11px] font-bold rounded-md cursor-pointer">
                        <Link href={`/admin/eajo/${group.id}`}>
                          View Details <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
