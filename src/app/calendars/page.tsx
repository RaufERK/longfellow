import { prisma } from '@/lib/prisma'
import CompactCard from '@/components/CompactCard'
import PageHeader from '@/components/PageHeader'

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
    <div>
      <PageHeader titleImage='h_calendars.png' titleAlt='Календарики' />
      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        <div className='flex justify-end mb-8'>
          <a
            href='/legacy/calendars'
            className='text-blue-600 hover:text-blue-800 underline text-sm'
          >
            Старая версия страницы
          </a>
        </div>

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
