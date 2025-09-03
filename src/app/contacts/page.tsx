import PageHeader from '@/components/PageHeader'
import SearchCartBar from '@/components/SearchCartBar'

export const dynamic = 'force-dynamic'

export default function Contacts() {
  return (
    <div className='bg-[#ccffcc]'>
      <PageHeader titleImage='h_kontakts.gif' titleAlt='Контакты' />
      <SearchCartBar placeholder='Поиск...' />
      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-lg shadow-lg p-8'>
            <div className='mb-8'>
              <h2 className='text-2xl font-semibold mb-6 text-gray-800'>
                Контактная информация
              </h2>

              <div className='bg-green-50 border-l-4 border-green-400 p-6 mb-6'>
                <h3 className='text-lg font-semibold text-green-800 mb-4'>
                  📚 Заказ книг и получение информации
                </h3>
                <div className='space-y-3'>
                  <p className='text-gray-700'>
                    📧 Email:{' '}
                    <a
                      href='mailto:kniga@longfellow.ru'
                      className='text-green-600 hover:text-green-800 underline font-medium'
                    >
                      kniga@longfellow.ru
                    </a>
                  </p>
                  <p className='text-gray-700'>
                    📞 Телефон:{' '}
                    <strong className='text-green-600'>8(964)505-84-04</strong>{' '}
                    (в рабочее время)
                  </p>
                  <p className='text-gray-700'>
                    📮 Почтовый адрес:{' '}
                    <strong>117418, г. Москва, а/я 25</strong>
                  </p>
                </div>
              </div>

              <div className='bg-orange-50 border-l-4 border-orange-400 p-6 mb-6'>
                <h3 className='text-lg font-semibold text-orange-800 mb-4'>
                  🏢 Оптовые поставки
                </h3>
                <p className='text-gray-700'>
                  📧 Email:{' '}
                  <a
                    href='mailto:sklad@longfellow.ru'
                    className='text-orange-600 hover:text-orange-800 underline font-medium'
                  >
                    sklad@longfellow.ru
                  </a>
                </p>
              </div>

              <div className='bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6'>
                <h3 className='text-lg font-semibold text-yellow-800 mb-4'>
                  🏛️ Юридические реквизиты
                </h3>
                <div className='space-y-1 text-gray-700'>
                  <p>
                    <strong>ООО ИД «ЛОНГФЕЛЛО»</strong>
                  </p>
                  <p>
                    <strong>ЮР. АДРЕС:</strong> 105122 г. Москва Щелковское ш.
                    вл. 10-а, стр 1
                  </p>
                  <p>
                    <strong>ОГРН:</strong> 1037719055120
                  </p>
                </div>
              </div>

              <div className='prose prose-gray max-w-none'>
                <h3 className='text-xl font-semibold mb-4 text-gray-800'>
                  🏪 Где купить наши книги
                </h3>

                <p className='text-gray-700 mb-4'>
                  Книги Издательского Дома «Лонгфелло» можно приобрести во
                  многих книжных магазинах:
                </p>

                <ul className='list-disc list-inside space-y-2 mb-6 text-gray-700'>
                  <li>
                    <a
                      href='https://www.chitai-gorod.ru'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-green-600 hover:text-green-800 underline'
                    >
                      Сеть книжных магазинов «Читай Город» и «Новый книжный»
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://www.bookmg.ru'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-green-600 hover:text-green-800 underline'
                    >
                      «Молодая гвардия»
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://white-clouds.ru'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-green-600 hover:text-green-800 underline'
                    >
                      «Белые облака»
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://www.bookvoed.ru'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-green-600 hover:text-green-800 underline'
                    >
                      «Буквоед»
                    </a>
                  </li>
                </ul>

                <p className='text-gray-700'>
                  📖 Вы также можете познакомиться с Учениями Вознесенных Владык
                  на сайте:{' '}
                  <a
                    href='https://www.amasters.ru'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-green-600 hover:text-green-800 underline'
                  >
                    www.amasters.ru
                  </a>
                </p>
              </div>
            </div>

            <div className='border-t border-gray-200 pt-6'>
              <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center'>
                <p className='text-lg font-semibold text-yellow-800 mb-2'>
                  🤝 Свяжитесь с нами любым удобным способом!
                </p>
                <p className='text-gray-700'>
                  Мы всегда рады помочь вам с выбором и заказом духовной
                  литературы.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
