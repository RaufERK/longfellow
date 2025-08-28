import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductImage from '@/components/ProductImage'
import PageHeader from '@/components/PageHeader'

export default async function HomePage() {
  const books = await prisma.product.findMany({
    where: {
      category: 'books',
      price: { not: null },
      inStock: true,
    },
    orderBy: { legacyId: 'asc' },
  })

  return (
    <div>
      <PageHeader titleImage='h_books.gif' titleAlt='Книги' />
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {books.map((book) => (
            <Card
              key={book.id}
              className='overflow-hidden hover:shadow-lg transition-shadow'
            >
              <CardHeader className='p-4'>
                {book.thumbnailUrl && (
                  <div className='relative h-64 mb-4'>
                    <ProductImage
                      src={book.thumbnailUrl}
                      alt={book.title}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  </div>
                )}
                <CardTitle className='text-lg font-semibold line-clamp-2'>
                  {book.title}
                </CardTitle>
                {book.author && (
                  <p className='text-sm text-gray-600 italic'>{book.author}</p>
                )}
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                {book.shortDescription && (
                  <div className='text-sm text-gray-600 line-clamp-3 mb-4'>
                    {book.shortDescription}
                  </div>
                )}

                <div className='text-xs text-gray-500 mb-4 space-y-1'>
                  {book.dimensions && <div>Размер: {book.dimensions}</div>}
                  {book.pages && <div>Страниц: {book.pages}</div>}
                  {book.publisher && <div>Издательство: {book.publisher}</div>}
                  {book.publishYear && <div>Год: {book.publishYear}</div>}
                  {book.isbn && <div>ISBN: {book.isbn}</div>}
                </div>

                {book.price && (
                  <div className='flex justify-between items-center'>
                    <span className='text-2xl font-bold text-green-600'>
                      {book.price} ₽
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

        {books.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-xl text-gray-600'>Книги не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
