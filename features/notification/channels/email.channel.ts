'use server'

import { prisma } from '@/lib/prisma'
import { brevo } from '../providers/email.provider'
import { SendEmailOptions } from '../types'
import {
  NotificationChannel,
  NotificationStatus,
} from '@/generated/prisma/enums'

export const sendEmail = async (options: SendEmailOptions) => {
  const {
    to,
    subject,
    html,
    recipientId,
    type,
    templateId,
    variables,
    triggeredBy,
  } = options

  // 1. Create notification record as PENDING
  const notification = await prisma.notification.create({
    data: {
      type,
      channel: NotificationChannel.EMAIL,
      status: NotificationStatus.PENDING,
      recipientId,
      subject,
      body: html,
      templateId,
      variables,
      triggeredBy,
    },
  })

  try {
    // 2. Send email via Brevo
    const data = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.EMAIL_FROM as string,
        name: process.env.EMAIL_FROM_NAME as string,
      },
      to: Array.isArray(to)
        ? to.map((item) => ({ email: item }))
        : [
            {
              email: to,
            },
          ],
      subject,
      htmlContent: html,
    })

    // 3. Update to SENT with Resend's message ID
    await prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: NotificationStatus.SENT,
        externalId: data.messageId,
        sentAt: new Date(),
      },
    })

    console.log('Email sent successfully', data)
    return { success: true, notificationId: notification.id }
  } catch (error) {
    // 4. Log failure
    await prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: NotificationStatus.FAILED,
        errorMsg: error instanceof Error ? error.message : 'Unknown error',
      },
    })
    console.log('Error sending email', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
