import { MembershipStatus } from '@/generated/prisma/enums'
import { MembershipStatusFormatData } from '@/types/members.interface'

export const membershipStatusMap: Record<
  MembershipStatus,
  MembershipStatusFormatData
> = {
  [MembershipStatus.PENDING]: {
    label: 'table.status.pending',
    value: MembershipStatus.PENDING,
    bg: 'bg-yellow-500/15',
    text: 'text-yellow-500',
  },
  [MembershipStatus.APPROVED]: {
    label: 'table.status.approved',
    value: MembershipStatus.APPROVED,
    bg: 'bg-green-500/15',
    text: 'text-green-500',
  },
  [MembershipStatus.REJECTED]: {
    label: 'table.status.rejected',
    value: MembershipStatus.REJECTED,
    bg: 'bg-red-500/15',
    text: 'text-red-500',
  },
  [MembershipStatus.EXPIRED]: {
    label: 'table.status.expired',
    value: MembershipStatus.EXPIRED,
    bg: 'bg-gray-500/15',
    text: 'text-gray-500',
  },
}
