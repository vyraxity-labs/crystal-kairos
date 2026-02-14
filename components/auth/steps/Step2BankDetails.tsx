'use client'

import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button, MenuItem, InputAdornment } from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import LockIcon from '@mui/icons-material/Lock'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import type { RootState } from '@/store'
import { updateForm, nextStep, prevStep } from '@/store/registration.store'
import { NIGERIAN_BANKS } from '../data'

const Step2BankDetails = () => {
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
        <AccountBalanceIcon sx={{ color: 'var(--color-primary)' }} />
        <h2 className='text-xl font-bold' style={{ color: 'var(--color-text-primary)' }}>
          {t('bank_details.heading')}
        </h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <TextField
          select
          label={t('bank_details.bank_name')}
          placeholder={t('bank_details.bank_name_placeholder')}
          value={formData.bankName}
          onChange={(e) => dispatch(updateForm({ bankName: e.target.value }))}
          fullWidth
          helperText={t('bank_details.bank_name_helper')}
        >
          {NIGERIAN_BANKS.map((bank) => (
            <MenuItem key={bank} value={bank}>
              {bank}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('bank_details.account_number')}
          placeholder={t('bank_details.account_number_placeholder')}
          value={formData.accountNumber}
          onChange={handleChange('accountNumber')}
          fullWidth
        />
        <TextField
          label={t('bank_details.account_name')}
          placeholder={t('bank_details.account_name_placeholder')}
          value={formData.accountName}
          onChange={handleChange('accountName')}
          fullWidth
          className='md:col-span-2'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <LockIcon fontSize='small' />
              </InputAdornment>
            ),
          }}
          helperText={t('bank_details.account_name_helper')}
        />
      </div>

      <div
        className='flex gap-3 p-4 rounded-lg mt-4'
        style={{ backgroundColor: 'var(--color-primary-light)' }}
      >
        <InfoOutlinedIcon sx={{ color: 'var(--color-primary)' }} />
        <p className='text-sm' style={{ color: 'var(--color-text-secondary)' }}>
          {t('bank_details.info_alert')}
        </p>
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

export default Step2BankDetails
