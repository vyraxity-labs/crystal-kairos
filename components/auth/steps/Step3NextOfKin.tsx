'use client'

import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button, MenuItem } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import type { RootState } from '@/store'
import { updateForm, nextStep, prevStep } from '@/store/registration.store'
import { Relationship } from '@/generated/prisma/client'
import { NIGERIAN_BANKS } from '../data'

const RELATIONSHIP_OPTIONS: Relationship[] = [
  Relationship.SPOUSE,
  Relationship.SIBLING,
  Relationship.PARENT,
  Relationship.CHILD,
  Relationship.FRIEND,
  Relationship.COLLEAGUE,
  Relationship.NEIGHBOR,
  Relationship.ACQUAINTANCE,
  Relationship.RELATIVE,
  Relationship.OTHER,
]

const Step3NextOfKin = () => {
  const { t } = useTranslation('auth')
  const dispatch = useDispatch()
  const formData = useSelector((s: RootState) => s.registration.formData)

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateForm({ [field]: e.target.value }))
  }

  return (
    <div
      className='rounded-xl p-6 md:p-8'
      style={{
        backgroundColor: 'var(--color-bg-paper)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className='flex items-center gap-2 mb-6'>
        <PeopleIcon sx={{ color: 'var(--color-primary)' }} />
        <h2 className='text-xl font-bold' style={{ color: 'var(--color-text-primary)' }}>
          {t('next_of_kin.heading')}
        </h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <TextField
          label={t('next_of_kin.full_name')}
          placeholder={t('next_of_kin.full_name_placeholder')}
          value={formData.kinFullName}
          onChange={handleChange('kinFullName')}
          fullWidth
        />
        <TextField
          select
          label={t('next_of_kin.relationship')}
          value={formData.kinRelationship || ''}
          onChange={(e) =>
            dispatch(updateForm({ kinRelationship: e.target.value as Relationship }))
          }
          fullWidth
        >
          <MenuItem value=''>{t('next_of_kin.relationship_placeholder')}</MenuItem>
          {RELATIONSHIP_OPTIONS.map((rel) => (
            <MenuItem key={rel} value={rel}>
              {t(`next_of_kin.relationship_options.${rel}`)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('next_of_kin.phone')}
          placeholder={t('next_of_kin.phone_placeholder')}
          value={formData.kinPhoneNumber}
          onChange={handleChange('kinPhoneNumber')}
          fullWidth
        />
        <TextField
          label={t('next_of_kin.occupation')}
          placeholder={t('next_of_kin.occupation_placeholder')}
          value={formData.kinOccupation}
          onChange={handleChange('kinOccupation')}
          fullWidth
        />
        <TextField
          label={t('next_of_kin.address')}
          placeholder={t('next_of_kin.address_placeholder')}
          value={formData.kinAddress}
          onChange={handleChange('kinAddress')}
          fullWidth
          multiline
          rows={2}
          className='md:col-span-2'
        />
      </div>

      <div className='flex items-center gap-2 mt-8 mb-4'>
        <AccountBalanceIcon sx={{ color: 'var(--color-primary)' }} />
        <h3 className='text-lg font-bold' style={{ color: 'var(--color-text-primary)' }}>
          {t('next_of_kin.bank_heading')}
        </h3>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <TextField
          select
          label={t('next_of_kin.bank_name')}
          value={formData.kinBankName}
          onChange={(e) => dispatch(updateForm({ kinBankName: e.target.value }))}
          fullWidth
        >
          {NIGERIAN_BANKS.map((bank) => (
            <MenuItem key={bank} value={bank}>
              {bank}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('next_of_kin.account_number')}
          placeholder={t('next_of_kin.account_number_placeholder')}
          value={formData.kinAccountNumber}
          onChange={handleChange('kinAccountNumber')}
          fullWidth
        />
        <TextField
          label={t('bank_details.account_name')}
          placeholder={t('bank_details.account_name_placeholder')}
          value={formData.kinAccountName}
          onChange={handleChange('kinAccountName')}
          fullWidth
        />
      </div>

      <div className='flex flex-wrap justify-between gap-4 mt-8'>
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
            {t('register.buttons.continue')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Step3NextOfKin
