import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev'
const MODERATOR_PASS = process.env.MODERATOR_PASS || ''

export interface ModeratorPayload {
  role: 'moderator'
  iat?: number
  exp?: number
}

export function generateToken(): string {
  const payload: ModeratorPayload = { role: 'moderator' }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '365d' })
}

export function verifyToken(token: string): ModeratorPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as ModeratorPayload
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
