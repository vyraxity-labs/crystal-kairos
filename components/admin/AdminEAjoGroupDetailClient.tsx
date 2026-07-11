'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Loader2,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { approveEAjoMemberAction, rejectEAjoMemberAction, activateEAjoGroupAction } from '@/models/admin/actions'

type EAjoMemberStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
type EAjoGroupStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'APPROVED' | 'REJECTED'

interface MemberUser {
  id: string
  name: string
  email: string
  userInfo: { phoneNumber: string | null } | null
  membership: { membershipNumber: string | null } | null
}

interface MemberRecord {
  id: string
  userId: string
  groupId: string
  payoutPosition: number
  feePercentage: number
  netPayoutAmount: number
  totalExpectedPayout: number
  guarantorName: string
  guarantorPhoneNumber: string
  bankName: string
  accountNumber: string
  accountName: string
  currentBalance: number
  totalContributed: number
  status: EAjoMemberStatus
  approvedAt: Date | null
  rejectionReason: string | null
  createdAt: Date
  user: MemberUser
}

interface GroupDetail {
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
  createdByUser: { name: string; email: string }
  members: MemberRecord[]
}

interface AdminEAjoGroupDetailClientProps {
  group: GroupDetail
}

const MEMBER_STATUS_STYLES: Record<EAjoMemberStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-blue-50 text-blue-700 border-blue-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  COMPLETED: 'bg-slate-100 text-slate-600 border-slate-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(val)

const formatDuration = (d: string) =>
  d === 'FOUR_MONTHS' ? '4 Months' : d === 'SIX_MONTHS' ? '6 Months' : '12 Months'

