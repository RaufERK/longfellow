import { prisma } from '@/lib/prisma'
import CompactCard from '@/components/CompactCard'
import PageHeader from '@/components/PageHeader'
import SearchCartBar from '@/components/SearchCartBar'

export const dynamic = 'force-dynamic'

export default async function CalendarsPage() {
  const calendars = await prisma.product.findMany({
    where: {
      category: 'calendars',
      price: { not: null },
      inStock: true,
    },
    orderBy: { legacyId: 'asc' },
  })

  return (
    <div className='bg-[#ccffcc]'>
      <PageHeader titleImage='h_calendars.png' titleAlt='Календарики' />
      <SearchCartBar placeholder='Поиск календариков...' />
      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'>
          {calendars.map((calendar) => (
            <CompactCard
              key={calendar.id}
              product={calendar}
              variant='calendars'
            />
          ))}
        </div>

        {calendars.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-xl text-gray-600'>Календарики не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
