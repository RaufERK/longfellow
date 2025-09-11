import { prisma } from '../src/lib/prisma'

async function testSearch(query: string) {
  console.log(`\nТестируем поиск: "${query}"\n`)
  
  try {
    const searchTerms = query.toLowerCase().split(/\s+/)
    console.log('Поисковые термины:', searchTerms)

    // Получаем все продукты с ценой и в наличии
    const allProducts = await prisma.product.findMany({
      where: {
        price: { not: null },
        inStock: true,
      },
    })
    
    console.log(`Всего продуктов с ценой и в наличии: ${allProducts.length}`)

    // Фильтруем продукты по поисковым терминам (регистронезависимо)
    const products = allProducts.filter(product => {
      return searchTerms.every(term => {
        const searchableText = [
          product.title,
          product.author,
          product.shortDescription,
          product.longDescription,
          product.publisher,
          product.isbn,
          product.sku,
          product.dimensions
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        
        return searchableText.includes(term)
      })
    })

    console.log(`Найдено результатов: ${products.length}`)
    
    // Показываем первые 5 результатов
    console.log('\nПервые 5 результатов:')
    products.slice(0, 5).forEach((p, i) => {
      console.log(`${i + 1}. ${p.title} (${p.category}) - ${p.price}₽`)
    })

    // Группируем по категориям
    const grouped = {
      books: products.filter(p => p.category === 'books' || p.category === 'book'),
      buklets: products.filter(p => p.category === 'buklets'),
      films: products.filter(p => p.category === 'films'),
      cards: products.filter(p => p.category === 'cards'),
      calendars: products.filter(p => p.category === 'calendars'),
    }

    console.log('\nПо категориям:')
    Object.entries(grouped).forEach(([cat, items]) => {
      if (items.length > 0) {
        console.log(`  ${cat}: ${items.length}`)
      }
    })

  } catch (error) {
    console.error('Ошибка:', error)
  }
}

async function main() {
  await testSearch('книга')
  await testSearch('longfellow')
  await testSearch('поэма')
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
