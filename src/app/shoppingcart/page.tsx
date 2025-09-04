import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import SearchCartBar from '@/components/SearchCartBar'

export const dynamic = 'force-dynamic'

export default function ShoppingCartPage() {
  return (
    <div className='min-h-screen bg-[#ccffcc]'>
      <PageHeader titleImage='h_present.gif' titleAlt='Корзина товаров' />
      <SearchCartBar placeholder='Поиск товаров...' />

      <div className='py-8'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            {/* Заглушка для Этапа 1 */}
            <div className='bg-white rounded-lg shadow-lg p-6'>
              <h2
                className='text-2xl font-bold text-gray-800 mb-4'
                style={{
                  fontFamily: 'Times, Times New Roman',
                  fontSize: '24px',
                }}
              >
                Корзина товаров
              </h2>
              <p className='text-gray-600 mb-4' style={{ fontSize: '18px' }}>
                Этап 1: Базовая структура корзины готова
              </p>
              <p className='text-gray-600' style={{ fontSize: '18px' }}>
                Далее будем добавлять функциональность поэтапно...
              </p>
              <div className='mt-6'>
                <Link
                  href='/'
                  className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium'
                  style={{ fontSize: '18px' }}
                >
                  Вернуться в каталог
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
