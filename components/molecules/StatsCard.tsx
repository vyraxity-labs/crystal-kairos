import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import Link from 'next/link'

const StatsCard = ({
  Icon,
  label,
  number,
  footer,
  color = '#000',
  href = '#',
}: {
  Icon: LucideIcon
  label: string
  number: string
  footer?: ReactNode
  color?: string
  href?: string
}) => {
  return (
    <Card className='w-full max-w-[200px] rounded-md py-3'>
      <Link href={href} className='flex flex-col gap-3'>
        <CardHeader className='flex gap-2 items-center px-3'>
          <Icon size={16} color={color} />{' '}
          <span className='uppercase text-sm font-semibold text-muted-foreground'>
            {label}
          </span>
        </CardHeader>
        <CardContent className='px-3'>
          <h3 className='font-bold text-3xl'>{number}</h3>
        </CardContent>
        {footer && <CardFooter className='px-3'>{footer}</CardFooter>}
      </Link>
    </Card>
  )
}

export default StatsCard
