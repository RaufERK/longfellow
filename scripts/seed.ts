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
    await prisma.book.upsert({
      where: rec.legacyId ? { legacyId: rec.legacyId } : { id: -1 },
      update: {
        title: rec.title,
        priceRub: rec.priceRub ?? undefined,
        coverUrl: rec.coverUrl ?? undefined,
        description: rec.description ?? undefined,
        htmlPath: rec.htmlPath,
      },
      create: {
        legacyId: rec.legacyId ?? undefined,
        title: rec.title,
        priceRub: rec.priceRub ?? undefined,
        coverUrl: rec.coverUrl ?? undefined,
        description: rec.description ?? undefined,
        htmlPath: rec.htmlPath,
      },
    })
  }
  console.log(`Seeded ${data.length} books`)
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
