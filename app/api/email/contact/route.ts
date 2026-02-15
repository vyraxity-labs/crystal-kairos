import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1).optional(),
  message: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Admin email not configured' },
        { status: 500 }
      )
    }

    const { name, email, subject, message } = parsed.data

    const html = `
      <h2>Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Subject:</strong> ${subject || '(No subject)'}</p>
      <hr />
      <p>${message.replace(/\n/g, '<br />')}</p>
    `

    const text = `
Contact Form Submission
From: ${name} <${email}>
Subject: ${subject || '(No subject)'}

${message}
    `

    await sendEmail({
      to: adminEmail,
      subject: subject || `Contact from ${name}`,
      text,
      html,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact email error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to send message',
      },
      { status: 500 }
    )
  }
}
