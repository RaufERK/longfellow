import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductImage from '@/components/ProductImage'
import PageHeader from '@/components/PageHeader'

export default async function CardsPage() {
  const cards = await prisma.product.findMany({
    where: {
      category: 'cards',
      price: { not: null },
      inStock: true,
    },
    orderBy: { legacyId: 'asc' },
  })

  return (
    <div>
      <PageHeader titleImage='h_faces.gif' titleAlt='Открытки' />
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-end mb-8'>
          <a
            href='/legacy/cards'
            className='text-blue-600 hover:text-blue-800 underline text-sm'
          >
            Старая версия страницы
          </a>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {cards.map((card) => (
            <Card
              key={card.id}
              className='overflow-hidden hover:shadow-lg transition-shadow'
            >
              <CardHeader className='p-4'>
                {card.thumbnailUrl && (
                  <div className='relative h-48 mb-4'>
                    <ProductImage
                      src={card.thumbnailUrl}
                      alt={card.title}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                    />
                  </div>
                )}
                <CardTitle className='text-sm font-semibold line-clamp-2'>
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                {card.shortDescription && (
                  <div className='text-xs text-gray-600 line-clamp-2 mb-3'>
                    {card.shortDescription}
                  </div>
                )}

                {card.price && (
                  <div className='flex justify-between items-center'>
                    <span className='text-lg font-bold text-green-600'>
                      {card.price} ₽
                    </span>
                    <button className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors'>
                      В корзину
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {cards.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-xl text-gray-600'>Открытки не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
