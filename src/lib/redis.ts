import { createClient } from 'redis'

let client: ReturnType<typeof createClient> | null = null
let connectionFailed = false
let warningShown = false

async function getRedisClient() {
  // Если уже пытались подключиться и не получилось, не пробуем снова
  if (connectionFailed) {
    throw new Error('Redis connection previously failed')
  }

  if (!client) {
    try {
      client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      })

      client.on('error', () => {
        if (!warningShown) {
          console.warn('⚠️  Redis недоступен - защита от брут-форс отключена')
          warningShown = true
        }
        connectionFailed = true
      })

      await client.connect()
      console.log('✅ Redis подключен успешно')
    } catch {
      if (!warningShown) {
        console.warn('⚠️  Redis недоступен - защита от брут-форс отключена')
        warningShown = true
      }
      connectionFailed = true
      client = null
      throw new Error('Redis connection failed')
    }
  }

  return client
}

export async function checkBruteForce(
  ip: string
): Promise<{ allowed: boolean; remainingAttempts: number }> {
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
    if (!warningShown) {
      console.warn('⚠️  Redis недоступен - защита от брут-форс отключена')
      warningShown = true
    }
    return { allowed: true, remainingAttempts: 5 }
  }
}

export async function recordFailedAttempt(ip: string): Promise<void> {
  try {
    const redis = await getRedisClient()
    const key = `brute-force:${ip}`
    const lockDuration = 15 * 60 // 15 минут

    await redis.incr(key)
    await redis.expire(key, lockDuration)
  } catch {
    // Молча пропускаем - предупреждение уже показано
  }
}

export async function clearFailedAttempts(ip: string): Promise<void> {
  try {
    const redis = await getRedisClient()
    const key = `brute-force:${ip}`
    await redis.del(key)
  } catch {
    // Молча пропускаем - предупреждение уже показано
  }
}
