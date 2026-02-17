'use client'

import { Card, Typography, type CardProps } from '@mui/material'
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
  iconColor = '#35af90',
  ...cardProps
}: StatsCardProps) => {
  return (
    <Card {...cardProps}>
      <div className='p-3'>
        <div className='flex justify-between items-start'>
          <section>
            <Typography sx={{ color: 'grey.500' }}>{title}</Typography>
            <Typography variant='h5'>{number}</Typography>
          </section>

          <span
            style={{ color: iconColor, backgroundColor: iconColor + '17' }}
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
