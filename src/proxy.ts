import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/moderator')) {
    const isAuth = await isAuthenticated(request)

    if (pathname === '/moderator/login') {
      if (isAuth) {
        return NextResponse.redirect(new URL('/moderator', request.url))
      }
      return NextResponse.next()
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL('/moderator/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/moderator/:path*'],
}
