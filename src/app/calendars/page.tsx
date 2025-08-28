import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductImage from '@/components/ProductImage'
import PageHeader from '@/components/PageHeader'

export default async function CalendarsPage() {
  const calendars = await prisma.product.findMany({
    where: {
      category: 'calendars',
      price: { not: null },
      inStock: true,
    },
    orderBy: { legacyId: 'asc' },
  })

  return (
    <div>
      <PageHeader titleImage='h_calendars.gif' titleAlt='Календарики' />
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-end mb-8'>
          <a
            href='/legacy/calendars'
            className='text-blue-600 hover:text-blue-800 underline text-sm'
          >
            Старая версия страницы
          </a>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'>
          {calendars.map((calendar) => (
            <Card
              key={calendar.id}
              className='overflow-hidden hover:shadow-lg transition-shadow'
            >
              <CardHeader className='p-4'>
                {calendar.thumbnailUrl && (
                  <div className='relative h-40 mb-4'>
                    <ProductImage
                      src={calendar.thumbnailUrl}
                      alt={calendar.title}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw'
                    />
                  </div>
                )}
                <CardTitle className='text-sm font-semibold line-clamp-2'>
                  {calendar.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                {calendar.shortDescription && (
                  <div className='text-xs text-gray-600 line-clamp-2 mb-3'>
                    {calendar.shortDescription}
                  </div>
                )}

                {calendar.dimensions && (
                  <div className='text-xs text-gray-500 mb-2'>
                    {calendar.dimensions}
                  </div>
                )}

                {calendar.price && (
                  <div className='flex justify-between items-center'>
                    <span className='text-lg font-bold text-green-600'>
                      {calendar.price} ₽
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

        {calendars.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-xl text-gray-600'>Календарики не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
