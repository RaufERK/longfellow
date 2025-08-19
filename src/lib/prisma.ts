import { PrismaClient } from '@/generated/prisma'

let prisma: PrismaClient | undefined

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // @ts-ignore
  if (!global.__prisma) {
    // @ts-ignore
    global.__prisma = new PrismaClient()
  }
  // @ts-ignore
  prisma = global.__prisma as PrismaClient
}

export { prisma }
