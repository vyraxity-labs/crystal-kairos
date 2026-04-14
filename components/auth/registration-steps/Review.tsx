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
import ReviewItem from './ReviewItem'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { format } from 'date-fns'
import { Separator } from '@/components/ui/separator'

const Review = ({ control }: { control: Control<RegistrationFormValues> }) => {
  const { t } = useTranslation('auth')
  const { step1, step2, step3, step4 } = useSelector(
    (store: RootState) => store.register,
  )

  return (
    <div>
      <div className='mb-8'>
        <div className='mb-5'>
          <h4>Personal Information</h4>
          <div className='flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3'>
            <ReviewItem field='Full Name' value={step1.data.name} />
            <ReviewItem field='Email Address' value={step1.data.email} />
            <ReviewItem field='Phone Number' value={step1.data.phoneNumber} />
          </div>
          <div className='flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3'>
            <ReviewItem field='Gender' value={step1.data.gender} />
            <ReviewItem
              field='Date of Birth'
              value={format(step1.data.dateOfBirth, 'do MMMM yyyy')}
            />
            <ReviewItem field='Occupation' value={step1.data.occupation} />
          </div>
          <div>
            <ReviewItem field='Address' value={step1.data.address} />
          </div>
        </div>

        <Separator className='bg-outline-variant/30' />

        <div className='mb-5 mt-5'>
          <h4>Bank Details</h4>

          <div className='flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3'>
            <ReviewItem field='Bank Name' value={step2.data.bankName} />
            <ReviewItem
              field='Account Number'
              value={step2.data.accountNumber}
            />
            <ReviewItem field='Account Name' value={step2.data.accountName} />
          </div>
        </div>

        <Separator className='bg-outline-variant/30' />

        <div className='mb-5 mt-5'>
          <h4>Next of Kin</h4>

          <div className='flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3'>
            <ReviewItem field='Full Name' value={step3.data.name} />
            <ReviewItem field='Email Address' value={step3.data.relationship} />
            <ReviewItem field='Phone Number' value={step3.data.phoneNumber} />
          </div>
          <div className='flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3'>
            <ReviewItem field='Bank Name' value={step3.data.bankName} />
            <ReviewItem
              field='Account Number'
              value={step3.data.accountNumber}
            />
            <ReviewItem field='Account Name' value={step3.data.accountName} />
          </div>
        </div>

        <Separator className='bg-outline-variant/30' />

        <div className='mb-5 mt-5'>
          <h4>Membership Interests</h4>

          <ReviewItem field='' value={step4.data.interests} />
        </div>
      </div>

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
