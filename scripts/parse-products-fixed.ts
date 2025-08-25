import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'
import sharp from 'sharp'

type ProductRecord = {
  id: string
  legacyId: number | null
  title: string
  author: string | null
  shortDescription: string | null
  longDescription: string | null
  price: number | null
  wholesalePrice1: number | null // зарезервировано
  wholesalePrice2: number | null // зарезервировано
  weight: number | null // зарезервировано (в граммах)
  sku: string | null // зарезервировано
  inStock: boolean
  dimensions: string | null
  pages: number | null
  publisher: string | null
  isbn: string | null
  publishYear: number | null
  images: {
    thumbnail: string | null
    large: string | null // зарезервировано
  }
  category: string
  subcategory: string | null
  originalImagePath: string | null
}

const LEGACY_ROOT = path.join(process.cwd(), 'public', 'legacy')
const OUTPUT_DIR = path.join(process.cwd(), 'products')
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'products')

// Создаем директории
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Маппинг cat_id к подкатегориям
const SUBCATEGORY_MAP: Record<string, string> = {
  '9': 'hinduism',
  '11': 'fiction',
  '12': 'abundance',
  '13': 'for_children',
  '16': 'christianity',
  '18': 'psychology',
}

// Извлекаем ID из имени файла
function extractIdFromFilename(file: string): {
  id: number | null
  type: 'item' | 'cat'
} {
  const itemMatch = file.match(/index\.html@item_id=(\d+)\.html$/)
  if (itemMatch) return { id: Number(itemMatch[1]), type: 'item' }

  const catMatch = file.match(/index\.html@cat_id=(\d+)\.html$/)
  if (catMatch) return { id: Number(catMatch[1]), type: 'cat' }

  return { id: null, type: 'item' }
}

// Очистка текста
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

// Извлечение автора из заголовка
function extractAuthor(title: string): {
  cleanTitle: string
  author: string | null
} {
  // Паттерны для извлечения автора
  const patterns = [
    /^(.+?)\s+([А-ЯЁ][а-яё]+\s+[А-ЯЁ]\.\s*[А-ЯЁ][а-яё]+(?:\s+и\s+[А-ЯЁ][а-яё]+\s+[А-ЯЁ]\.\s*[А-ЯЁ][а-яё]+)?)\s*$/,
    /^(.+?)\s+(Марк\s+[А-ЯЁ]\.\s*Профет(?:\s+и\s+Элизабет\s+Клэр\s+Профет)?)\s*$/,
    /^(.+?)\s+([А-ЯЁ][а-яё]+)\s*$/,
  ]

  for (const pattern of patterns) {
    const match = title.match(pattern)
    if (match) {
      return { cleanTitle: match[1].trim(), author: match[2].trim() }
    }
  }

  return { cleanTitle: title, author: null }
}

// Извлечение числовых данных из мета-описания
function extractMetaData(metaDescription: string) {
  const data: any = {}

  // Размеры (например: "150/213мм", "130/205мм")
  const dimensionsMatch = metaDescription.match(/(\d+\/\d+мм)/i)
  if (dimensionsMatch) data.dimensions = dimensionsMatch[1]

  // Страницы (например: "624 страницы", "64 страницы")
  const pagesMatch = metaDescription.match(/(\d+)\s+страниц?[ыа]?/i)
  if (pagesMatch) data.pages = Number(pagesMatch[1])

  // ISBN
  const isbnMatch = metaDescription.match(/ISBN[\s:]*([0-9-]+)/i)
  if (isbnMatch) data.isbn = isbnMatch[1]

  // Год издания
  const yearMatch = metaDescription.match(/(\d{4})\s*г/i)
  if (yearMatch) data.publishYear = Number(yearMatch[1])

  // Издательство (часто в конце описания)
  if (metaDescription.includes('Лонгфелло')) data.publisher = 'Лонгфелло'
  if (metaDescription.includes('Форинг')) data.publisher = 'Форинг'

  return data
}

