import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateToken } from '@/lib/auth'
import {
  checkBruteForce,
  recordFailedAttempt,
  clearFailedAttempts,
} from '@/lib/redis'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (!password) {
      return NextResponse.json({ error: 'Пароль обязателен' }, { status: 400 })
    }

    const clientIP =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      req.ip ||
      'unknown'

    const bruteForceCheck = await checkBruteForce(clientIP)

    if (!bruteForceCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Слишком много неудачных попыток. Попробуйте через 15 минут.',
        },
        { status: 429 }
      )
    }

    const isValidPassword = await verifyPassword(password)

    if (!isValidPassword) {
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

    const token = generateToken()

    const response = NextResponse.json({ success: true, token })

    response.cookies.set('moderator-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60, // 1 год
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
