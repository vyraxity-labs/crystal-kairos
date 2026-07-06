'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { nextOfKinSchema } from '@/schema/auth.schema'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Relationship } from '@/generated/prisma/enums'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Textarea } from '../ui/textarea'
import { updateNextOfKinAction } from '@/models/members/actions'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'

type NextOfKinFormValues = z.infer<typeof nextOfKinSchema>

interface EditNextOfKinDialogProps {
  userId: string
  defaultValues?: Partial<NextOfKinFormValues> | null
  onSuccess?: () => void
}

export const EditNextOfKinDialog = ({
  userId,
  defaultValues,
  onSuccess,
}: EditNextOfKinDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, handleSubmit, reset } = useForm<NextOfKinFormValues>({
    resolver: standardSchemaResolver(nextOfKinSchema),
    mode: 'onChange',
    defaultValues: {
      name: defaultValues?.name || '',
      phoneNumber: defaultValues?.phoneNumber || '',
      relationship: defaultValues?.relationship || Relationship.SPOUSE,
      occupation: defaultValues?.occupation || '',
      address: defaultValues?.address || '',
      bankName: defaultValues?.bankName || '',
      accountNumber: defaultValues?.accountNumber || '',
      accountName: defaultValues?.accountName || '',
    },
  })

  const onSubmit = async (data: NextOfKinFormValues) => {
    setIsSubmitting(true)
    const result = await updateNextOfKinAction(userId, data)
    setIsSubmitting(false)

    if (result.success) {
      toast.success('Next of Kin details updated successfully.')
      setOpen(false)
      if (onSuccess) onSuccess()
    } else {
      toast.error(result.error || 'Failed to update details.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='cursor-pointer flex items-center gap-1.5'
        >
          <Pencil className='w-3.5 h-3.5' />
          <span>Edit Next of Kin</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto rounded-md'>
        <DialogHeader>
          <DialogTitle className='font-semibold text-lg'>
            Update Next of Kin
          </DialogTitle>
          <DialogDescription className='text-muted-foreground text-sm'>
            Enter the contact details and payout routing options for your
            cooperative next of kin.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-4 py-4'
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Controller
              control={control}
              name='name'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor='nok-name'>Full Name</FieldLabel>
                  <Input
                    {...field}
                    id='nok-name'
                    placeholder='e.g. Mary Doe'
                    className='rounded-sm'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name='phoneNumber'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor='nok-phone'>Phone Number</FieldLabel>
                  <Input
                    {...field}
                    id='nok-phone'
                    placeholder='e.g. +2348000000000'
                    className='rounded-sm'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name='relationship'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor='nok-relationship'>
                    Relationship
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id='nok-relationship' className='rounded-sm'>
                      <SelectValue placeholder='Select relationship' />
                    </SelectTrigger>
                    <SelectContent className='rounded-sm'>
                      {Object.values(Relationship).map((rel) => (
                        <SelectItem
                          key={rel}
                          value={rel}
                          className='capitalize'
                        >
                          {rel.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name='occupation'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor='nok-occupation'>Occupation</FieldLabel>
                  <Input
                    {...field}
                    id='nok-occupation'
                    placeholder='e.g. Business Owner'
                    className='rounded-sm'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            control={control}
            name='address'
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor='nok-address'>
                  Residential Address
                </FieldLabel>
                <Textarea
                  {...field}
                  id='nok-address'
                  placeholder='Residential Address'
                  className='rounded-sm min-h-[60px]'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className='border-t border-outline-variant/30 pt-4 flex flex-col gap-3'>
            <h4 className='font-semibold text-sm'>
              Nominated Bank Payout Details
            </h4>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Controller
                control={control}
                name='bankName'
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor='nok-bank'>Bank Name</FieldLabel>
                    <Input
                      {...field}
                      id='nok-bank'
                      placeholder='e.g. Access Bank'
                      className='rounded-sm'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name='accountNumber'
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor='nok-account-num'>
                      Account Number
                    </FieldLabel>
                    <Input
                      {...field}
                      id='nok-account-num'
                      placeholder='10-digit number'
                      className='rounded-sm font-mono'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={control}
              name='accountName'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor='nok-account-name'>
                    Account Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id='nok-account-name'
                    placeholder='e.g. Mary Doe'
                    className='rounded-sm'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className='flex gap-2 justify-end mt-4'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => setOpen(false)}
              className='cursor-pointer rounded-sm h-10'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='cursor-pointer rounded-sm text-on-primary h-10'
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
