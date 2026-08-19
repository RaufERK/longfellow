import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

function isAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get('moderator-token')?.value

  if (!token) {
    return false
  }

  const payload = verifyToken(token)
  return payload?.role === 'moderator'
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/moderator')) {
    const isAuth = isAuthenticated(request)

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
