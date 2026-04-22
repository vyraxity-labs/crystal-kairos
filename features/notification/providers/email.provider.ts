import { BrevoClient } from '@getbrevo/brevo'
import { getRequiredEnv } from '@/lib/env'

export const brevo = new BrevoClient({
  apiKey: getRequiredEnv('BREVO_API_KEY'),
})