export const AdminEAjoGroupDetailClient = ({ group }: AdminEAjoGroupDetailClientProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [activateDialogOpen, setActivateDialogOpen] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)

  // Build a filled slot map for the visual seat grid
  const slotMap = new Map<number, MemberRecord>()
  group.members.forEach((m) => slotMap.set(m.payoutPosition, m))

  const handleApprove = (memberId: string) => {
    setActionError(null)
    startTransition(async () => {
      const result = await approveEAjoMemberAction(memberId)
      if (!result.success) setActionError(result.error ?? 'Failed to approve.')
      else router.refresh()
    })
  }

  const handleReject = () => {
    if (!selectedMemberId || !rejectionReason.trim()) return
    setActionError(null)
    startTransition(async () => {
      const result = await rejectEAjoMemberAction(selectedMemberId, rejectionReason.trim())
      if (!result.success) setActionError(result.error ?? 'Failed to reject.')
      else {
        setRejectDialogOpen(false)
        setRejectionReason('')
        router.refresh()
      }
    })
  }

  const handleActivate = () => {
    setActionError(null)
    startTransition(async () => {
      const result = await activateEAjoGroupAction(group.id)
      if (!result.success) setActionError(result.error ?? 'Failed to activate.')
      else {
        setActivateDialogOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <div className="max-w-5xl mx-auto py-6 flex flex-col gap-6">
      {/* Back */}
      <div className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors w-fit text-xs font-semibold cursor-pointer">
        <ArrowLeft className="w-4 h-4" />
        <Link href="/admin/eajo">Back to Groups</Link>
      </div>

      {/* Group header */}
      <div className="bg-surface-container rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold font-heading text-primary">{group.title}</h2>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${MEMBER_STATUS_STYLES[group.status as EAjoMemberStatus]}`}>
                {group.status}
              </span>
            </div>
            {group.description && (
              <p className="text-sm text-muted-foreground">{group.description}</p>
            )}
            <p className="text-[10px] text-muted-foreground mt-2">
              Created by {group.createdByUser.name} · {new Date(group.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>

          {group.status === 'PENDING' && (
            <Button
              onClick={() => setActivateDialogOpen(true)}
              disabled={isPending}
              className="bg-primary text-on-primary hover:bg-primary/90 h-9 px-5 text-sm font-bold rounded-lg cursor-pointer shrink-0"
            >
              <TrendingUp className="w-4 h-4 mr-1.5" />
              Activate Group
            </Button>
          )}
        </div>

        {/* Group stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-outline-variant/20">
          {[
            { label: 'Contribution', value: formatCurrency(group.contributionAmount), sub: group.frequency.toLowerCase() },
            { label: 'Duration', value: formatDuration(group.duration), sub: `${group.totalSlots} slots` },
            { label: 'Slots Filled', value: `${group.filledSlots}/${group.totalSlots}`, sub: `${Math.round((group.filledSlots / group.totalSlots) * 100)}% full` },
            { label: 'Start Date', value: group.startDate ? new Date(group.startDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) : 'Not set', sub: '' },
          ].map(({ label, value, sub }) => (
            <div key={label}>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
              <p className="text-sm font-bold text-primary font-mono">{value}</p>
              {sub && <p className="text-[10px] text-muted-foreground capitalize">{sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Seat map */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Slot Map</h3>
        <div className={`grid gap-3 ${group.totalSlots <= 4 ? 'grid-cols-4' : group.totalSlots <= 6 ? 'grid-cols-6' : 'grid-cols-6 md:grid-cols-12'}`}>
          {Array.from({ length: group.totalSlots }, (_, i) => i + 1).map((slot) => {
            const member = slotMap.get(slot)
            return (
              <div
                key={slot}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-center p-1 text-[10px] font-bold transition-all
                  ${!member ? 'bg-surface-container border-2 border-dashed border-outline-variant/30 text-muted-foreground'
                  : member.status === 'PENDING' ? 'bg-amber-50 border-2 border-amber-300 text-amber-700'
                  : member.status === 'APPROVED' || member.status === 'ACTIVE' ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-700'
                  : 'bg-red-50 border-2 border-red-200 text-red-600'}`}
              >
                <span className="text-base font-bold">{slot}</span>
                <span className="leading-tight mt-0.5 truncate w-full px-1">
                  {member ? member.user.name.split(' ')[0] : 'Open'}
                </span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-surface-container border-2 border-dashed border-outline-variant/30" />Open</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-50 border-2 border-amber-300" />Pending</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-50 border-2 border-emerald-300" />Approved/Active</span>
        </div>
      </div>

      {/* Members list */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
          Member Applications ({group.members.length})
        </h3>

        {actionError && (
          <div className="flex items-center gap-2 text-sm text-error bg-error/5 border border-error/20 rounded-lg px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {actionError}
          </div>
        )}

        {group.members.length === 0 ? (
          <div className="border border-dashed border-outline-variant/30 rounded-xl py-12 text-center text-xs text-muted-foreground font-medium">
            No members have applied to this group yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {group.members.map((member) => (
              <Card key={member.id} className="bg-surface-container border-0 shadow-none rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 justify-between flex-wrap">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-bold shrink-0">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{member.user.name}</p>
                        <p className="text-[11px] text-muted-foreground">{member.user.email}</p>
                        {member.user.userInfo?.phoneNumber && (
                          <p className="text-[11px] text-muted-foreground">{member.user.userInfo.phoneNumber}</p>
                        )}
                        {member.user.membership?.membershipNumber && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Member No: <span className="font-mono font-semibold">{member.user.membership.membershipNumber}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold text-muted-foreground">Slot {member.payoutPosition}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${MEMBER_STATUS_STYLES[member.status]}`}>
                        {member.status}
                      </span>
                      {member.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(member.id)}
                            disabled={isPending}
                            className="h-7 px-3 text-[11px] font-bold bg-primary text-on-primary hover:bg-primary/90 rounded-md cursor-pointer"
                          >
                            {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedMemberId(member.id)
                              setRejectDialogOpen(true)
                            }}
                            className="h-7 px-3 text-[11px] font-bold border-error text-error hover:bg-error/5 rounded-md cursor-pointer"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Member application details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-outline-variant/15 text-xs">
                    <div>
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Net Payout</span>
                      <span className="font-bold text-primary font-mono">{formatCurrency(member.netPayoutAmount)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Guarantor</span>
                      <span className="font-semibold text-primary">{member.guarantorName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Bank</span>
                      <span className="font-semibold text-primary">{member.bankName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Account</span>
                      <span className="font-semibold text-primary font-mono">{member.accountNumber}</span>
                    </div>
                  </div>

                  {member.rejectionReason && (
                    <p className="mt-2 text-[11px] text-error bg-error/5 rounded px-2 py-1">
                      Rejection reason: {member.rejectionReason}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reject dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this member's application.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px] text-sm"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="cursor-pointer">Cancel</Button>
            <Button
              onClick={handleReject}
              disabled={isPending || !rejectionReason.trim()}
              className="bg-error text-white hover:bg-error/90 cursor-pointer"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reject Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate dialog */}
      <Dialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Activate eAjo Group</DialogTitle>
            <DialogDescription>
              This will set the group to ACTIVE status and all approved members will become active contributors. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivateDialogOpen(false)} className="cursor-pointer">Cancel</Button>
            <Button
              onClick={handleActivate}
              disabled={isPending}
              className="bg-primary text-on-primary hover:bg-primary/90 cursor-pointer"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Activation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
