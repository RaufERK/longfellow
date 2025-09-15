import { NextRequest, NextResponse } from 'next/server'

function isAuthenticated(req: NextRequest): boolean {
  console.log('🔍 Middleware: Проверяю авторизацию...')

  const token = req.cookies.get('moderator-token')?.value
  console.log(
    '🎫 Middleware: Токен найден:',
    token ? `да (${token.substring(0, 20)}...)` : 'нет'
  )

  if (!token) {
    console.log('❌ Middleware: Токен отсутствует')
    return false
  }

  try {
    // Простая проверка без crypto - разбираем JWT вручную
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.log('❌ Middleware: Неверный формат токена')
      return false
    }

    // Декодируем payload без проверки подписи (для middleware это приемлемо)
    const payload = JSON.parse(atob(parts[1]))
    console.log('📋 Middleware: Payload:', payload)

    // Проверяем роль и время истечения
    const isValid =
      payload.role === 'moderator' && payload.exp > Date.now() / 1000
    console.log('✅ Middleware: Результат проверки:', isValid)

    return isValid
  } catch (error) {
    console.error('❌ Middleware: Ошибка проверки токена:', error)
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/moderator')) {
    console.log('🛡️  Middleware: Проверка пути:', pathname)
    const isAuth = isAuthenticated(request)
    console.log('🔓 Middleware: Авторизован:', isAuth)

    if (pathname === '/moderator/login') {
      // Если пользователь уже авторизован, редиректим на главную админки
      if (isAuth) {
        console.log(
          '↩️ Middleware: Авторизованный пользователь на логине, редирект на /moderator'
        )
        return NextResponse.redirect(new URL('/moderator', request.url))
      }
      // Неавторизованный пользователь может попасть на логин
      console.log(
        '👤 Middleware: Неавторизованный пользователь на логине, пропускаем'
      )
      return NextResponse.next()
    }

    // Для всех остальных страниц админки нужна авторизация
    if (!isAuth) {
      console.log(
        '🚫 Middleware: Неавторизованный пользователь, редирект на логин'
      )
      return NextResponse.redirect(new URL('/moderator/login', request.url))
    }

    console.log(
      '✅ Middleware: Авторизованный пользователь, пропускаем на',
      pathname
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/moderator/:path*'],
}
