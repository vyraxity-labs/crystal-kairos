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
import SummaryCard from './SummaryCard'
import { interestsData } from './data'

const Review = ({ control }: { control: Control<RegistrationFormValues> }) => {
  const { t } = useTranslation('auth')
  const { step1, step2, step3, step4 } = useSelector(
    (store: RootState) => store.register,
  )

  const interestsLabels = interestsData
    .filter((interest) => step4.data.interests.includes(interest.value))
    .map((interest) => interest.label)

  return (
    <div className='mt-5'>
      <div className='mb-8 flex flex-col gap-5'>
        <SummaryCard title={t('register.steps_header.personal')} stepNumber={1}>
          <div className='mb-5'>
            <div className='flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3'>
              <ReviewItem
                field={t('register.form.personal_details.full_name')}
                value={step1.data.name}
              />
              <ReviewItem
                field={t('register.form.personal_details.email')}
                value={step1.data.email}
              />
              <ReviewItem
                field={t('register.form.personal_details.phone_number')}
                value={step1.data.phoneNumber}
              />
            </div>
            <div className='flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3'>
              <ReviewItem
                field={t('register.form.personal_details.gender')}
                value={step1.data.gender}
              />
              <ReviewItem
                field={t('register.form.personal_details.date_of_birth')}
                value={format(step1.data.dateOfBirth, 'do MMMM yyyy')}
              />
              <ReviewItem
                field={t('register.form.personal_details.occupation')}
                value={step1.data.occupation}
              />
            </div>
            <div>
              <ReviewItem
                field={t('register.form.personal_details.address')}
                value={step1.data.address}
              />
            </div>
          </div>
        </SummaryCard>

        <SummaryCard title={t('register.steps_header.banking')} stepNumber={2}>
          <div className='mb-5'>
            <div className='flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3'>
              <ReviewItem
                field={t('register.form.banking_details.bank_name')}
                value={step2.data.bankName}
              />
              <ReviewItem
                field={t('register.form.banking_details.account_number')}
                value={step2.data.accountNumber}
              />
              <ReviewItem
                field={t('register.form.banking_details.account_name')}
                value={step2.data.accountName}
              />
            </div>
          </div>
        </SummaryCard>

        <SummaryCard
          title={t('register.steps_header.next_of_kin')}
          stepNumber={3}
        >
          <div className='mb-5'>
            <div className='flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3'>
              <ReviewItem
                field={t('register.form.next_of_kin.full_name')}
                value={step3.data.name}
              />
              <ReviewItem
                field={t('register.form.next_of_kin.relationship')}
                value={step3.data.relationship}
              />
              <ReviewItem
                field={t('register.form.next_of_kin.phone_number')}
                value={step3.data.phoneNumber}
              />
            </div>
            <div className='flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3'>
              <ReviewItem
                field={t('register.form.next_of_kin.bank_name')}
                value={step3.data.bankName}
              />
              <ReviewItem
                field={t('register.form.next_of_kin.account_number')}
                value={step3.data.accountNumber}
              />
              <ReviewItem
                field={t('register.form.next_of_kin.account_name')}
                value={step3.data.accountName}
              />
            </div>
          </div>
        </SummaryCard>

        <SummaryCard
          title={t('register.steps_header.interests')}
          stepNumber={4}
        >
          <div className='mb-5'>
            <ReviewItem
              field={t('register.form.interests.interests')}
              value={interestsLabels}
            />

            <div className='flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3'>
              <ReviewItem
                field={t('register.form.interests.referral_name')}
                value={step4.data.referralName}
              />
              <ReviewItem
                field={t('register.form.interests.referral_phone_number')}
                value={step4.data.referralPhoneNumber}
              />
            </div>
          </div>
        </SummaryCard>
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
