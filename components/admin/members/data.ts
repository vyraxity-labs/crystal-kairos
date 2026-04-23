import { MembershipTier } from '@/generated/prisma/enums'
import { ChessQueen, CircleStar, UserIcon } from 'lucide-react'

export const breadcrumbData = [
  {
    label: 'details.header.breadcrumbs.dashboard',
    href: '/admin',
  },
  {
    label: 'details.header.breadcrumbs.members',
    href: '/admin/members',
  },
  {
    label: 'details.header.breadcrumbs.details',
  },
]

export const membershipTierData = {
  [MembershipTier.MEMBER]: {
    label: 'details.tier_info.member',
    textColor: 'text-primary',
    bgColor: 'bg-primary/10',
    icon: UserIcon,
    description: 'details.tier_info.member_description',
  },
  [MembershipTier.SILVER_MEMBER]: {
    label: 'details.tier_info.silver_member',
    textColor: 'text-secondary',
    bgColor: 'bg-secondary/10',
    icon: CircleStar,
    description: 'details.tier_info.silver_member_description',
  },
  [MembershipTier.GOLD_MEMBER]: {
    label: 'details.tier_info.gold_member',
    textColor: 'text-tertiary',
    bgColor: 'bg-tertiary/10',
    icon: ChessQueen,
    description: 'details.tier_info.gold_member_description',
  },
}