// Парсинг одного HTML файла товара
function parseProductFromItemFile(
  filePath: string,
  category: string,
  subcategory?: string
): ProductRecord | null {
  const html = fs.readFileSync(filePath, 'utf8')
  const $ = cheerio.load(html)

  const { id: legacyId } = extractIdFromFilename(path.basename(filePath))

  // Заголовок из title тега
  let rawTitle = cleanText($('title').text())
    .replace(/^Издательство Лонгфелло :: [^:]+:: /, '')
    .replace(/^Издательство Лонгфелло :: /, '')

  // Альтернативный заголовок из alt атрибута изображения
  const altTitle = $('img[src*="shopimg"]').first().attr('alt')
  if (altTitle && altTitle.length > rawTitle.length) {
    rawTitle = cleanText(altTitle)
  }

  const { cleanTitle, author } = extractAuthor(rawTitle)

  // Цена - ищем в HTML
  let price: number | null = null
  const priceText = $('body')
    .html()
    ?.match(/(\d+)\s*руб\./i)
  if (priceText) price = Number(priceText[1])

  // Изображение
  let originalImagePath: string | null = null
  const imgSrc = $('img[src*="shopimg"]').first().attr('src')
  if (imgSrc) {
    originalImagePath = imgSrc.startsWith('/') ? imgSrc : `/${imgSrc}`
    // Нормализация пути
    originalImagePath = originalImagePath
      .replace(/^\/+/, '/')
      .replace(/^\/\.\.\//, '/')
  }

  // Мета-описание для дополнительных данных
  const metaDescription = cleanText(
    $('meta[name="description"]').attr('content') || ''
  )
  const metaData = extractMetaData(metaDescription)

  // Краткое и полное описание
  const shortDescription =
    metaDescription.slice(0, 200) + (metaDescription.length > 200 ? '...' : '')
  const longDescription = metaDescription

  // Генерируем уникальный ID
  const productId = `${category}_${legacyId || Date.now()}`

  return {
    id: productId,
    legacyId,
    title: cleanTitle || 'Без названия',
    author,
    shortDescription: shortDescription || null,
    longDescription: longDescription || null,
    price,
    wholesalePrice1: null,
    wholesalePrice2: null,
    weight: null,
    sku: null,
    inStock: true, // по умолчанию в наличии
    dimensions: metaData.dimensions || null,
    pages: metaData.pages || null,
    publisher: metaData.publisher || null,
    isbn: metaData.isbn || null,
    publishYear: metaData.publishYear || null,
    images: {
      thumbnail: originalImagePath
        ? `/images/products/${category}/thumbnails/${legacyId}.webp`
        : null,
      large: null, // зарезервировано
    },
    category,
    subcategory: subcategory || null,
    originalImagePath,
  }
}

// Извлечение товаров из HTML списка
function extractProductsFromHtmlList(
  htmlPath: string,
  category: string,
  subcategory?: string
): ProductRecord[] {
  const html = fs.readFileSync(htmlPath, 'utf8')
  const $ = cheerio.load(html)
  const products: ProductRecord[] = []

  // Ищем все изображения товаров
  $('img[src*="shopimg/"]').each((_, imgElement) => {
    const imgSrc = $(imgElement).attr('src') || ''
    const imgAlt = $(imgElement).attr('alt') || ''

    // Извлекаем ID из имени файла изображения (например: 563s.jpg -> 563)
    const idMatch = imgSrc.match(/\/(\d+)s\.jpg$/)
    if (!idMatch) return

    const legacyId = Number(idMatch[1])

    // Ищем родительские элементы для получения контекста
    const imgTable = $(imgElement).closest('table')
    const productRow = imgTable.closest('tr')

    // Поиск заголовка в соседней ячейке с описанием
    let title = ''
    const titleElement = productRow.find('b').first()
    if (titleElement.length) {
      title = cleanText(titleElement.text())
    }

    if (!title && imgAlt) {
      title = cleanText(imgAlt)
    }

    // Поиск цены в зеленом шрифте
    let price: number | null = null
    const priceElement = imgTable.find('font[color="Green"]').first()
    if (priceElement.length) {
      const priceText = priceElement.text()
      const priceMatch = priceText.match(/(\d+)\s*руб\./i)
      if (priceMatch) price = Number(priceMatch[1])
    }

    // Поиск описания
    let description = ''
    const descElement = productRow.find('a.firstline').first()
    if (descElement.length) {
      description = cleanText(descElement.text())
    }

    // Обработка изображения
    let originalImagePath: string | null = null
    if (imgSrc) {
      originalImagePath = imgSrc.startsWith('/') ? imgSrc : `/${imgSrc}`
      originalImagePath = originalImagePath
        .replace(/^\/+/, '/')
        .replace(/^\/\.\.\//, '/')
    }

    if (title && price && price > 0) {
      const { cleanTitle, author } = extractAuthor(title)
      const productId = `${category}_${legacyId}`

      // Краткое описание
      let shortDescription = description
      if (shortDescription.length > 200) {
        shortDescription = shortDescription.slice(0, 200) + '...'
      }

      products.push({
        id: productId,
        legacyId,
        title: cleanTitle,
        author,
        shortDescription: shortDescription || null,
        longDescription: description || null,
        price,
        wholesalePrice1: null,
        wholesalePrice2: null,
        weight: null,
        sku: null,
        inStock: true,
        dimensions: null,
        pages: null,
        publisher: null,
        isbn: null,
        publishYear: null,
        images: {
          thumbnail: originalImagePath
            ? `/images/products/${category}/thumbnails/${legacyId}.webp`
            : null,
          large: null,
        },
        category,
        subcategory: subcategory || null,
        originalImagePath,
      })
    }
  })

  return products
}

// Конвертация изображения в WebP
async function convertImageToWebP(inputPath: string, outputPath: string) {
  try {
    ensureDir(path.dirname(outputPath))
    await sharp(inputPath)
      .resize(100, 100, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(outputPath)
    return true
  } catch (error) {
    console.error(`Ошибка конвертации ${inputPath}:`, error)
    return false
  }
}

// Основная функция парсинга
async function main() {
  ensureDir(OUTPUT_DIR)
  ensureDir(path.join(OUTPUT_DIR, 'extra'))
  ensureDir(IMAGES_DIR)

  const categories = {
    books: { dir: 'books', files: [] as string[] },
    buklets: { dir: 'buklets', files: [] as string[] },
    films: { dir: 'films', files: [] as string[] },
    cards: { dir: 'cards', files: [] as string[] },
    calendars: { dir: 'calendars', files: [] as string[] },
  }

  // Собираем файлы по категориям (отдельные страницы товаров)
  for (const [category, info] of Object.entries(categories)) {
    const categoryDir = path.join(LEGACY_ROOT, info.dir)
    if (fs.existsSync(categoryDir)) {
      const files = fs
        .readdirSync(categoryDir)
        .filter((f) => f.match(/index\.html@item_id=\d+\.html$/))
        .map((f) => path.join(categoryDir, f))
      info.files = files
    }
  }

  // Парсинг товаров из отдельных файлов
  for (const [category, info] of Object.entries(categories)) {
    const products: ProductRecord[] = []

    console.log(`Обработка категории: ${category}`)
    ensureDir(path.join(IMAGES_DIR, category, 'thumbnails'))

    // Парсинг из отдельных файлов товаров
    for (const filePath of info.files) {
      const product = parseProductFromItemFile(filePath, category)
      if (product && product.price) {
        products.push(product)

        // Конвертируем изображение
        if (product.originalImagePath && product.legacyId) {
          const sourcePath = path.join(
            LEGACY_ROOT,
            product.originalImagePath.replace(/^\/+/, '')
          )
          const targetPath = path.join(
            IMAGES_DIR,
            category,
            'thumbnails',
            `${product.legacyId}.webp`
          )

          if (fs.existsSync(sourcePath)) {
            await convertImageToWebP(sourcePath, targetPath)
            console.log(`✅ Конвертировано: ${product.legacyId}.webp`)
          }
        }
      }
    }

    // Парсинг из списка товаров в основной странице категории
    const categoryListPath = path.join(LEGACY_ROOT, `${info.dir}.html`)
    if (fs.existsSync(categoryListPath)) {
      const listProducts = extractProductsFromHtmlList(
        categoryListPath,
        category
      )
      for (const product of listProducts) {
        if (
          product.price &&
          !products.find((p) => p.legacyId === product.legacyId)
        ) {
          products.push(product)

          // Конвертируем изображение
          if (product.originalImagePath && product.legacyId) {
            const sourcePath = path.join(
              LEGACY_ROOT,
              product.originalImagePath.replace(/^\/+/, '')
            )
            const targetPath = path.join(
              IMAGES_DIR,
              category,
              'thumbnails',
              `${product.legacyId}.webp`
            )

            if (fs.existsSync(sourcePath)) {
              await convertImageToWebP(sourcePath, targetPath)
              console.log(
                `✅ Конвертировано из списка: ${product.legacyId}.webp`
              )
            }
          }
        }
      }
    }

    // Сохраняем JSON файл
    if (products.length > 0) {
      const outputPath = path.join(OUTPUT_DIR, `${category}.json`)
      fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf8')
      console.log(`📁 Сохранено ${products.length} товаров в ${category}.json`)
    }
  }

  // Обработка shedevry подкатегорий
  const shedevryDir = path.join(LEGACY_ROOT, 'shedevry')
  if (fs.existsSync(shedevryDir)) {
    const shedevryFiles = fs
      .readdirSync(shedevryDir)
      .filter((f) => f.match(/index\.html@cat_id=\d+\.html$/))

    for (const file of shedevryFiles) {
      const { id: catId } = extractIdFromFilename(file)
      const subcategory = SUBCATEGORY_MAP[catId?.toString() || '']

      if (subcategory) {
        console.log(`Обработка подкатегории: ${subcategory} (cat_id=${catId})`)
        const filePath = path.join(shedevryDir, file)

        // Извлекаем товары из HTML списка
        const products = extractProductsFromHtmlList(
          filePath,
          'book',
          subcategory
        )

        // Создаем директорию для изображений
        ensureDir(path.join(IMAGES_DIR, 'book', 'thumbnails'))

        // Конвертируем изображения
        for (const product of products) {
          if (product.originalImagePath && product.legacyId) {
            const sourcePath = path.join(
              LEGACY_ROOT,
              product.originalImagePath.replace(/^\/+/, '')
            )
            const targetPath = path.join(
              IMAGES_DIR,
              'book',
              'thumbnails',
              `${product.legacyId}.webp`
            )

            if (fs.existsSync(sourcePath)) {
              await convertImageToWebP(sourcePath, targetPath)
              console.log(
                `✅ Конвертировано ${subcategory}: ${product.legacyId}.webp`
              )
            }
          }
        }

        // Сохраняем JSON файл
        const outputPath = path.join(OUTPUT_DIR, 'extra', `${subcategory}.json`)
        fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf8')
        console.log(
          `📁 Сохранено ${products.length} товаров в extra/${subcategory}.json`
        )
      }
    }
  }

  console.log('🎉 Парсинг завершен!')
}

// Проверяем наличие sharp
async function checkDependencies() {
  try {
    const sharp = await import('sharp')
    return true
  } catch (error) {
    console.error('❌ Не найден пакет sharp. Установите его: npm install sharp')
    return false
  }
}

if (require.main === module) {
  checkDependencies().then((hasSharp) => {
    if (hasSharp) {
      main().catch(console.error)
    } else {
      console.log('Установите зависимости и запустите скрипт снова')
    }
  })
}

export { parseProductFromItemFile as parseProduct, type ProductRecord }
