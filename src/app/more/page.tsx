import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductImage from '@/components/ProductImage'

const categories = [
  {
    id: '12',
    title: 'Изобилие',
    subcategory: 'abundance',
  },
  {
    id: '9',
    title: 'Индуизм',
    subcategory: 'hinduism',
  },
  {
    id: '13',
    title: 'Для детей',
    subcategory: 'for_children',
  },
  {
    id: '18',
    title: 'Психология',
    subcategory: 'psychology',
  },
  {
    id: '16',
    title: 'Христианство',
    subcategory: 'christianity',
  },
  {
    id: '11',
    title: 'Художественная литература',
    subcategory: 'fiction',
  },
]

export default async function MorePage() {
  const categoryPromises = categories.map(async (category) => {
    const items = await prisma.product.findMany({
      where: {
        subcategory: category.subcategory,
        price: { not: null },
        inStock: true,
      },
      orderBy: { legacyId: 'asc' },
    })

    return {
      ...category,
      items,
    }
  })

  const categoriesWithItems = await Promise.all(categoryPromises)

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold text-center mb-8'>Ещё книги</h1>

      {categoriesWithItems.map((category) => (
        <div key={category.id} className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-gray-800 border-b-2 border-gray-200 pb-4'>
            {category.title}
          </h2>

          {category.items.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-lg text-gray-600'>
                Товары в этой категории скоро появятся
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
              {category.items.map((item) => (
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
                      <p className='text-sm text-gray-600 italic'>
                        {item.author}
                      </p>
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
                      {item.publisher && (
                        <div>Издательство: {item.publisher}</div>
                      )}
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
      ))}
    </div>
  )
}
