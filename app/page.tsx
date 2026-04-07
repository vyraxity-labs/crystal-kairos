import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const HomePage = async () => {
  const users = await prisma.user.findMany({})

  return (
    <div>
      <h1>HomePage</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut, qui.</p>

      <Link href='/login'>Login</Link>
      <Link href='/admin'>Admin</Link>

      <div>
        {users.map((user) => {
          return (
            <div key={user.id}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HomePage
