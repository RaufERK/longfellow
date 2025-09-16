'use client'

import Link from 'next/link'

interface ModeratorNavigationProps {
  currentPage?: string
}

export default function ModeratorNavigation({
  currentPage,
}: ModeratorNavigationProps) {
  const navItems = [
    { href: '/moderator', label: '🏠 Главная', key: 'main' },
    { href: '/moderator/products', label: '📚 Товары', key: 'products' },
    { href: '/moderator/orders', label: '🛒 Заказы', key: 'orders' },
    { href: '/moderator/stats', label: '📈 Статистика', key: 'stats' },
    { href: '/', label: '🌐 Сайт', key: 'site' },
  ]

  return (
    <nav className='bg-green-600 text-white'>
      <div className='max-w-6xl mx-auto px-4'>
        <ul className='flex space-x-8 py-4'>
          {navItems.map((item) => (
            <li key={item.key}>
              {currentPage === item.key ? (
                <span
                  className='text-green-200 font-medium'
                  style={{ fontSize: '18px' }}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className='hover:text-green-200 font-medium'
                  style={{ fontSize: '18px' }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

