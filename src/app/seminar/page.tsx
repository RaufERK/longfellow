import PageHeader from '@/components/PageHeader'
import SearchCartBar from '@/components/SearchCartBar'

export const dynamic = 'force-dynamic'

export default function SeminarPage() {
  return (
    <div className='bg-[#ccffcc]'>
      <PageHeader titleText='Выездной семинар' />
      <SearchCartBar placeholder='Поиск...' />
      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        <div className='max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6'>
          <div className='space-y-3'>
            <h2 className='text-2xl font-semibold text-gray-900'>
              Выездной семинар
            </h2>
            <p className='text-[18px] text-gray-800 leading-relaxed'>
              Общество с ограниченной ответственностью ИД «Лонгфелло» проводит
              выездное мероприятие 29 марта - 5 апреля 2026 года.
            </p>
          </div>

          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-gray-900'>Прайс-лист</h3>

            <div className='space-y-2 text-[18px] text-gray-800 leading-relaxed'>
              <p className='font-semibold text-gray-900'>Взрослые 2, 3 корпус:</p>
              <p>Одноместное размещение — 35&apos;700 рублей.</p>
              <p>Двухместное размещение — 31&apos;500 рублей</p>
            </div>

            <div className='space-y-2 text-[18px] text-gray-800 leading-relaxed'>
              <p className='font-semibold text-gray-900'>Взрослые 4 корпус:</p>
              <p>Одноместное размещение — 40&apos;250 рублей</p>
              <p>Двухместное размещение — 36&apos;500 рублей</p>
              <p>Полулюкс однокомнатный — 41&apos;300 рублей</p>
            </div>

            <div className='space-y-2 text-[18px] text-gray-800 leading-relaxed'>
              <p className='font-semibold text-gray-900'>Дети:</p>
              <p>До 12 лет — 12&apos;600 рублей</p>
              <p>Лица с 12 до 18 лет — 25&apos;700 рублей</p>
            </div>

            <div className='mt-6 border-t border-gray-200 pt-6'>
              <div className='bg-green-50 border border-green-200 rounded-lg p-6 text-center'>
                <p className='text-[18px] text-gray-800 mb-3'>
                  По вопросам участия пишите нам на почту
                </p>
                <a
                  href='mailto:kniga@longfellow.ru'
                  className='inline-block text-[18px] font-semibold text-green-800 underline hover:text-green-900 transition-colors'
                  style={{ fontFamily: 'Times, "Times New Roman", serif' }}
                >
                  kniga@longfellow.ru
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
