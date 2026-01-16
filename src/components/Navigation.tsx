import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className='bg-white shadow-sm border-b'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <Link href='/' className='text-xl font-bold text-gray-800'>
            Издательство Лонгфелло
          </Link>
          <div className='flex space-x-8'>
            <Link
              href='/'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Книги
            </Link>
            <Link
              href='/buklets'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Буклеты
            </Link>
            <Link
              href='/more'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Ещё книги
            </Link>
            <Link
              href='/films'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Фильмы
            </Link>
            <Link
              href='/cards'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Открытки
            </Link>
            <Link
              href='/calendars'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Календарики
            </Link>
            <Link
              href='/presentations'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Презентации
            </Link>
            <Link
              href='/authors'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Авторы
            </Link>
            <Link
              href='/contacts'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Контакты
            </Link>
            <Link
              href='/seminar'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Выездной семинар
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
