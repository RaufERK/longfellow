'use client'

import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function ModeratorDashboard() {
  const handleLogout = async () => {
    try {
      await fetch('/api/moderator/logout', { method: 'POST' })
      window.location.href = '/moderator/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div
      className='min-h-screen bg-[#ccffcc]'
      style={{ fontFamily: 'Times, Times New Roman, serif' }}
    >
      <header className='bg-white shadow-md'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex justify-between items-center'>
          <h1 className='text-3xl font-bold text-green-800'>
            📊 Панель модератора
          </h1>
          <button
            onClick={handleLogout}
            className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200'
            style={{ fontSize: '18px' }}
          >
            🚪 Выйти
          </button>
        </div>
      </header>

      <nav className='bg-green-600 text-white'>
        <div className='max-w-6xl mx-auto px-4'>
          <ul className='flex space-x-8 py-4'>
            <li>
              <Link
                href='/moderator'
                className='hover:text-green-200 font-medium'
                style={{ fontSize: '18px' }}
              >
                🏠 Главная
              </Link>
            </li>
            <li>
              <Link
                href='/moderator/products'
                className='hover:text-green-200 font-medium'
                style={{ fontSize: '18px' }}
              >
                📚 Товары
              </Link>
            </li>
            <li>
              <Link
                href='/moderator/orders'
                className='hover:text-green-200 font-medium'
                style={{ fontSize: '18px' }}
              >
                🛒 Заказы
              </Link>
            </li>
            <li>
              <Link
                href='/moderator/stats'
                className='hover:text-green-200 font-medium'
                style={{ fontSize: '18px' }}
              >
                📈 Статистика
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className='max-w-6xl mx-auto px-4 py-8'>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Link href='/moderator/products'>
            <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 cursor-pointer'>
              <div className='text-center'>
                <div className='text-4xl mb-4'>📚</div>
                <h3 className='text-xl font-bold mb-2'>Управление товарами</h3>
                <p className='text-gray-600' style={{ fontSize: '18px' }}>
                  Создание, редактирование и удаление товаров
                </p>
              </div>
            </div>
          </Link>

          <Link href='/moderator/orders'>
            <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 cursor-pointer'>
              <div className='text-center'>
                <div className='text-4xl mb-4'>🛒</div>
                <h3 className='text-xl font-bold mb-2'>Заказы</h3>
                <p className='text-gray-600' style={{ fontSize: '18px' }}>
                  Просмотр и управление заказами
                </p>
              </div>
            </div>
          </Link>

          <Link href='/moderator/stats'>
            <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 cursor-pointer'>
              <div className='text-center'>
                <div className='text-4xl mb-4'>📈</div>
                <h3 className='text-xl font-bold mb-2'>Статистика</h3>
                <p className='text-gray-600' style={{ fontSize: '18px' }}>
                  Аналитика продаж и отчеты
                </p>
              </div>
            </div>
          </Link>

          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='text-center'>
              <div className='text-4xl mb-4'>⚙️</div>
              <h3 className='text-xl font-bold mb-2'>Система готова</h3>
              <p
                className='text-green-600 font-medium'
                style={{ fontSize: '18px' }}
              >
                Все функции активны
              </p>
            </div>
          </div>
        </div>

        <div className='mt-8 bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-2xl font-bold mb-4'>🚀 Быстрые действия</h2>
          <div className='space-y-3'>
            <Link
              href='/moderator/products/new'
              className='inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200'
              style={{ fontSize: '18px' }}
            >
              ➕ Добавить новый товар
            </Link>
            <div className='block'></div>
            <Link
              href='/moderator/products'
              className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200'
              style={{ fontSize: '18px' }}
            >
              📝 Редактировать товары
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
