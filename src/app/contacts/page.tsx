import PageHeader from '@/components/PageHeader'

export const dynamic = 'force-dynamic'

export default function Contacts() {
  return (
    <div>
      <PageHeader titleImage='h_kontakts.gif' titleAlt='Контакты' />
      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        <p className='text-center text-gray-600'>
          Контактная информация.{' '}
          <a
            href='/legacy/contacts.html'
            className='text-blue-600 hover:text-blue-800 underline'
          >
            Старая версия страницы
          </a>
        </p>
      </div>
    </div>
  )
}
