import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateToken } from '@/lib/auth'
import {
  checkBruteForce,
  recordFailedAttempt,
  clearFailedAttempts,
} from '@/lib/redis'

export async function POST(req: NextRequest) {
  console.log('🔑 API: Получен запрос на логин')

  try {
    const { password } = await req.json()
    console.log('📝 API: Пароль получен:', password ? 'есть' : 'отсутствует')

    if (!password) {
      console.log('❌ API: Пароль не передан')
      return NextResponse.json({ error: 'Пароль обязателен' }, { status: 400 })
    }

    const clientIP =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      req.ip ||
      'unknown'

    console.log('🔍 API: Проверяю брут-форс для IP:', clientIP)
    const bruteForceCheck = await checkBruteForce(clientIP)

    if (!bruteForceCheck.allowed) {
      console.log('🚫 API: Брут-форс блокировка')
      return NextResponse.json(
        {
          error: 'Слишком много неудачных попыток. Попробуйте через 15 минут.',
        },
        { status: 429 }
      )
    }

    console.log('🔐 API: Проверяю пароль...')
    const isValidPassword = await verifyPassword(password)
    console.log('🔐 API: Результат проверки пароля:', isValidPassword)

    if (!isValidPassword) {
      console.log('❌ API: Неверный пароль')
      await recordFailedAttempt(clientIP)
      return NextResponse.json(
        {
          error: 'Неверный пароль',
          remainingAttempts: bruteForceCheck.remainingAttempts - 1,
        },
        { status: 401 }
      )
    }

    await clearFailedAttempts(clientIP)

    console.log('🎫 API: Генерирую токен...')
    const token = generateToken()
    console.log('🎫 API: Токен создан, длина:', token.length)

    const response = NextResponse.json({ success: true, token })

    console.log('🍪 API: Устанавливаю cookie...')
    response.cookies.set('moderator-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60, // 1 год
    })

    console.log('✅ API: Успешная авторизация')
    return response
  } catch (error) {
    console.error('💥 API: Ошибка логина:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
