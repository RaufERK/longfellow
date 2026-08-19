import { createHash } from 'crypto'
import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

const MODERATOR_PASS = process.env.MODERATOR_PASS || ''

export interface ModeratorPayload {
  role: 'moderator'
  iat?: number
  exp?: number
}

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }

  return createHash('sha256').update(secret).digest()
}

export async function generateToken(): Promise<string> {
  return new SignJWT({ role: 'moderator' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getJwtSecretKey())
}

export async function verifyToken(token: string): Promise<ModeratorPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey(), {
      algorithms: ['HS256'],
    })

    if (payload.role !== 'moderator') {
      return null
    }

    return {
      role: 'moderator',
      iat: payload.iat,
      exp: payload.exp,
    }
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

export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = getTokenFromRequest(req)

  if (!token) {
    return false
  }

  const payload = await verifyToken(token)
  return payload?.role === 'moderator'
}
