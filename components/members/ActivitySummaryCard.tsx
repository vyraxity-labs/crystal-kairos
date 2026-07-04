import { LucideIcon } from 'lucide-react'
import { Card } from '../ui/card'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ClassValue } from 'clsx'

const ActivitySummaryCard = ({
  Icon,
  label,
  value,
  href,
  className,
}: {
  Icon: LucideIcon
  label: string
  value: string
  href: string
  className: ClassValue
}) => {
  return (
    <Card className='w-full rounded-md p-0'>
      <Link href={href} className='flex gap-3 h-full p-4'>
        <section
          className={cn(
            'w-12 rounded-sm aspect-square flex justify-center items-center',
            className,
          )}
        >
          <Icon size={28} />
        </section>

        <section>
          <span className='text-xs text-muted-foreground uppercase'>
            {label}
          </span>
          <h3 className='text-xl font-semibold'>{value}</h3>
        </section>
      </Link>
    </Card>
  )
}

export default ActivitySummaryCard
