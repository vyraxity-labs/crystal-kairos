'use client'

import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import { registerStepsHeaderData } from './data'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Check } from 'lucide-react'

const RegisterStepsHeader = () => {
  const { t } = useTranslation('auth')
  const { currentStep, stepsState } = useSelector(
    (store: RootState) => store.register,
  )

  return (
    <div className='grid grid-cols-5 center w-full'>
      {registerStepsHeaderData.map((item, index) => {
        const isLast = registerStepsHeaderData.length === index + 1
        const isFirst = index === 0
        const isActive = currentStep === item.step
        const isComplete = !stepsState[item.step].hasErrors

        return (
          <div key={item.id} className=''>
            <div className='flex items-center justify-center'>
              <Separator
                className={cn(
                  'shrink',
                  isFirst ? 'bg-transparent' : 'bg-secondary',
                )}
              />
              <Button
                size='icon'
                className={cn(
                  isActive
                    ? 'bg-secondary text-on-secondary hover:bg-secondary/80'
                    : isComplete
                      ? 'bg-success text-on-success'
                      : 'bg-on-surface/40 text-background hover:bg-on-surface/40',
                )}
              >
                {isComplete ? <Check /> : item.step}
              </Button>
              <Separator
                className={cn(
                  'shrink',
                  isLast ? 'bg-transparent' : 'bg-secondary',
                )}
              />
            </div>
            <p
              className={cn(
                'text-center text-xs',
                isActive ? 'text-primary' : 'text-on-surface/40',
              )}
            >
              {t(item.label)}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default RegisterStepsHeader
