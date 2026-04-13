'use client'

import { Calendar } from '@/components/ui/calendar'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RegistrationFormValues } from '@/types/register.interface'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { Control, Controller, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

function dateOfBirthToDate(value: unknown): Date | undefined {
  if (value == null || value === '') return undefined
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? undefined : value
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? undefined : d
  }
  return undefined
}

const PersonalInfo = ({
  control,
  onDateSelected,
}: {
  control: Control<RegistrationFormValues, any, RegistrationFormValues>
  onDateSelected: UseFormSetValue<RegistrationFormValues>
}) => {
  const { t } = useTranslation('auth')
  const [calendarIsOpen, setCalendarIsOpen] = useState(false)

  return (
    <FieldGroup>
      <FieldGroup className='flex flex-col gap-1 md:flex-row'>
        <Controller
          name='name'
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field>
                <FieldLabel>
                  {t('register.form.personal_details.full_name')}
                </FieldLabel>
                <Input
                  {...field}
                  className='rounded-sm'
                  placeholder={t('register.form.personal_details.full_name')}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
        <Controller
          name='email'
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field>
                <FieldLabel>
                  {t('register.form.personal_details.email')}
                </FieldLabel>
                <Input
                  {...field}
                  className='rounded-sm'
                  placeholder={t('register.form.personal_details.email')}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
      </FieldGroup>

      <FieldGroup className='flex flex-col gap-1 md:flex-row'>
        <Controller
          name='phoneNumber'
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field>
                <FieldLabel>
                  {t('register.form.personal_details.phone_number')}
                </FieldLabel>
                <Input
                  {...field}
                  className='rounded-sm'
                  placeholder={t('register.form.personal_details.phone_number')}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
        <Controller
          name='gender'
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field>
                <FieldLabel>
                  {t('register.form.personal_details.gender')}
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className='rounded-sm'>
                    <SelectValue
                      placeholder={t('register.form.personal_details.gender')}
                    />
                  </SelectTrigger>
                  <SelectContent position='popper' className='rounded-md'>
                    <SelectItem value='male'>
                      {t('register.form.personal_details.gender_male')}
                    </SelectItem>
                    <SelectItem value='female'>
                      {t('register.form.personal_details.gender_female')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
      </FieldGroup>

      <FieldGroup className='flex flex-col gap-1 md:flex-row'>
        <Controller
          name='address'
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field>
                <FieldLabel>
                  {t('register.form.personal_details.address')}
                </FieldLabel>
                <Textarea
                  {...field}
                  className='rounded-sm'
                  placeholder={t('register.form.personal_details.address')}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
      </FieldGroup>

      <FieldGroup className='flex flex-col gap-1 md:flex-row'>
        <Controller
          name='dateOfBirth'
          control={control}
          render={({ field, fieldState }) => {
            const dob = dateOfBirthToDate(field.value)
            return (
              <Field>
                <FieldLabel>
                  {t('register.form.personal_details.date_of_birth')}
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    className='rounded-sm'
                    placeholder={t(
                      'register.form.personal_details.date_of_birth',
                    )}
                    value={dob ? dob.toDateString() : ''}
                  />
                  <InputGroupAddon align='inline-end'>
                    <Popover
                      open={calendarIsOpen}
                      onOpenChange={setCalendarIsOpen}
                    >
                      <PopoverTrigger asChild>
                        <InputGroupButton>
                          <CalendarIcon />
                        </InputGroupButton>
                      </PopoverTrigger>

                      <PopoverContent className='rounded-md'>
                        <Calendar
                          mode='single'
                          selected={dob}
                          defaultMonth={dob}
                          captionLayout='dropdown'
                          onSelect={(date) => {
                            onDateSelected('dateOfBirth', date as Date)
                            setCalendarIsOpen(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
        <Controller
          name='occupation'
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field>
                <FieldLabel>
                  {t('register.form.personal_details.occupation')}
                </FieldLabel>
                <Input
                  {...field}
                  className='rounded-sm'
                  placeholder={t('register.form.personal_details.occupation')}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
      </FieldGroup>
    </FieldGroup>
  )
}

export default PersonalInfo
