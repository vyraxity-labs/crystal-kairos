'use client'

import { Button } from '@/components/ui/button'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

const LoginPage = () => {
  return (
    <div>
      <Button
        onClick={async () =>
          await signIn('credentials', {
            email: 'test@test.com',
            password: '1234',
            callbackUrl: '/admin',
          })
        }
      >
        Login
      </Button>

      <Button onClick={() => signOut()}>Log out</Button>
      <Link href='/'>Home</Link>
    </div>
  )
}

export default LoginPage
