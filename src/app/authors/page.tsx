import PageHeader from '@/components/PageHeader'

export const dynamic = 'force-dynamic'

export default function Authors() {
  return (
    <div>
      <PageHeader titleImage='h_autors.gif' titleAlt='Авторы' />
      <div className='container mx-auto px-4 py-8'>
        <p className='text-center text-gray-600'>
          Информация об авторах.{' '}
          <a
            href='/legacy/authors.html'
            className='text-blue-600 hover:text-blue-800 underline'
          >
            Старая версия страницы
          </a>
        </p>
      </div>
    </div>
  )
}
