'use client'

import { Button as MuiButton, ButtonProps } from '@mui/material'
import Link from 'next/link'

type ButtonComponentProps = Omit<ButtonProps, 'component'> & {
  href?: string
}

const Button = ({ href, children, ...props }: ButtonComponentProps) => {
  if (href) {
    return (
      <MuiButton component={Link} href={href} {...(props as any)}>
        {children}
      </MuiButton>
    )
  }

  return <MuiButton {...props}>{children}</MuiButton>
}

export default Button
