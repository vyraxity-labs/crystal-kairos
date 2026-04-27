import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  const body = await request.json()
  const { userId, userEmail } = body

  const secret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRATION as jwt.SignOptions['expiresIn']

  if (!secret || !expiresIn) {
    return Response.json(
      { success: false, error: 'Missing JWT configuration' },
      { status: 500 },
    )
  }

  const token = jwt.sign({ userId, userEmail }, secret, { expiresIn })

  return Response.json({ success: true, token })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  if (!token) {
    return Response.json(
      { success: false, error: 'Missing token' },
      { status: 400 },
    )
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET!)
  if (!decoded) {
    return Response.json(
      { success: false, error: 'Invalid token' },
      { status: 400 },
    )
  }
  const { userId, userEmail } = decoded as { userId: string; userEmail: string }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  if (!user) {
    return Response.json(
      { success: false, error: 'User not found' },
      { status: 400 },
    )
  }
  return Response.json({ success: true, data: { userId, userEmail } })
}
