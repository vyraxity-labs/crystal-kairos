'use client'

import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next'

const ReviewItem = ({
  field,
  value,
}: {
  field: string
  value: string | string[]
}) => {
  const { t } = useTranslation('auth')

  return (
    <div className='mb-2'>
      <h4 className='text-muted-foreground text-xs uppercase mb-1'>{field}</h4>
      {Array.isArray(value) ? (
        <article className='flex gap-2'>
          {value.map((item) => {
            return (
              <Badge variant='outline' className='rounded-sm' key={item}>
                {t(item)}
              </Badge>
            )
          })}
        </article>
      ) : (
        <p>{value}</p>
      )}
    </div>
  )
}

export default ReviewItem
