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
import { approveMember } from '@/models/members/query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const ApproveMemberDialog = ({
  userId,
  name,
}: {
  userId: string
  name: string
}) => {
  const { t } = useTranslation('admin-members')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const approve = () => {
    toast.promise(
      async () => {
        setLoading(true)
        const response = await approveMember(userId)
        setLoading(false)
        setOpen(false)
        return response.success
      },
      {
        loading: t('details.dialogs.toasts.approve_loading'),
        success: t('details.dialogs.toasts.approve_success'),
        error: t('details.dialogs.toasts.approve_error'),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='rounded-sm bg-success/25 text-success hover:bg-success/35'>
          {t('details.dialogs.approve.title')}
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-md' showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t('details.dialogs.approve.title')}</DialogTitle>
          <DialogDescription>
            {t('details.dialogs.approve.description', { name })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className='flex justify-end gap-1'>
            <DialogClose asChild>
              <Button
                variant='destructive'
                className='rounded-sm'
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button className='rounded-sm' onClick={approve} disabled={loading}>
              Approve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ApproveMemberDialog
