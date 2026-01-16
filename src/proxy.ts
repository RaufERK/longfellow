import { NextRequest, NextResponse } from 'next/server'

function isAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get('moderator-token')?.value

  if (!token) {
    return false
  }

  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return false
    }

    const payload = JSON.parse(atob(parts[1]))
    return payload.role === 'moderator' && payload.exp > Date.now() / 1000
  } catch {
    return false
  }
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
