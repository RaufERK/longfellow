import { prisma } from '@/lib/prisma'
import BookCard from '@/components/BookCard'
import PageHeader from '@/components/PageHeader'

export const dynamic = 'force-dynamic'

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
    <div className='bg-[#ccffcc]'>
      <PageHeader titleImage='h_dennion.gif' titleAlt='Фильмы' />
      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {films.map((film) => (
            <BookCard key={film.id} product={film} />
          ))}
        </div>

        {films.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-xl text-gray-600'>Фильмы не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
