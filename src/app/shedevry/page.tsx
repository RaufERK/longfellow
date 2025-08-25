import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductImage from '@/components/ProductImage'
import { notFound } from 'next/navigation'

interface ShedevryPageProps {
  searchParams: Promise<{ cat_id?: string }>
}

const categoryTitles = {
  '9': 'Индуизм',
  '11': 'Художественная литература',
  '12': 'Изобилие',
  '13': 'Для детей',
  '16': 'Христианство',
  '18': 'Психология',
}

const subcategoryMap = {
  '9': 'hinduism',
  '11': 'fiction',
  '12': 'abundance',
  '13': 'for_children',
  '16': 'christianity',
  '18': 'psychology',
}

export default async function ShedevryPage({
  searchParams,
}: ShedevryPageProps) {
  const { cat_id } = await searchParams

  if (!cat_id || !categoryTitles[cat_id as keyof typeof categoryTitles]) {
    notFound()
  }

  const title = categoryTitles[cat_id as keyof typeof categoryTitles]
  const subcategory = subcategoryMap[cat_id as keyof typeof subcategoryMap]

  const items = await prisma.product.findMany({
    where: {
      subcategory,
      price: { not: null },
      inStock: true,
    },
    orderBy: { legacyId: 'asc' },
  })

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold text-center'>{title}</h1>
        <a
          href='/legacy/shedevry'
          className='text-blue-600 hover:text-blue-800 underline text-sm'
        >
          Старая версия страницы
        </a>
      </div>

      {items.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-xl text-gray-600'>
            Товары в этой категории скоро появятся
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {items.map((item) => (
            <Card
              key={item.id}
              className='overflow-hidden hover:shadow-lg transition-shadow'
            >
              <CardHeader className='p-4'>
                {item.thumbnailUrl && (
                  <div className='relative h-64 mb-4'>
                    <ProductImage
                      src={item.thumbnailUrl}
                      alt={item.title}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  </div>
                )}
                <CardTitle className='text-lg font-semibold line-clamp-2'>
                  {item.title}
                </CardTitle>
                {item.author && (
                  <p className='text-sm text-gray-600 italic'>{item.author}</p>
                )}
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                {item.shortDescription && (
                  <div className='text-sm text-gray-600 line-clamp-3 mb-4'>
                    {item.shortDescription}
                  </div>
                )}

                <div className='text-xs text-gray-500 mb-4 space-y-1'>
                  {item.dimensions && <div>Размер: {item.dimensions}</div>}
                  {item.pages && <div>Страниц: {item.pages}</div>}
                  {item.publisher && <div>Издательство: {item.publisher}</div>}
                  {item.publishYear && <div>Год: {item.publishYear}</div>}
                  {item.isbn && <div>ISBN: {item.isbn}</div>}
                </div>

                {item.price && (
                  <div className='flex justify-between items-center'>
                    <span className='text-2xl font-bold text-green-600'>
                      {item.price} ₽
                    </span>
                    <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors'>
                      В корзину
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
