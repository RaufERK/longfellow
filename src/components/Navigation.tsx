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
              href='/books'
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
              href='/shedevry?cat_id=12'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Изобилие
            </Link>
            <Link
              href='/shedevry?cat_id=9'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Индуизм
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
