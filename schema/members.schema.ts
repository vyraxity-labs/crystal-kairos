import z from 'zod'

export const rejectMembershipSchema = z.object({
  reason: z
    .string()
    .min(1, { message: 'Reason is required' })
    .max(255, { message: 'Reason must be less than 255 characters' }),
})

export type RejectMembershipSchema = z.infer<typeof rejectMembershipSchema>
