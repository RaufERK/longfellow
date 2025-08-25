import fs from 'fs'
import path from 'path'
import { prisma } from '../src/lib/prisma'

type ProductRecord = {
  id: string
  legacyId: number | null
  title: string
  author: string | null
  shortDescription: string | null
  longDescription: string | null
  price: number | null
  wholesalePrice1: number | null
  wholesalePrice2: number | null
  weight: number | null
  sku: string | null
  inStock: boolean
  dimensions: string | null
  pages: number | null
  publisher: string | null
  isbn: string | null
  publishYear: number | null
  images: {
    thumbnail: string | null
    large: string | null
  }
  category: string
  subcategory: string | null
  originalImagePath: string | null
}

const PRODUCTS_DIR = path.join(process.cwd(), 'products')

async function seedProducts() {
  console.log('🌱 Начинаем заполнение базы данных товарами...')

  // Очистка существующих данных
  await prisma.product.deleteMany()
  console.log('🗑️ Очищена таблица Product')

  let totalProducts = 0

  // Основные категории
  const mainCategories = ['books', 'buklets', 'films', 'cards', 'calendars']

  for (const category of mainCategories) {
    const filePath = path.join(PRODUCTS_DIR, `${category}.json`)

    if (fs.existsSync(filePath)) {
      const products: ProductRecord[] = JSON.parse(
        fs.readFileSync(filePath, 'utf8')
      )

      console.log(
        `📦 Обрабатываем категорию: ${category} (${products.length} товаров)`
      )

      for (const product of products) {
        try {
          await prisma.product.create({
            data: {
              id: product.id,
              legacyId: product.legacyId,
              title: product.title,
              author: product.author,
              shortDescription: product.shortDescription,
              longDescription: product.longDescription,
              price: product.price,
              wholesalePrice1: product.wholesalePrice1,
              wholesalePrice2: product.wholesalePrice2,
              weight: product.weight,
              sku: product.sku,
              inStock: product.inStock,
              dimensions: product.dimensions,
              pages: product.pages,
              publisher: product.publisher,
              isbn: product.isbn,
              publishYear: product.publishYear,
              thumbnailUrl: product.images.thumbnail,
              largeImageUrl: product.images.large,
              category: product.category,
              subcategory: product.subcategory,
              originalImagePath: product.originalImagePath,
            },
          })
          totalProducts++
        } catch (error) {
          console.error(`❌ Ошибка создания товара ${product.id}:`, error)
        }
      }
    }
  }

  // Подкатегории shedevry
  const extraDir = path.join(PRODUCTS_DIR, 'extra')
  if (fs.existsSync(extraDir)) {
    const extraFiles = fs
      .readdirSync(extraDir)
      .filter((f) => f.endsWith('.json'))

    for (const file of extraFiles) {
      const subcategory = path.basename(file, '.json')
      const filePath = path.join(extraDir, file)
      const products: ProductRecord[] = JSON.parse(
        fs.readFileSync(filePath, 'utf8')
      )

      console.log(
        `📦 Обрабатываем подкатегорию: ${subcategory} (${products.length} товаров)`
      )

      for (const product of products) {
        try {
          await prisma.product.create({
            data: {
              id: product.id,
              legacyId: product.legacyId,
              title: product.title,
              author: product.author,
              shortDescription: product.shortDescription,
              longDescription: product.longDescription,
              price: product.price,
              wholesalePrice1: product.wholesalePrice1,
              wholesalePrice2: product.wholesalePrice2,
              weight: product.weight,
              sku: product.sku,
              inStock: product.inStock,
              dimensions: product.dimensions,
              pages: product.pages,
              publisher: product.publisher,
              isbn: product.isbn,
              publishYear: product.publishYear,
              thumbnailUrl: product.images.thumbnail,
              largeImageUrl: product.images.large,
              category: product.category,
              subcategory: product.subcategory,
              originalImagePath: product.originalImagePath,
            },
          })
          totalProducts++
        } catch (error) {
          console.error(`❌ Ошибка создания товара ${product.id}:`, error)
        }
      }
    }
  }

  console.log(
    `🎉 Заполнение завершено! Добавлено ${totalProducts} товаров в базу данных.`
  )
}

// Создание базовых категорий
async function seedCategories() {
  const categories = [
    { slug: 'books', title: 'Книги' },
    { slug: 'buklets', title: 'Буклеты' },
    { slug: 'films', title: 'Фильмы' },
    { slug: 'cards', title: 'Открытки' },
    { slug: 'calendars', title: 'Календарики' },
    { slug: 'shedevry', title: 'Другие издания' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { title: category.title },
      create: { slug: category.slug, title: category.title },
    })
  }

  console.log('✅ Категории созданы')
}

async function main() {
  try {
    await seedCategories()
    await seedProducts()
  } catch (error) {
    console.error('❌ Ошибка заполнения БД:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
