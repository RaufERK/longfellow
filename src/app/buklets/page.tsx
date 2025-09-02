import { prisma } from '@/lib/prisma'
import BookCard from '@/components/BookCard'
import PageHeader from '@/components/PageHeader'
import SearchCartBar from '@/components/SearchCartBar'

export const dynamic = 'force-dynamic'

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
    <div className='bg-[#ccffcc]'>
      <PageHeader titleImage='h_booklets.gif' titleAlt='Буклеты' />
      <SearchCartBar placeholder='Поиск буклетов...' />
      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {buklets.map((buklet) => (
            <BookCard key={buklet.id} product={buklet} />
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
