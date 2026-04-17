'use client'

import { MembershipStatus } from '@/generated/prisma/enums'
import { Badge } from '../ui/badge'
import { membershipStatusMap } from '@/data/status'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

const StatusChip = ({ status }: { status: MembershipStatus }) => {
  const { t } = useTranslation('admin-members')
  const { label, bg, text } = membershipStatusMap[status]

  return <Badge className={cn(bg, text)}>{t(label)}</Badge>
}

export default StatusChip
