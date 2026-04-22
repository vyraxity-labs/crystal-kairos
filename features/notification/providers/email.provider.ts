import { Resend } from 'resend'
import { BrevoClient } from '@getbrevo/brevo'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY as string,
})
