import { Badge } from '@/components/ui/badge'

const ReviewItem = ({
  field,
  value,
}: {
  field: string
  value: string | string[]
}) => {
  return (
    <div className='mb-2'>
      <h4 className='text-muted-foreground text-xs uppercase mb-1'>{field}</h4>
      {Array.isArray(value) ? (
        <article className='flex gap-2'>
          {value.map((item) => {
            return <Badge variant='outline'>{item}</Badge>
          })}
        </article>
      ) : (
        <p>{value}</p>
      )}
    </div>
  )
}

export default ReviewItem
