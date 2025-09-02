import PageHeader from '@/components/PageHeader'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className='bg-[#ccffcc]'>
      <PageHeader titleImage='h_books.gif' titleAlt='Страница не найдена' />
      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>404</h1>
          <h2 className='text-2xl font-semibold text-gray-600 mb-6'>
            Страница не найдена
          </h2>
          <p className='text-gray-600 mb-8'>
            К сожалению, запрашиваемая страница не существует.
          </p>
          <Link
            href='/'
            className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition-colors inline-block'
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  )
}
