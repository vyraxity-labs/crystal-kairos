'use client'

import { signOut } from 'next-auth/react'
import { Button } from '../ui/button'

const Logout = () => {
  return (
    <Button
      onClick={() => signOut()}
      className='w-full bg-error text-on-error hover:bg-error/80 rounded-sm'
      variant='destructive'
    >
      Logout
    </Button>
  )
}
export default Logout
