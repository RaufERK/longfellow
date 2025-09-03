import PageHeader from '@/components/PageHeader'
import SearchCartBar from '@/components/SearchCartBar'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function Authors() {
  return (
    <div className='bg-[#ccffcc]'>
      <PageHeader titleImage='h_autors.gif' titleAlt='Авторы' />
      <SearchCartBar placeholder='Поиск...' />
      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-lg shadow-lg p-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
              <div className='text-center'>
                <div className='mb-4'>
                  <Image
                    src='/legacy/img2/Mark_Profet.jpg'
                    alt='Марк Л. Профет'
                    width={152}
                    height={233}
                    className='mx-auto rounded-lg shadow-md'
                  />
                </div>
                <h3 className='text-xl font-semibold text-green-600 mb-2'>
                  Марк Л. Профет
                </h3>
              </div>

              <div className='text-center'>
                <div className='mb-4'>
                  <Image
                    src='/legacy/img2/Mother.jpg'
                    alt='Элизабет Клэр Профет'
                    width={166}
                    height={229}
                    className='mx-auto rounded-lg shadow-md'
                  />
                </div>
                <h3 className='text-xl font-semibold text-green-600 mb-2'>
                  Элизабет Клэр Профет
                </h3>
              </div>
            </div>

            <div className='prose prose-gray max-w-none'>
              <p className='text-gray-700 mb-6 text-justify'>
                Марк и Элизабет Профет являются пионерами современной
                духовности. Марк начал публиковать книги по эзотерике и
                духовности Востока-Запада в 1958 году. Кроме представленных
                выше, эти Посланники Вознесенных Владык написали еще ряд
                классических произведений духовной литературы, в том числе
                <strong>&ldquo;Утерянные учения Иисуса&rdquo;</strong>,{' '}
                <strong>&ldquo;Запрещенные мистерии Еноха&rdquo;</strong>,
                <strong>&ldquo;Молитвы и медитации&rdquo;</strong>.
              </p>

              <p className='text-gray-700 mb-6 text-justify'>
                Более чем в 30 странах они выступали с лекциями о карме и
                реинкарнации, пророчествах, родственных душах и близнецовых
                пламенах, о мистицизме, практической духовности и по многим
                другим темам.
              </p>

              <p className='text-gray-700 mb-6 text-justify'>
                Марк Профет совершил переход в 1973 году. Для широкой публикации
                книг Элизабет Клэр Профет в 1975 году основала Саммит Юниверсити
                Пресс. В настоящее время книги Профетов переведены на 27 языков
                и распространяются на пяти континентах.
              </p>
            </div>

            <div className='border-t border-gray-200 pt-6'>
              <p className='text-sm text-gray-600'>
                Если у вас возникли сложности с оформлением заказа через
                интернет, вы можете сделать заказ по телефонам{' '}
                <strong>8(964)505-84-04</strong> (в рабочее время) или напишите
                нам{' '}
                <a
                  href='mailto:kniga@longfellow.ru'
                  className='text-orange-600 hover:text-orange-800 underline'
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
