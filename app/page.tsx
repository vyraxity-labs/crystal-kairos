import Sample from '@/components/home/Sample'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const HomePage = async () => {
  const users = await prisma.user.findMany({})

  return (
    <div>
      <Sample />

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
