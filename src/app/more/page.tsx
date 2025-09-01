import { prisma } from '@/lib/prisma'
import BookCard from '@/components/BookCard'
import PageHeader from '@/components/PageHeader'

export const dynamic = 'force-dynamic'

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
    <div className='bg-[#ccffcc]'>
      <PageHeader titleImage='h_dennion.gif' titleAlt='Другие издания' />
      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        {categoriesWithItems.map((category) => (
          <div key={category.id} className='mb-16'>
            <h2 className='text-3xl font-bold mb-8 text-green-800'>
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
                  <BookCard key={item.id} product={item} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
