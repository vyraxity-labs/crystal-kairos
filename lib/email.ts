import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
})

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
  attachments?: Array<{
    filename: string
    content?: string | Buffer
  }>
}

export async function sendEmail(options: SendEmailOptions) {
  const recipients = Array.isArray(options.to) ? options.to : [options.to]
  const from = options.from || process.env.SMTP_FROM || process.env.SMTP_USER

  const mailOptions = {
    from,
    to: recipients.join(', '),
    subject: options.subject,
    ...(options.text && { text: options.text }),
    ...(options.html && { html: options.html }),
    ...(options.replyTo && { replyTo: options.replyTo }),
    ...(options.cc && {
      cc: Array.isArray(options.cc) ? options.cc.join(', ') : options.cc,
    }),
    ...(options.bcc && {
      bcc: Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc,
    }),
    ...(options.attachments && { attachments: options.attachments }),
  }

  const result = await transporter.sendMail(mailOptions)
  return result
}
