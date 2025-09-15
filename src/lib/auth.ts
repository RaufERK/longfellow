import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev'
const MODERATOR_PASS = process.env.MODERATOR_PASS || ''

console.log('🔧 Auth: Инициализация модуля авторизации')
console.log(
  '🔑 Auth: JWT_SECRET:',
  JWT_SECRET ? `загружен (${JWT_SECRET.substring(0, 10)}...)` : 'НЕ ЗАГРУЖЕН'
)
console.log(
  '🔒 Auth: MODERATOR_PASS:',
  MODERATOR_PASS ? 'загружен' : 'НЕ ЗАГРУЖЕН'
)

export interface ModeratorPayload {
  role: 'moderator'
  iat?: number
  exp?: number
}

export function generateToken(): string {
  console.log('🎫 JWT: Создаю токен...')
  console.log(
    '🔑 JWT: JWT_SECRET для создания:',
    JWT_SECRET ? `есть (${JWT_SECRET.substring(0, 10)}...)` : 'отсутствует'
  )

  const payload: ModeratorPayload = { role: 'moderator' }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '365d' })

  console.log('✅ JWT: Токен создан:', token.substring(0, 50) + '...')
  return token
}

export function verifyToken(token: string): ModeratorPayload | null {
  console.log('🔓 JWT: Проверяю токен...')
  console.log(
    '🔑 JWT: JWT_SECRET:',
    JWT_SECRET ? `есть (${JWT_SECRET.substring(0, 10)}...)` : 'отсутствует'
  )
  console.log('🎫 JWT: Токен для проверки:', token.substring(0, 50) + '...')

  try {
    const payload = jwt.verify(token, JWT_SECRET) as ModeratorPayload
    console.log('✅ JWT: Токен успешно расшифрован:', payload)
    return payload
  } catch (error) {
    console.error('❌ JWT: Ошибка расшифровки токена:', error)
    return null
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  return password === MODERATOR_PASS
}

export function getTokenFromRequest(req: NextRequest): string | null {
  console.log('🍪 Auth: Получаю токен из запроса...')

  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    console.log('🎫 Auth: Токен найден в Authorization header')
    return authHeader.slice(7)
  }

  const cookieToken = req.cookies.get('moderator-token')?.value || null
  console.log(
    '🍪 Auth: Токен в cookie:',
    cookieToken ? `да (${cookieToken.substring(0, 20)}...)` : 'отсутствует'
  )
  console.log(
    '🍪 Auth: Все cookies:',
    Object.fromEntries(req.cookies.getAll().map((c) => [c.name, c.value]))
  )

  return cookieToken
}

export function isAuthenticated(req: NextRequest): boolean {
  console.log('🔍 Auth: Проверяю авторизацию...')
  const token = getTokenFromRequest(req)
  console.log(
    '🎫 Auth: Токен найден:',
    token ? `да (${token.substring(0, 20)}...)` : 'нет'
  )

  if (!token) {
    console.log('❌ Auth: Токен отсутствует')
    return false
  }

  const payload = verifyToken(token)
  console.log('📋 Auth: Payload токена:', payload)

  const isAuth = payload?.role === 'moderator'
  console.log('✅ Auth: Результат авторизации:', isAuth)

  return isAuth
}
