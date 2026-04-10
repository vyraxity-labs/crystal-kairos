import { NextResponse } from 'next/server'
import { auth } from './auth'
import { publicRoutes } from './routes-def'

export const proxy = auth((req) => {
  const pathname = req.nextUrl.pathname
  const session = req.auth
  const userRole = session?.user.role
  const userId = session?.user.id

  const isPublicRoute = publicRoutes.includes(pathname)
  const isAdminRoute = pathname.startsWith('/admin')
  const isUserRoute = pathname.startsWith(`/${userId}`)
  const isAdminUser = userRole === 'ADMIN' || userRole === 'OWNER'

  // if (!isPublicRoute) {
  //   if (!session) {
  //     return NextResponse.redirect(new URL('/login', req.url))
  //   }
  // }
  // redirect to admin or user page if user is logged in
  if (pathname === '/login' && session) {
    if (isAdminUser) {
      return NextResponse.redirect(new URL('/admin', req.url))
    } else {
      return NextResponse.redirect(new URL(`/${userId}`, req.url))
    }
  }

  // redirect to login page if user is not logged in and not a public route
  if (!session && !isPublicRoute) {
    const newUrl = new URL('/login', req.url)
    return NextResponse.redirect(newUrl)
  }

  // redirect to unauthorized page if user is not an admin
  if (isAdminRoute) {
    if (!isAdminUser) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // redirect to unauthorized page if user is not a user
  if (isUserRoute) {
    if (userRole !== 'USER') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
