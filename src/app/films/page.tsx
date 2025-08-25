import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductImage from '@/components/ProductImage'

export default async function FilmsPage() {
  const films = await prisma.product.findMany({
    where: {
      category: 'films',
      price: { not: null },
      inStock: true,
    },
    orderBy: { legacyId: 'asc' },
  })

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold text-center'>Фильмы</h1>
        <a
          href='/legacy/films'
          className='text-blue-600 hover:text-blue-800 underline text-sm'
        >
          Старая версия страницы
        </a>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {films.map((film) => (
          <Card
            key={film.id}
            className='overflow-hidden hover:shadow-lg transition-shadow'
          >
            <CardHeader className='p-4'>
              {film.thumbnailUrl && (
                <div className='relative h-64 mb-4'>
                  <ProductImage
                    src={film.thumbnailUrl}
                    alt={film.title}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                </div>
              )}
              <CardTitle className='text-lg font-semibold line-clamp-2'>
                {film.title}
              </CardTitle>
              {film.author && (
                <p className='text-sm text-gray-600 italic'>{film.author}</p>
              )}
            </CardHeader>
            <CardContent className='p-4 pt-0'>
              {film.shortDescription && (
                <div className='text-sm text-gray-600 line-clamp-3 mb-4'>
                  {film.shortDescription}
                </div>
              )}

              <div className='text-xs text-gray-500 mb-4 space-y-1'>
                {film.publisher && <div>Издательство: {film.publisher}</div>}
                {film.publishYear && <div>Год: {film.publishYear}</div>}
              </div>

              {film.price && (
                <div className='flex justify-between items-center'>
                  <span className='text-2xl font-bold text-green-600'>
                    {film.price} ₽
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

      {films.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-xl text-gray-600'>Фильмы не найдены</p>
        </div>
      )}
    </div>
  )
}
