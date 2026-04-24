'use server'

import { prisma } from '@/lib/prisma'
import { getRequiredEnv } from '@/lib/env'
import { render } from 'react-email'
import { MemberRegisteredEmail } from '../templates/system/member-registered'
import { format } from 'date-fns'
import { sendEmail } from '../channels/email.channel'
import { NotificationEventType, UserRole } from '@/generated/prisma/enums'
import MemberRegisteredAdminEmail from '../templates/system/member-registered-admin'
import MembershipRejectedEmail from '../templates/system/membership-rejected'
import MembershipApprovedEmail from '../templates/system/membership-approved'

export const onMemberRegistered = async (userId: string) => {
  const appUrl = getRequiredEnv('NEXT_PUBLIC_APP_URL')
  const adminEmail = getRequiredEnv('ADMIN_EMAIL')

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
  if (!user) return

  // 1. Email to the new member
  const memberHtml = await render(
    MemberRegisteredEmail({
      memberName: user.name,
      applicationDate: format(new Date(), 'MMMM d, yyyy'),
      appUrl,
    }),
  )

  await sendEmail({
    to: user.email,
    subject: 'Your Application Has Been Received – Crystal Kairos',
    html: memberHtml,
    type: NotificationEventType.MEMBER_REGISTERED,
    recipientId: user.id,
  })

  // 2. Email to the admin
  const adminHtml = await render(
    MemberRegisteredAdminEmail({
      name: user.name,
      email: user.email,
      url: `${appUrl}/admin/members`,
    }),
  )

  const owner = await prisma.user.findFirst({
    where: {
      role: UserRole.OWNER,
    },
  })

  await sendEmail({
    to: adminEmail,
    subject: 'New Member Registered - Crystal Kairos',
    html: adminHtml,
    type: NotificationEventType.MEMBER_REGISTERED,
    recipientId: owner?.id || user.id,
  })
}

export const onMembershipRejected = async (userId: string, reason: string) => {
  const appUrl = getRequiredEnv('NEXT_PUBLIC_APP_URL')

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
  if (!user) return

  const html = await render(
    MembershipRejectedEmail({
      reason,
      supportUrl: `${appUrl}/support`,
      reviewUrl: `${appUrl}/membership/review`,
    }),
  )

  await sendEmail({
    to: user.email,
    subject: 'Your Application Has Been Rejected – Crystal Kairos',
    html,
    type: NotificationEventType.MEMBERSHIP_REJECTED,
    recipientId: user.id,
  })
}

export const onMembershipApproved = async (
  userId: string,
  membershipNumber: string,
  tier: string,
  token: string,
) => {
  const appUrl = getRequiredEnv('NEXT_PUBLIC_APP_URL')

  const passwordUrl = `${appUrl}/set-password?token=${token}`

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
  if (!user) return

  const html = await render(
    MembershipApprovedEmail({
      setPasswordUrl: passwordUrl,
      name: user.name,
      email: user.email,
      membershipNumber,
      tier,
    }),
  )

  await sendEmail({
    to: user.email,
    subject: 'Your Application Has Been Approved – Crystal Kairos',
    html,
    type: NotificationEventType.MEMBERSHIP_APPROVED,
    recipientId: user.id,
  })
}
