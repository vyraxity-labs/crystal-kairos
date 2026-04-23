'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BanIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Rejection = ({ reason }: { reason: string }) => {
  const { t } = useTranslation('admin-members')

  return (
    <Card className='rounded-md bg-primary text-on-primary'>
      <CardHeader className='flex items-center gap-2'>
        <Button
          variant='ghost'
          size='icon'
          className='pointer-events-none bg-error/15 text-error rounded-sm'
        >
          <BanIcon />
        </Button>
        <CardTitle className='font-semibold'>
          {t('details.rejection.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{reason}</p>
      </CardContent>
    </Card>
  )
}

export default Rejection
