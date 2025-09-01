import { prisma } from '@/lib/prisma'
import BookCard from '@/components/BookCard'
import PageHeader from '@/components/PageHeader'

export const dynamic = 'force-dynamic'

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
    <div className='bg-[#ccffcc]'>
      <PageHeader titleImage='h_books.gif' titleAlt='Книги' />
      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#ccffcc]'>
          {books.map((book) => (
            <BookCard key={book.id} product={book} />
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
