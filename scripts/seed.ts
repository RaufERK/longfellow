import fs from 'fs'
import path from 'path'
import { prisma } from '../src/lib/prisma'

type BookRecord = {
  legacyId: number | null
  title: string
  priceRub: number | null
  coverUrl: string | null
  description: string | null
  htmlPath: string
}

async function main() {
  const seedPath = path.join(process.cwd(), 'scripts', 'seed.json')
  const data: BookRecord[] = JSON.parse(fs.readFileSync(seedPath, 'utf8'))
  for (const rec of data) {
    await prisma.product.upsert({
      where: rec.legacyId ? { legacyId: rec.legacyId } : { id: 'temp-id' },
      update: {
        title: rec.title,
        price: rec.priceRub ?? undefined,
        thumbnailUrl: rec.coverUrl ?? undefined,
        shortDescription: rec.description ?? undefined,
        category: 'books',
      },
      create: {
        legacyId: rec.legacyId ?? undefined,
        title: rec.title,
        price: rec.priceRub ?? undefined,
        thumbnailUrl: rec.coverUrl ?? undefined,
        shortDescription: rec.description ?? undefined,
        category: 'books',
      },
    })
  }
  console.log(`Seeded ${data.length} products`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
