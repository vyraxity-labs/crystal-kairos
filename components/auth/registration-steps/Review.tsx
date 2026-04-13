'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { RegistrationFormValues } from '@/types/register.interface'
import Link from 'next/link'
import { Control, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Review = ({ control }: { control: Control<RegistrationFormValues> }) => {
  const { t } = useTranslation('auth')

  return (
    <div>
      <FieldGroup className='p-3 bg-surface-container-low'>
        <Controller
          name='termsAndConditions'
          control={control}
          render={({ field, fieldState }) => {
            const isSelected = field.value

            return (
              <Field>
                <FieldGroup>
                  <Field orientation='horizontal' className='flex items-start'>
                    <Checkbox
                      id='terms'
                      name='terms'
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                    <FieldLabel htmlFor='terms'>
                      <p>
                        {t('register.form.review.before_declaration')}{' '}
                        <Link
                          href='/terms-of-service'
                          className='text-primary underline'
                          target='_blank'
                        >
                          {t('register.form.review.terms_and_conditions')}
                        </Link>{' '}
                        {t('register.form.review.after_declaration')}
                      </p>
                    </FieldLabel>
                  </Field>
                </FieldGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
      </FieldGroup>
    </div>
  )
}

export default Review
