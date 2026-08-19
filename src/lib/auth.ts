import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

const MODERATOR_PASS = process.env.MODERATOR_PASS || ''

export interface ModeratorPayload {
  role: 'moderator'
  iat?: number
  exp?: number
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }

  return secret
}

export function generateToken(): string {
  const payload: ModeratorPayload = { role: 'moderator' }
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: SESSION_MAX_AGE_SECONDS,
  })
}

export function verifyToken(token: string): ModeratorPayload | null {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as ModeratorPayload
    return payload
  } catch {
    return null
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  return password === MODERATOR_PASS
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return req.cookies.get('moderator-token')?.value || null
}

export function isAuthenticated(req: NextRequest): boolean {
  const token = getTokenFromRequest(req)

  if (!token) {
    return false
  }

  const payload = verifyToken(token)
  return payload?.role === 'moderator'
}
