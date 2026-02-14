'use client'

import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button, FormControlLabel, Checkbox } from '@mui/material'
import InterestsIcon from '@mui/icons-material/Interests'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ChecklistIcon from '@mui/icons-material/Checklist'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import type { RootState } from '@/store'
import { updateForm, nextStep, prevStep } from '@/store/registration.store'
import {
  MembershipInterest,
  Assumptions,
} from '@/generated/prisma/client'

const INTEREST_OPTIONS: { value: MembershipInterest; labelKey: string; subKey: string }[] = [
  { value: MembershipInterest.AJO, labelKey: 'eajo', subKey: 'eajo_sub' },
  { value: MembershipInterest.SAVINGS, labelKey: 'savings', subKey: 'savings_sub' },
  { value: MembershipInterest.LOAN, labelKey: 'loans', subKey: 'loans_sub' },
]

const ASSUMPTION_OPTIONS: { values: Assumptions[]; labelKey: string }[] = [
  { values: [Assumptions.HAS_INTEGRITY], labelKey: 'assumption_1' },
  {
    values: [Assumptions.HAS_SMART_PHONE, Assumptions.HAS_INTERNET_ACCESS],
    labelKey: 'assumption_2',
  },
  { values: [Assumptions.IS_TRUSTWORTHY], labelKey: 'assumption_3' },
  { values: [Assumptions.HAS_EMAIL], labelKey: 'assumption_4' },
]

const Step4Interests = () => {
  const { t } = useTranslation('auth')
  const dispatch = useDispatch()
  const formData = useSelector((s: RootState) => s.registration.formData)

  const toggleInterest = (interest: MembershipInterest) => {
    const exists = formData.interests.includes(interest)
    const next = exists
      ? formData.interests.filter((i) => i !== interest)
      : [...formData.interests, interest]
    dispatch(updateForm({ interests: next }))
  }

  const toggleAssumption = (values: Assumptions[]) => {
    const allChecked = values.every((v) => formData.assumptions.includes(v))
    const next = allChecked
      ? formData.assumptions.filter((a) => !values.includes(a))
      : [...new Set([...formData.assumptions, ...values])]
    dispatch(updateForm({ assumptions: next }))
  }

  const isAssumptionChecked = (values: Assumptions[]) =>
    values.every((v) => formData.assumptions.includes(v))

  return (
    <div
      className='rounded-xl p-6 md:p-8'
      style={{
        backgroundColor: 'var(--color-bg-paper)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className='flex items-center gap-2 mb-6'>
        <InterestsIcon sx={{ color: 'var(--color-primary)' }} />
        <h2 className='text-xl font-bold' style={{ color: 'var(--color-text-primary)' }}>
          {t('interests.heading')}
        </h2>
      </div>

      <div className='mb-8'>
        <div className='flex items-center gap-2 mb-2'>
          <AttachMoneyIcon sx={{ color: 'var(--color-accent)' }} />
          <h3 className='font-semibold' style={{ color: 'var(--color-text-primary)' }}>
            {t('interests.membership_heading')}
          </h3>
        </div>
        <p className='text-sm mb-4' style={{ color: 'var(--color-text-secondary)' }}>
          {t('interests.membership_desc')}
        </p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {INTEREST_OPTIONS.map(({ value, labelKey, subKey }) => (
            <div
              key={value}
              role='button'
              tabIndex={0}
              onClick={() => toggleInterest(value)}
              onKeyDown={(e) => e.key === 'Enter' && toggleInterest(value)}
              className='p-4 rounded-lg border-2 cursor-pointer transition-colors'
              style={{
                borderColor: formData.interests.includes(value)
                  ? 'var(--color-primary)'
                  : 'var(--color-border)',
                backgroundColor: formData.interests.includes(value)
                  ? 'var(--color-primary-light)'
                  : 'transparent',
              }}
            >
              <div className='flex items-center gap-2'>
                <div
                  className='w-5 h-5 rounded-full border-2 flex items-center justify-center'
                  style={{
                    borderColor: formData.interests.includes(value)
                      ? 'var(--color-primary)'
                      : 'var(--color-border)',
                  }}
                >
                  {formData.interests.includes(value) && (
                    <div
                      className='w-2 h-2 rounded-full'
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    />
                  )}
                </div>
                <div>
                  <p className='font-semibold' style={{ color: 'var(--color-text-primary)' }}>
                    {t(`interests.${labelKey}`)}
                  </p>
                  <p className='text-xs' style={{ color: 'var(--color-text-secondary)' }}>
                    {t(`interests.${subKey}`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mb-8'>
        <div className='flex items-center gap-2 mb-2'>
          <PersonAddIcon sx={{ color: 'var(--color-accent)' }} />
          <h3 className='font-semibold' style={{ color: 'var(--color-text-primary)' }}>
            {t('interests.referral_heading')}
          </h3>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <TextField
            label={t('interests.referrer_name')}
            placeholder={t('interests.referrer_name_placeholder')}
            value={formData.referrerName}
            onChange={(e) => dispatch(updateForm({ referrerName: e.target.value }))}
            fullWidth
          />
          <TextField
            label={t('interests.referrer_phone')}
            placeholder={t('interests.referrer_phone_placeholder')}
            value={formData.referrerPhone}
            onChange={(e) => dispatch(updateForm({ referrerPhone: e.target.value }))}
            fullWidth
          />
        </div>
      </div>

      <div className='mb-8'>
        <div className='flex items-center gap-2 mb-2'>
          <ChecklistIcon sx={{ color: 'var(--color-accent)' }} />
          <h3 className='font-semibold' style={{ color: 'var(--color-text-primary)' }}>
            {t('interests.assumptions_heading')}
          </h3>
        </div>
        <p
          className='text-sm mb-4 pl-4 border-l-4'
          style={{
            color: 'var(--color-text-secondary)',
            borderColor: 'var(--color-accent)',
          }}
        >
          {t('interests.assumptions_intro')}
        </p>
        <div className='flex flex-col gap-2'>
          {ASSUMPTION_OPTIONS.map(({ values, labelKey }) => (
            <FormControlLabel
              key={labelKey}
              control={
                <Checkbox
                  checked={isAssumptionChecked(values)}
                  onChange={() => toggleAssumption(values)}
                  sx={{ color: 'var(--color-primary)' }}
                />
              }
              label={t(`interests.${labelKey}`)}
            />
          ))}
        </div>
      </div>

      <div className='flex flex-wrap justify-between gap-4'>
        <Button startIcon={<ArrowBackIcon />} onClick={() => dispatch(prevStep())}>
          {t('register.buttons.back')}
        </Button>
        <div className='flex gap-2'>
          <Button variant='outlined'>{t('register.buttons.save_draft')}</Button>
          <Button
            variant='contained'
            endIcon={<ArrowForwardIcon />}
            onClick={() => dispatch(nextStep())}
          >
            {t('register.buttons.review_form')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Step4Interests
