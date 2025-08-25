import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export default async function BukletsPage() {
  const buklets = await prisma.book.findMany({
    where: {
      htmlPath: { contains: '/buklets/' },
      priceRub: { not: null },
      coverUrl: { not: null },
      NOT: {
        description: { contains: '404 Not Found' },
      },
    },
    orderBy: { id: 'asc' },
  })

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold mb-8 text-center'>Буклеты</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {buklets.map((buklet) => (
          <Card
            key={buklet.id}
            className='overflow-hidden hover:shadow-lg transition-shadow'
          >
            <CardHeader className='p-4'>
              {buklet.coverUrl && (
                <div className='relative h-64 mb-4'>
                  <Image
                    src={buklet.coverUrl}
                    alt={buklet.title}
                    fill
                    className='object-contain'
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
              <CardTitle className='text-lg font-semibold line-clamp-2'>
                {buklet.title.replace(
                  'Издательство Лонгфелло :: Буклеты :: ',
                  ''
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4 pt-0'>
              <div className='text-sm text-gray-600 line-clamp-3 mb-4'>
                {buklet.description?.replace(
                  /Издательство Лонгфелло.*?kniga@longfellow\.ru\.\s*/,
                  ''
                )}
              </div>
              {buklet.priceRub && (
                <div className='flex justify-between items-center'>
                  <span className='text-2xl font-bold text-green-600'>
                    {buklet.priceRub} ₽
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
    </div>
  )
}
