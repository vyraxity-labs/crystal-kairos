import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

const InfoCard = ({
  children,
  title,
  variant = 'elevated',
  Icon,
}: {
  children: ReactNode
  title: string
  variant?: 'plain' | 'elevated'
  Icon?: LucideIcon
}) => {
  return (
    <Card
      className={cn(
        'rounded-md',
        variant === 'plain' ? 'bg-tertiary/5 shadow-none' : '',
      )}
    >
      <CardHeader className='flex items-center'>
        {Icon && (
          <Button
            className='bg-primary/10 text-primary rounded-sm cursor-default hover:text-primary'
            variant='ghost'
          >
            <Icon size={20} />
          </Button>
        )}
        <CardTitle
          className={cn(
            'font-semibold text-primary',
            Icon ? 'text-lg ' : 'text-xs',
          )}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default InfoCard
