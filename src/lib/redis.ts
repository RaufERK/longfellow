import { createClient } from 'redis'

let client: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
  if (client?.isOpen) {
    return client
  }

  const nextClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  })

  nextClient.on('error', (error) => {
    console.warn('Redis error:', error.message)
  })

  await nextClient.connect()
  client = nextClient
  return client
}

export async function checkBruteForce(
  ip: string
): Promise<{
  allowed: boolean
  remainingAttempts: number
  redisDown?: boolean
}> {
  try {
    const redis = await getRedisClient()
    const key = `brute-force:${ip}`
    const attempts = await redis.get(key)
    const currentAttempts = attempts ? parseInt(attempts) : 0
    const maxAttempts = 5

    if (currentAttempts >= maxAttempts) {
      return { allowed: false, remainingAttempts: 0 }
    }

    return { allowed: true, remainingAttempts: maxAttempts - currentAttempts }
  } catch {
    console.warn('Redis недоступен - вход заблокирован до восстановления')
    return { allowed: false, remainingAttempts: 0, redisDown: true }
  }
}

export async function recordFailedAttempt(ip: string): Promise<void> {
  try {
    const redis = await getRedisClient()
    const key = `brute-force:${ip}`
    const lockDuration = 15 * 60

    await redis.incr(key)
    await redis.expire(key, lockDuration)
  } catch {
    // Лимит проверен выше; без Redis новую попытку всё равно не пустим
  }
}

export async function clearFailedAttempts(ip: string): Promise<void> {
  try {
    const redis = await getRedisClient()
    const key = `brute-force:${ip}`
    await redis.del(key)
  } catch {
    // Молча пропускаем
  }
}

const ORDER_LIMIT_PER_HOUR = 10

export async function checkOrderRateLimit(
  ip: string
): Promise<{ allowed: boolean }> {
  try {
    const redis = await getRedisClient()
    const key = `order-rate:${ip}`
    const current = await redis.incr(key)

    if (current === 1) {
      await redis.expire(key, 60 * 60)
    }

    return { allowed: current <= ORDER_LIMIT_PER_HOUR }
  } catch {
    return { allowed: true }
  }
}
