'use client'

import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { bankInfoSchema } from '@/schema/auth.schema'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { addBankAccountAction, resolveAccountNameAction } from '@/models/members/actions'
import { toast } from 'sonner'
import { Plus, Loader2 } from 'lucide-react'

type BankFormValues = z.infer<typeof bankInfoSchema>

const SUPPORTED_BANKS = [
  'Access Bank',
  'Guaranty Trust Bank (GTBank)',
  'United Bank for Africa (UBA)',
  'Zenith Bank',
  'First Bank of Nigeria',
  'Wema Bank',
  'Sterling Bank',
  'Kuda Bank',
]

interface AddBankAccountDialogProps {
  userId: string
  onSuccess?: () => void
}

export const AddBankAccountDialog = ({ userId, onSuccess }: AddBankAccountDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResolving, setIsResolving] = useState(false)

  const { control, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<BankFormValues>({
    resolver: standardSchemaResolver(bankInfoSchema),
    mode: 'onChange',
    defaultValues: {
      bankName: '',
      accountNumber: '',
      accountName: '',
    },
  })

  const bankNameValue = watch('bankName')
  const accountNumberValue = watch('accountNumber')

  // Trigger NIBSS mock lookup when bankName and accountNumber (10 digits) are entered
  useEffect(() => {
    const resolveName = async () => {
      if (bankNameValue && accountNumberValue && accountNumberValue.length === 10) {
        setIsResolving(true)
        setValue('accountName', '') // Reset previous resolved name

        const result = await resolveAccountNameAction(bankNameValue, accountNumberValue)
        setIsResolving(false)

        if (result.success && result.accountName) {
          setValue('accountName', result.accountName, { shouldValidate: true })
          toast.success(`Account resolved: ${result.accountName}`)
        } else {
          toast.error(result.error || 'Failed to resolve account number. Verify details.')
        }
      }
    }

    resolveName()
  }, [bankNameValue, accountNumberValue, setValue])

  const onSubmit = async (data: BankFormValues) => {
    setIsSubmitting(true)
    const result = await addBankAccountAction(userId, data)
    setIsSubmitting(false)

    if (result.success) {
      toast.success('Bank account added successfully.')
      setOpen(false)
      reset()
      if (onSuccess) onSuccess()
    } else {
      toast.error(result.error || 'Failed to add bank account.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) reset()
    }}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer rounded-sm text-on-primary flex items-center gap-1.5 h-10">
          <Plus className="w-4 h-4" />
          <span>Add Bank Account</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-md">
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg">Add Bank Account</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Nominate a new bank account. The system will automatically resolve the account name via bank lookup network routing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4">
          <Controller
            control={control}
            name="bankName"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="bank-select">Select Bank</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="bank-select" className="rounded-sm h-11">
                    <SelectValue placeholder="Select Bank" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    {SUPPORTED_BANKS.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="accountNumber"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="account-num-input">Account Number</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="account-num-input"
                    maxLength={10}
                    placeholder="10-digit Account Number"
                    className="rounded-sm h-11 font-mono tracking-wider pr-10"
                  />
                  {isResolving && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                    </div>
                  )}
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="accountName"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="account-name-input">Resolved Account Name</FieldLabel>
                <Input
                  {...field}
                  id="account-name-input"
                  readOnly
                  placeholder={isResolving ? 'Resolving name...' : 'Auto-populated on account entry'}
                  className="rounded-sm h-11 bg-surface-container-low border-outline-variant/35 font-semibold text-primary/80 read-only:cursor-not-allowed"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="flex gap-2 justify-end mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-sm h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isResolving || !watch('accountName')}
              className="cursor-pointer rounded-sm text-on-primary h-10 px-5"
            >
              {isSubmitting ? 'Saving...' : 'Add Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
