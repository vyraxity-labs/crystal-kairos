'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { setCurrentStep } from '@/store/register.store'
import { Pencil } from 'lucide-react'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

const SummaryCard = ({
  children,
  title,
  stepNumber,
}: {
  children: ReactNode
  title: string
  stepNumber: number
}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation('auth')

  return (
    <Card className='rounded-md p-0'>
      <CardHeader className='bg-surface-container-low rounded-none py-3 flex justify-between items-center'>
        <h3 className='font-semibold'>{title}</h3>
        <Button
          variant='ghost'
          className='cursor-pointer'
          onClick={() => dispatch(setCurrentStep(stepNumber))}
        >
          <Pencil /> {t('register.form.buttons.edit')}
        </Button>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default SummaryCard
