import Link from 'next/link'

const links = [
  { href: '/', label: 'Главная' },
  { href: '/books', label: 'Книги' },
  { href: '/buklets', label: 'Буклеты' },
  { href: '/shedevry', label: 'Ещё книги' },
  { href: '/films', label: 'Фильмы' },
  { href: '/cards', label: 'Открытки' },
  { href: '/calendars', label: 'Календарики' },
  { href: '/authors', label: 'Авторы' },
  { href: '/contacts', label: 'Контакты' },
]

export function MainNav() {
  return (
    <nav className='w-full border-b bg-background'>
      <div className='mx-auto max-w-6xl px-4 h-12 flex items-center gap-4 overflow-x-auto'>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className='text-sm hover:underline whitespace-nowrap'
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
