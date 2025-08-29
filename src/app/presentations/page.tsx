import PageHeader from '@/components/PageHeader'

export default function PresentationsPage() {
  return (
    <div>
      <PageHeader titleImage='h_present.gif' titleAlt='Презентации' />
      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-lg shadow-lg p-8'>
            <div className='mb-8'>
              <h2 className='text-2xl font-semibold mb-4 text-blue-600'>
                Семь лучей космоса
              </h2>

              <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6'>
                <p className='text-gray-700'>
                  <strong>Во вторник, 11 февраля в 20:00</strong> в магазине{' '}
                  <a
                    href='https://white-clouds.ru/contacts/'
                    className='text-blue-600 hover:text-blue-800 underline'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    «Белые облака»
                  </a>{' '}
                  на Покровке издательский дом «Лонгфелло» проводит лекцию «Семь
                  лучей космоса»
                </p>
              </div>

              <div className='prose prose-gray max-w-none'>
                <p className='text-gray-700 mb-4'>
                  Согласно эзотерической традиции, существует семь основных
                  энергетических центров в теле человека, именуемых чакрами.
                  Каждая из чакр соответствует энергиям и качествам
                  определённого космического луча. Этот луч объединяет энергии,
                  качества, а также тех кто преуспел в овладении данным лучом
                  или же изначально был создан для служения на нём.
                </p>

                <p className='text-gray-700 mb-4'>
                  Все мы пришли в этот мир чтобы увеличить овладение энергиями
                  всех семи лучей, но какой-то один является для Вас основным на
                  данное воплощение.{' '}
                  <strong>
                    Этот луч определяет Ваше предназначение в этой жизни,
                    основные пути реализации и духовного роста.
                  </strong>
                </p>

                <p className='text-gray-700 mb-6'>
                  Владыки Семи лучей – учителя человечества – прошли путь земных
                  эволюций, овладели качествами семи лучей и добились выдающихся
                  результатов на своём луче. Именно эти Вознесенные Владыки дают
                  ключи, помогающие нам понять, каково наше предназначение,
                  каков наш Путь, какие шаги как в обыденной жизни, так и в
                  духовном плане мы можем предпринять для лучшего овладения
                  семью лучами.
                </p>

                <h3 className='text-xl font-semibold mb-4 text-gray-800'>
                  На нашей встрече основанной на работах Вознесенных Владык и их
                  посланников Марк и Элизабет Профет:
                </h3>

                <ul className='list-disc list-inside space-y-2 mb-6 text-gray-700'>
                  <li>
                    Расскажем про семь лучей, их основные качества и Владык
                    воплотивших их в полной мере
                  </li>
                  <li>
                    Рассмотрим негативные аспекты человеческой природы, мешающие
                    овладением каждым лучом
                  </li>
                  <li>
                    Расскажем о практических упражнениях для овладения семью
                    лучами: медитации, молитвы, призывы и веления
                  </li>
                </ul>

                <p className='text-gray-700 mb-6'>
                  В ходе встречи мы представим книги Вознесенных Владык и Марк и
                  Элизабет Профет помогающие овладеть семью лучами и исполнить
                  Божественный План.
                </p>

                <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 text-center'>
                  <p className='text-lg font-semibold text-blue-800 mb-2'>
                    Приходите и меняйте свою жизнь к лучшему с учениями
                    Вознесенных Владык!
                  </p>

                  <div className='text-gray-700'>
                    <p className='font-semibold'>11 февраля в 20:00</p>
                    <p>
                      в магазине{' '}
                      <a
                        href='https://white-clouds.ru/contacts/'
                        className='text-blue-600 hover:text-blue-800 underline'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        «Белые облака»
                      </a>
                    </p>
                    <p>м. Китай-город или м. Чистые пруды</p>
                    <p>ул. Покровка, 4</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='border-t border-gray-200 pt-6'>
              <p className='text-sm text-gray-600'>
                Если у вас возникли сложности с оформлением заказа через
                интернет, вы можете сделать заказ по телефонам{' '}
                <strong>8(964)505-84-04</strong> (в рабочее время) или напишите
                нам{' '}
                <a
                  href='mailto:kniga@longfellow.ru'
                  className='text-blue-600 hover:text-blue-800 underline'
                >
                  kniga@longfellow.ru
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
