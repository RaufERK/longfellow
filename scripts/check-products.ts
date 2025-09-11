import { prisma } from '../src/lib/prisma'

async function main() {
  const totalProducts = await prisma.product.count()
  const byCategory = await prisma.product.groupBy({
    by: ['category'],
    _count: true
  })
  
  console.log(`Всего продуктов в базе: ${totalProducts}`)
  console.log('\nПо категориям:')
  byCategory.forEach(cat => {
    console.log(`  ${cat.category}: ${cat._count}`)
  })
  
  // Тестовый поиск
  const searchResults = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: 'книга', mode: 'insensitive' } },
        { title: { contains: 'поэма', mode: 'insensitive' } },
      ]
    },
    take: 5
  })
  
  console.log('\nПримеры найденных товаров:')
  searchResults.forEach(p => {
    console.log(`  - ${p.title} (${p.category})`)
  })
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
