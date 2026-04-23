'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  rejectMembershipSchema,
  RejectMembershipSchema,
} from '@/schema/members.schema'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { rejectMember } from '@/models/members/query'

const RejectMembershipDialog = ({
  userId,
  name,
  adminId,
}: {
  userId: string
  name: string
  adminId: string
}) => {
  const { t } = useTranslation('admin-members')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const { control, watch, handleSubmit, setValue } =
    useForm<RejectMembershipSchema>({
      resolver: standardSchemaResolver(rejectMembershipSchema),
      mode: 'onSubmit',
      defaultValues: { reason: '' },
    })

  const reasonText = watch('reason')

  const onSubmit = async (formData: RejectMembershipSchema) => {
    toast.promise(
      async () => {
        try {
          setLoading(true)
          const response = await rejectMember(userId, adminId, formData.reason)
          if (!response.success) throw new Error('Rejection failed failed')
          if (response.success) {
            setOpen(false)
            router.refresh()
          }
          return response.success
        } finally {
          setLoading(false)
        }
      },
      {
        loading: t('details.dialogs.toasts.reject_loading'),
        success: t('details.dialogs.toasts.reject_success'),
        error: t('details.dialogs.toasts.reject_error'),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive' className='rounded-sm'>
          {t('details.dialogs.reject.title')}
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-md' showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t('details.dialogs.reject.title')}</DialogTitle>
          <DialogDescription>
            {t('details.dialogs.reject.description', { name })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name='reason'
            render={({ field, fieldState }) => {
              return (
                <Field className='mb-5'>
                  <FieldLabel htmlFor='textarea-message'>
                    {t('details.dialogs.reject.label')}
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id='textarea-message'
                    placeholder={t('details.dialogs.reject.placeholder')}
                    className='rounded-sm placeholder:text-xs text-sm'
                    rows={3}
                  />
                  <FieldDescription className='text-end'>
                    {reasonText.length}/255
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )
            }}
          />
          <DialogFooter>
            <div className='flex justify-end gap-1'>
              <DialogClose asChild>
                <Button
                  variant='outline'
                  className='rounded-sm'
                  disabled={loading}
                  onClick={() => setValue('reason', '')}
                >
                  {t('details.dialogs.reject.cancel')}
                </Button>
              </DialogClose>
              <Button
                className='rounded-sm bg-error text-on-error hover:bg-error/80'
                disabled={loading}
              >
                {t('details.dialogs.reject.reject')}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RejectMembershipDialog
