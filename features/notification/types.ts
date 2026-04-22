import { NotificationEventType } from '@/generated/prisma/enums'

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  recipientId: string
  type: NotificationEventType
  templateId?: string
  variables?: Record<string, string>
  triggeredBy?: string
}

export interface TemplateVariables {
  [key: string]: string
}
