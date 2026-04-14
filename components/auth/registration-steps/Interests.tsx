'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RegistrationFormValues } from '@/types/register.interface'
import { Control, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { assumptionsData, interestsData } from './data'

const Interests = ({
  control,
}: {
  control: Control<RegistrationFormValues>
}) => {
  const { t } = useTranslation('auth')

  return (
    <FieldGroup>
      <FieldGroup>
        <h4 className='font-semibold'>
          {t('register.form.interests.interests')}
        </h4>
        <Controller
          name='interests'
          control={control}
          render={({ field, fieldState }) => {
            const selectedInterests = Array.isArray(field.value)
              ? field.value
              : []
            const toggleInterest = (value: string, checked: boolean) => {
              const nextValues = checked
                ? [...selectedInterests, value]
                : selectedInterests.filter((item) => item !== value)
              field.onChange(nextValues)
            }

            return (
              <Field>
                <FieldLabel className='text-muted-foreground'>
                  {t('register.form.interests.interests_description')}
                </FieldLabel>
                <div className='flex flex-col gap-2 sm:grid sm:grid-cols-2 md:grid-cols-3'>
                  {interestsData.map((interest) => {
                    return (
                      <FieldGroup key={interest.id}>
                        <Field
                          orientation='horizontal'
                          className='flex border border-outline-variant/50 p-3 rounded-md'
                        >
                          <Checkbox
                            id={`interests-${interest.id}`}
                            name={`interests-${interest.id}`}
                            checked={selectedInterests.includes(interest.value)}
                            onCheckedChange={(checked) =>
                              toggleInterest(interest.value, checked === true)
                            }
                          />
                          <FieldLabel htmlFor={`interests-${interest.id}`}>
                            <div className='w-full cursor-pointer'>
                              <p className='text-base'>{t(interest.label)}</p>
                              <span className='text-xs text-muted-foreground'>
                                {t(interest.description)}
                              </span>
                            </div>
                          </FieldLabel>
                        </Field>
                      </FieldGroup>
                    )
                  })}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
      </FieldGroup>

      <h4 className='font-semibold'>{t('register.form.interests.referral')}</h4>
      <FieldGroup className='flex flex-col gap-1 md:flex-row'>
        <Controller
          name='referralName'
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field>
                <FieldLabel>
                  {t('register.form.interests.referral_name')}
                </FieldLabel>
                <Input
                  {...field}
                  className='rounded-sm'
                  placeholder={t('register.form.interests.referral_name')}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
        <Controller
          name='referralPhoneNumber'
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field>
                <FieldLabel>
                  {t('register.form.interests.referral_phone_number')}
                </FieldLabel>
                <Input
                  {...field}
                  className='rounded-sm'
                  placeholder={t(
                    'register.form.interests.referral_phone_number',
                  )}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
      </FieldGroup>

      <div className='p-3 bg-surface-container-low rounded-md'>
        <FieldGroup>
          <h4 className='font-semibold'>
            {t('register.form.interests.assumptions.title')}
          </h4>

          <Controller
            name='assumptions'
            control={control}
            render={({ field, fieldState }) => {
              const selectedAssumptions = Array.isArray(field.value)
                ? field.value
                : []

              const toggleAssumption = (value: string, checked: boolean) => {
                const nextValues = checked
                  ? [...selectedAssumptions, value]
                  : selectedAssumptions.filter((item) => item !== value)
                field.onChange(nextValues)
              }

              return (
                <Field>
                  <FieldLabel className='text-muted-foreground'>
                    {t('register.form.interests.assumptions.description')}
                  </FieldLabel>
                  <div className='flex flex-col gap-2'>
                    {assumptionsData.map((assumption) => {
                      return (
                        <FieldGroup key={assumption.id}>
                          <Field
                            orientation='horizontal'
                            className='flex items-start'
                          >
                            <Checkbox
                              id={`assumption-${assumption.id}`}
                              name={`assumption-${assumption.id}`}
                              checked={selectedAssumptions.includes(
                                assumption.value,
                              )}
                              onCheckedChange={(checked) =>
                                toggleAssumption(
                                  assumption.value,
                                  checked === true,
                                )
                              }
                            />
                            <FieldLabel
                              htmlFor={`assumption-${assumption.id}`}
                              className='cursor-pointer'
                            >
                              {t(assumption.label)}
                            </FieldLabel>
                          </Field>
                        </FieldGroup>
                      )
                    })}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )
            }}
          />
        </FieldGroup>
      </div>
    </FieldGroup>
  )
}

export default Interests
