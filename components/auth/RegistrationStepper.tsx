'use client'

import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import CheckIcon from '@mui/icons-material/Check'
import theme from '@/lib/theme'

const STEPS = ['personal', 'bank', 'kin', 'interests', 'review'] as const

const RegistrationStepper = () => {
  const { t } = useTranslation('auth')
  const currentStep = useSelector((s: RootState) => s.registration.currentStep)

  return (
    <div className='flex items-center justify-center gap-2 md:gap-4 py-6'>
      {STEPS.map((key, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep

        return (
          <div key={key} className='flex items-center'>
            <div className='flex flex-col items-center'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-white ${
                  isActive || isCompleted ? '' : 'bg-gray-200 text-gray-500'
                }`}
                style={
                  isActive
                    ? { backgroundColor: theme.palette.secondary.main }
                    : isCompleted
                      ? { backgroundColor: theme.palette.success.main }
                      : undefined
                }
              >
                {isCompleted ? <CheckIcon sx={{ fontSize: 20 }} /> : index + 1}
              </div>
              <span
                className={`text-xs mt-1 hidden sm:block ${
                  isActive ? 'font-semibold' : 'text-gray-500'
                }`}
                style={isActive ? { color: 'var(--color-primary)' } : undefined}
              >
                {t(`register.steps.${key}`)}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-8 md:w-16 h-0.5 mx-1 ${
                  index < currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
                style={
                  index < currentStep
                    ? { backgroundColor: 'var(--color-primary)' }
                    : undefined
                }
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default RegistrationStepper
