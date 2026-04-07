import { NextResponse } from 'next/server'
import { auth } from './auth'

export const proxy = auth((req) => {
  if (req.nextUrl.pathname.startsWith('/admin') && !req.auth) {
    const newUrl = new URL('/login', req.url)
    return NextResponse.redirect(newUrl)
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
