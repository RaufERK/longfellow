import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductImage from '@/components/ProductImage'
import PageHeader from '@/components/PageHeader'

export default async function BukletsPage() {
  const buklets = await prisma.product.findMany({
    where: {
      category: 'buklets',
      price: { not: null },
      inStock: true,
    },
    orderBy: { legacyId: 'asc' },
  })

  return (
    <div>
      <PageHeader titleImage='h_booklets.gif' titleAlt='Буклеты' />
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-end mb-8'>
          <a
            href='/legacy/buklets'
            className='text-blue-600 hover:text-blue-800 underline text-sm'
          >
            Старая версия страницы
          </a>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {buklets.map((buklet) => (
            <Card
              key={buklet.id}
              className='overflow-hidden hover:shadow-lg transition-shadow'
            >
              <CardHeader className='p-4'>
                {buklet.thumbnailUrl && (
                  <div className='relative h-64 mb-4'>
                    <ProductImage
                      src={buklet.thumbnailUrl}
                      alt={buklet.title}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  </div>
                )}
                <CardTitle className='text-lg font-semibold line-clamp-2'>
                  {buklet.title}
                </CardTitle>
                {buklet.author && (
                  <p className='text-sm text-gray-600 italic'>
                    {buklet.author}
                  </p>
                )}
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                {buklet.shortDescription && (
                  <div className='text-sm text-gray-600 line-clamp-3 mb-4'>
                    {buklet.shortDescription}
                  </div>
                )}

                <div className='text-xs text-gray-500 mb-4 space-y-1'>
                  {buklet.dimensions && <div>Размер: {buklet.dimensions}</div>}
                  {buklet.pages && <div>Страниц: {buklet.pages}</div>}
                  {buklet.publisher && (
                    <div>Издательство: {buklet.publisher}</div>
                  )}
                  {buklet.publishYear && <div>Год: {buklet.publishYear}</div>}
                </div>

                {buklet.price && (
                  <div className='flex justify-between items-center'>
                    <span className='text-2xl font-bold text-green-600'>
                      {buklet.price} ₽
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

        {buklets.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-xl text-gray-600'>Буклеты не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
