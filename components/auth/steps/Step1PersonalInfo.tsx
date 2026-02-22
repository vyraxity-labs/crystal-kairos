'use client'

import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button, MenuItem, InputAdornment } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import type { RootState } from '@/store'
import { updateForm, nextStep, prevStep } from '@/store/registration.store'
import { Gender } from '@/types/registration.enums'

const Step1PersonalInfo = () => {
  const { t } = useTranslation('auth')
  const dispatch = useDispatch()
  const formData = useSelector((s: RootState) => s.registration.formData)

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <PersonIcon sx={{ color: 'var(--color-primary)' }} />
        <h2
          className='text-xl font-bold'
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('personal_info.heading')}
        </h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <TextField
          label={t('personal_info.full_name')}
          placeholder={t('personal_info.full_name_placeholder')}
          value={formData.fullName}
          onChange={handleChange('fullName')}
          fullWidth
        />
        <TextField
          label={t('personal_info.email')}
          placeholder={t('personal_info.email_placeholder')}
          type='email'
          value={formData.email}
          onChange={handleChange('email')}
          fullWidth
        />
        <TextField
          label={t('personal_info.phone')}
          placeholder={t('personal_info.phone_placeholder')}
          value={formData.phoneNumber}
          onChange={handleChange('phoneNumber')}
          fullWidth
        />
        <TextField
          select
          label={t('personal_info.gender')}
          value={formData.gender || ''}
          onChange={(e) =>
            dispatch(updateForm({ gender: e.target.value as Gender }))
          }
          fullWidth
        >
          <MenuItem value=''>{t('personal_info.gender_placeholder')}</MenuItem>
          <MenuItem value={Gender.MALE}>Male</MenuItem>
          <MenuItem value={Gender.FEMALE}>Female</MenuItem>
        </TextField>
        <TextField
          label={t('personal_info.date_of_birth')}
          placeholder={t('personal_info.date_of_birth_placeholder')}
          type='date'
          value={formData.dateOfBirth}
          onChange={handleChange('dateOfBirth')}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <CalendarMonthIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label={t('personal_info.occupation')}
          placeholder={t('personal_info.occupation_placeholder')}
          value={formData.occupation}
          onChange={handleChange('occupation')}
          fullWidth
        />
        <TextField
          label={t('personal_info.address')}
          placeholder={t('personal_info.address_placeholder')}
          value={formData.address}
          onChange={handleChange('address')}
          fullWidth
          multiline
          rows={3}
          className='md:col-span-2'
        />
        <TextField
          label={t('personal_info.state_of_origin')}
          placeholder={t('personal_info.state_of_origin_placeholder')}
          value={formData.stateOfOrigin}
          onChange={handleChange('stateOfOrigin')}
          fullWidth
        />
      </div>

      <div className='flex flex-wrap justify-between gap-4 mt-8'>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => dispatch(prevStep())}
          disabled
        >
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

export default Step1PersonalInfo
