import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const categories = [
  {
    title: 'Книги',
    description: 'Духовные книги и учения для развития сознания',
    href: '/books',
    bgClass: 'bg-blue-50 hover:bg-blue-100',
  },
  {
    title: 'Буклеты',
    description: 'Небольшие издания с концентрированной мудростью',
    href: '/buklets',
    bgClass: 'bg-green-50 hover:bg-green-100',
  },
  {
    title: 'Фильмы',
    description: 'Духовные фильмы и видео материалы',
    href: '/films',
    bgClass: 'bg-red-50 hover:bg-red-100',
  },
  {
    title: 'Открытки',
    description: 'Красочные открытки с духовными образами',
    href: '/cards',
    bgClass: 'bg-pink-50 hover:bg-pink-100',
  },
  {
    title: 'Календарики',
    description: 'Карманные календари на каждый день',
    href: '/calendars',
    bgClass: 'bg-indigo-50 hover:bg-indigo-100',
  },
  {
    title: 'Изобилие',
    description: 'Материалы о достатке и процветании',
    href: '/shedevry?cat_id=12',
    bgClass: 'bg-yellow-50 hover:bg-yellow-100',
  },
  {
    title: 'Индуизм',
    description: 'Восточная мудрость и древние учения',
    href: '/shedevry?cat_id=9',
    bgClass: 'bg-purple-50 hover:bg-purple-100',
  },
  {
    title: 'Христианство',
    description: 'Христианские учения и материалы',
    href: '/shedevry?cat_id=16',
    bgClass: 'bg-blue-50 hover:bg-blue-100',
  },
]

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-5xl font-bold mb-6'>Издательство Лонгфелло</h1>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Духовные книги и учения для развития сознания, самопознания и
            духовного роста
          </p>
          <div className='bg-green-100 text-green-800 px-6 py-3 rounded-lg inline-block mb-4'>
            <strong>✅ Обновлено!</strong> Теперь все товары загружаются из базы
            данных
          </div>
          <br />
          <Link
            href='/books'
            className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block'
          >
            Посмотреть книги
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Категории товаров
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {categories.map((category) => (
              <Link key={category.href} href={category.href}>
                <Card
                  className={`h-full transition-all duration-300 hover:shadow-lg ${category.bgClass}`}
                >
                  <CardHeader>
                    <CardTitle className='text-xl text-gray-800'>
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-600'>{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            <div className='p-6'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                  ></path>
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2'>
                Духовная литература
              </h3>
              <p className='text-gray-600'>
                Книги о саморазвитии, медитации и духовных практиках
              </p>
            </div>
            <div className='p-6'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2'>
                Проверенное качество
              </h3>
              <p className='text-gray-600'>
                Все издания тщательно отобраны и проверены
              </p>
            </div>
            <div className='p-6'>
              <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-purple-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  ></path>
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2'>
                С любовью и вниманием
              </h3>
              <p className='text-gray-600'>
                Каждая книга выбрана с особой заботой о читателях
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
