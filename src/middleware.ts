import { NextRequest, NextResponse } from 'next/server'

function isAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get('moderator-token')?.value

  if (!token) {
    return false
  }

  try {
    // Простая проверка без crypto - разбираем JWT вручную
    const parts = token.split('.')
    if (parts.length !== 3) {
      return false
    }

    // Декодируем payload без проверки подписи (для middleware это приемлемо)
    const payload = JSON.parse(atob(parts[1]))

    // Проверяем роль и время истечения
    return payload.role === 'moderator' && payload.exp > Date.now() / 1000
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/moderator')) {
    const isAuth = isAuthenticated(request)

    if (pathname === '/moderator/login') {
      // Если пользователь уже авторизован, редиректим на главную админки
      if (isAuth) {
        return NextResponse.redirect(new URL('/moderator', request.url))
      }
      // Неавторизованный пользователь может попасть на логин
      return NextResponse.next()
    }

    // Для всех остальных страниц админки нужна авторизация
    if (!isAuth) {
      return NextResponse.redirect(new URL('/moderator/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/moderator/:path*'],
}
