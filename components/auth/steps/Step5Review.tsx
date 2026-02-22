'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, FormControlLabel, Checkbox } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PeopleIcon from '@mui/icons-material/People'
import CategoryIcon from '@mui/icons-material/Category'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import type { RootState } from '@/store'
import { updateForm, prevStep, setStep } from '@/store/registration.store'
import { submitRegistration } from '@/app/(public)/register/actions'
import { MembershipInterest } from '@/types/registration.enums'

const INTEREST_LABELS: Record<MembershipInterest, string> = {
  [MembershipInterest.AJO]: 'E-Ajo (Thrift)',
  [MembershipInterest.SAVINGS]: 'Regular Savings',
  [MembershipInterest.LOAN]: 'Short-term Loans',
}

const ReviewSection = ({
  icon: Icon,
  title,
  editLabel,
  onEdit,
  children,
}: {
  icon: React.ElementType
  title: string
  editLabel: string
  onEdit: () => void
  children: React.ReactNode
}) => (
  <div
    className='p-4 rounded-lg mb-4'
    style={{
      backgroundColor: 'var(--color-bg-main)',
      border: '1px solid var(--color-border)',
    }}
  >
    <div className='flex justify-between items-start mb-3'>
      <div className='flex items-center gap-2'>
        <Icon sx={{ color: 'var(--color-primary)' }} />
        <h3
          className='font-bold'
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title}
        </h3>
      </div>
      <Button
        size='small'
        startIcon={<EditIcon />}
        onClick={onEdit}
        sx={{ color: 'var(--color-primary)' }}
      >
        {editLabel}
      </Button>
    </div>
    {children}
  </div>
)

const ReviewField = ({ label, value }: { label: string; value: string }) => (
  <div className='mb-2'>
    <p
      className='text-xs uppercase'
      style={{ color: 'var(--color-text-muted)' }}
    >
      {label}
    </p>
    <p
      className='text-sm font-medium'
      style={{ color: 'var(--color-text-primary)' }}
    >
      {value || '—'}
    </p>
  </div>
)

const Step5Review = () => {
  const { t } = useTranslation('auth')
  const router = useRouter()
  const dispatch = useDispatch()
  const formData = useSelector((s: RootState) => s.registration.formData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!formData.declarationAccepted) return
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await submitRegistration(formData)
      if (result.success) {
        router.push('/register/success')
      } else {
        setError(result.error ?? 'Submission failed')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className='rounded-xl p-6 md:p-8'
      style={{
        backgroundColor: 'var(--color-bg-paper)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <ReviewSection
        icon={PersonIcon}
        title={t('review.personal_section')}
        editLabel={t('register.buttons.edit')}
        onEdit={() => dispatch(setStep(0))}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <ReviewField
            label={t('review.labels.full_name')}
            value={formData.fullName}
          />
          <ReviewField
            label={t('review.labels.email')}
            value={formData.email}
          />
          <ReviewField
            label={t('review.labels.phone')}
            value={formData.phoneNumber}
          />
          <ReviewField
            label={t('review.labels.gender')}
            value={formData.gender}
          />
          <ReviewField
            label={t('review.labels.date_of_birth')}
            value={formData.dateOfBirth}
          />
          <ReviewField
            label={t('review.labels.occupation')}
            value={formData.occupation}
          />
          <ReviewField
            label={t('review.labels.address')}
            value={formData.address}
          />
        </div>
      </ReviewSection>

      <ReviewSection
        icon={AccountBalanceIcon}
        title={t('review.bank_section')}
        editLabel={t('register.buttons.edit')}
        onEdit={() => dispatch(setStep(1))}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <ReviewField
            label={t('review.labels.bank_name')}
            value={formData.bankName}
          />
          <ReviewField
            label={t('review.labels.account_number')}
            value={formData.accountNumber}
          />
          <ReviewField
            label={t('review.labels.account_name')}
            value={formData.accountName}
          />
        </div>
      </ReviewSection>

      <ReviewSection
        icon={PeopleIcon}
        title={t('review.kin_section')}
        editLabel={t('register.buttons.edit')}
        onEdit={() => dispatch(setStep(2))}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <ReviewField
            label={t('review.labels.kin_full_name')}
            value={formData.kinFullName}
          />
          <ReviewField
            label={t('review.labels.relationship')}
            value={
              formData.kinRelationship
                ? t(
                    `next_of_kin.relationship_options.${formData.kinRelationship}`,
                  )
                : ''
            }
          />
          <ReviewField
            label={t('review.labels.kin_phone')}
            value={formData.kinPhoneNumber}
          />
        </div>
      </ReviewSection>

      <ReviewSection
        icon={CategoryIcon}
        title={t('review.interests_section')}
        editLabel={t('register.buttons.edit')}
        onEdit={() => dispatch(setStep(3))}
      >
        <div className='flex flex-wrap gap-2 mb-2'>
          {formData.interests.map((i) => (
            <span
              key={i}
              className='px-3 py-1 rounded-full text-sm'
              style={{
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
              }}
            >
              {INTEREST_LABELS[i]}
            </span>
          ))}
        </div>
        <ReviewField
          label={t('review.labels.how_heard')}
          value={
            formData.referrerName ? `Referred by ${formData.referrerName}` : '—'
          }
        />
      </ReviewSection>

      <div
        className='p-4 rounded-lg mb-6'
        style={{
          backgroundColor: 'var(--color-bg-main)',
          border: '1px solid var(--color-border)',
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.declarationAccepted}
              onChange={(e) =>
                dispatch(updateForm({ declarationAccepted: e.target.checked }))
              }
              sx={{ color: 'var(--color-primary)' }}
            />
          }
          label={t('review.declaration')}
        />
      </div>

      {error && <p className='text-red-600 text-sm mb-4'>{error}</p>}

      <div className='flex flex-wrap justify-between gap-4'>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => dispatch(prevStep())}
        >
          {t('review.back_to_interests')}
        </Button>
        <div className='flex gap-2'>
          <Button variant='outlined'>{t('register.buttons.save_draft')}</Button>
          <Button
            variant='contained'
            endIcon={<SendIcon />}
            disabled={!formData.declarationAccepted || isSubmitting}
            onClick={handleSubmit}
          >
            {t('register.buttons.submit')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Step5Review
