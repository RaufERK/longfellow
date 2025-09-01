import { prisma } from '@/lib/prisma'
import CompactCard from '@/components/CompactCard'
import PageHeader from '@/components/PageHeader'

export default async function CardsPage() {
  const cards = await prisma.product.findMany({
    where: {
      category: 'cards',
      price: { not: null },
      inStock: true,
    },
    orderBy: { legacyId: 'asc' },
  })

  return (
    <div>
      <PageHeader titleImage='h_faces.gif' titleAlt='Открытки' />
      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        <div className='flex justify-end mb-8'>
          <a
            href='/legacy/cards'
            className='text-blue-600 hover:text-blue-800 underline text-sm'
          >
            Старая версия страницы
          </a>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {cards.map((card) => (
            <CompactCard key={card.id} product={card} variant='cards' />
          ))}
        </div>

        {cards.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-xl text-gray-600'>Открытки не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
