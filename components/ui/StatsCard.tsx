'use client'

import {
  alpha,
  Card,
  Typography,
  useTheme,
  type CardProps,
} from '@mui/material'
import { ComponentType, ReactNode } from 'react'

export type StatsCardProps = CardProps & {
  title: string
  number: string
  Icon: ComponentType
  otherInfo?: ReactNode
  iconColor?: string
}

const StatsCard = ({
  title,
  number,
  Icon,
  otherInfo,
  iconColor,
  ...cardProps
}: StatsCardProps) => {
  const theme = useTheme()
  const finalIconColor = iconColor ?? theme.palette.primary.main

  return (
    <Card {...cardProps}>
      <div className='p-3'>
        <div className='flex justify-between items-start gap-5'>
          <section>
            <Typography sx={{ color: 'grey.500' }}>{title}</Typography>
            <Typography variant='h5'>{number}</Typography>
          </section>

          <span
            style={{
              color: finalIconColor,
              backgroundColor: alpha(finalIconColor, 0.1),
            }}
            className='flex aspect-square p-1 rounded-md'
          >
            <Icon />
          </span>
        </div>

        {otherInfo && <div>{otherInfo}</div>}
      </div>
    </Card>
  )
}

export default StatsCard
