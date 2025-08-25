import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface ShedevryPageProps {
  searchParams: Promise<{ cat_id?: string }>
}

const categoryTitles = {
  '9': 'Индуизм',
  '12': 'Изобилие',
}

export default async function ShedevryPage({
  searchParams,
}: ShedevryPageProps) {
  const { cat_id } = await searchParams

  if (!cat_id || !categoryTitles[cat_id as keyof typeof categoryTitles]) {
    notFound()
  }

  const title = categoryTitles[cat_id as keyof typeof categoryTitles]

  // Поиск товаров по cat_id в htmlPath
  const items = await prisma.book.findMany({
    where: {
      OR: [
        { htmlPath: { contains: `/shedevry/index.html@cat_id=${cat_id}` } },
        { htmlPath: { contains: `cat_id=${cat_id}` } },
      ],
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
      <h1 className='text-4xl font-bold mb-8 text-center'>{title}</h1>

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
                {item.coverUrl && (
                  <div className='relative h-64 mb-4'>
                    <Image
                      src={item.coverUrl}
                      alt={item.title}
                      fill
                      className='object-contain'
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <CardTitle className='text-lg font-semibold line-clamp-2'>
                  {item.title.replace(
                    'Издательство Лонгфелло :: Книги :: ',
                    ''
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                <div className='text-sm text-gray-600 line-clamp-3 mb-4'>
                  {item.description?.replace(
                    /Издательство Лонгфелло.*?kniga@longfellow\.ru\.\s*/,
                    ''
                  )}
                </div>
                {item.priceRub && (
                  <div className='flex justify-between items-center'>
                    <span className='text-2xl font-bold text-green-600'>
                      {item.priceRub} ₽
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
