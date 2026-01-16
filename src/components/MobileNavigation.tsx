import Link from 'next/link'

const menuItems = [
  { href: '/', label: 'Книги' },
  { href: '/buklets', label: 'Буклеты' },
  { href: '/more', label: 'Ещё книги' },
  { href: '/films', label: 'Фильмы' },
  { href: '/cards', label: 'Открытки' },
  { href: '/calendars', label: 'Календарики' },
  { href: '/presentations', label: 'Презентации' },
  { href: '/authors', label: 'Авторы' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/seminar', label: 'Выездной семинар' },
]

export default function MobileNavigation() {
  return (
    <div className='lg:hidden bg-white shadow-sm border-b sticky top-0 z-50 bg-[#ccffcc]'>
      <div className='px-4 py-2'>
        <Link href='/' className='text-lg font-bold text-gray-800 block mb-2'>
          Издательство Лонгфелло
        </Link>

        {/* Горизонтальный скролл для мобильного меню */}
        <div className='flex gap-4 overflow-x-auto pb-2 scrollbar-hide'>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap'
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
