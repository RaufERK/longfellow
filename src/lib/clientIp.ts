import { NextRequest } from 'next/server'

export function getClientIp(req: NextRequest): string {
  const realIp = req.headers.get('x-real-ip')?.trim()

  if (realIp) {
    return realIp
  }

  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || 'unknown'
}
