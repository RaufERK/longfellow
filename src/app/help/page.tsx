import PageHeader from '@/components/PageHeader'

export const dynamic = 'force-dynamic'

export default function HelpPage() {
  return (
    <div className='bg-[#ccffcc]'>
      <div className='w-full'>
        {/* Основная зелёная секция с заголовком */}
        <div className='bg-[#008000] w-full h-[90px] flex items-center justify-center relative'>
          <div className='flex flex-col items-center'>
            {/* Основной логотип "Учения Вознесенных Владык" */}
            <img
              src='/legacy/img2/mp_teaching.gif'
              width={342}
              height={45}
              alt='Учения Вознесенных Владык'
              style={{ imageRendering: 'pixelated' }}
            />
            {/* Заголовок страницы */}
            <h1
              className='text-white text-3xl font-bold mt-2'
              style={{ fontFamily: 'Times, Times New Roman, serif' }}
            >
              Помощь
            </h1>
          </div>
        </div>

        {/* Декоративная нижняя секция */}
        <div className='flex w-full'>
          {/* Левый угол */}
          <div className='w-[9px] h-[50px]'>
            <div className='bg-[#008000] w-[9px] h-[40px]' />
            <img
              src='/legacy/img2/mp_h_corner.gif'
              width={9}
              height={50}
              alt=''
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          {/* Растягивающийся фон */}
          <div
            className='flex-1 h-[50px]'
            style={{
              backgroundImage: 'url(/legacy/img2/mp_h_bg.gif)',
              backgroundRepeat: 'repeat-x',
              imageRendering: 'pixelated',
            }}
          />
        </div>
      </div>

      <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
        <div className='max-w-4xl mx-auto'>
          <div
            className='bg-white rounded-lg shadow-lg p-8'
            style={{ fontFamily: 'Times, Times New Roman, serif' }}
          >
            <div className='mb-8'>
              <h2
                className='text-2xl font-semibold mb-6 text-gray-800'
                style={{ fontSize: '24px' }}
              >
                Помощь
              </h2>

              <div className='bg-red-50 border-l-4 border-red-400 p-6 mb-6'>
                <p className='text-gray-700' style={{ fontSize: '18px' }}>
                  Если у вас возникли сложности с оформлением заказа через
                  интернет, вы можете сделать заказ по телефонам{' '}
                  <strong className='text-red-600'>8(964)505-84-04</strong> (в
                  рабочее время) или напишите нам{' '}
                  <a
                    href='mailto:kniga@longfellow.ru'
                    className='text-red-600 hover:text-red-800 underline font-medium'
                  >
                    kniga@longfellow.ru
                  </a>
                  .
                </p>
              </div>

              <div className='prose prose-gray max-w-none'>
                <h3
                  className='text-xl font-semibold mb-4 text-gray-800'
                  style={{ fontSize: '22px' }}
                >
                  Как работает интернет магазин
                </h3>

                <p className='text-gray-700 mb-4' style={{ fontSize: '18px' }}>
                  Интернет магазин издательства "Лонгфелло" предлагает вам
                  приобрести книги и брошюры напрямую от издательства без
                  торговых и рекламных наценок.
                </p>

                <p className='text-gray-700 mb-6' style={{ fontSize: '18px' }}>
                  Выбранный вами товар будет доставлен вам курьером (только по
                  г. Москве) или наложенным платежом через почту России (только
                  по России).
                </p>

                <h3
                  className='text-xl font-semibold mb-4 text-gray-800'
                  style={{ fontSize: '22px' }}
                >
                  Как сделать заказ
                </h3>

                <p className='text-gray-700 mb-4' style={{ fontSize: '18px' }}>
                  Для того чтобы оформить заказ необходимо:
                </p>

                <ol
                  className='list-decimal list-inside space-y-3 mb-6 text-gray-700'
                  style={{ fontSize: '18px' }}
                >
                  <li>Выбрать понравившийся вам товар</li>
                  <li>Указать требуемое количество</li>
                  <li>
                    Нажать на кнопку "Заказать" (Товар автоматически будет
                    добавлен к вашему заказу)
                  </li>
                  <li>
                    После того как все интересующие вас товары выбраны, нажмите
                    на кнопку "Ваш заказ" чтобы перейти к редактированию заказа
                  </li>
                  <li>
                    Здесь вы можете изменить количество экземпляров или удалить
                    товар из заказа
                  </li>
                  <li>
                    После редактирования заказа выберите тип доставки и нажмите
                    "Далее"
                  </li>
                  <li>
                    Введите данные, необходимые для доставки заказа, и нажмите
                    "Далее"
                  </li>
                  <li>
                    Удостоверьтесь, что все данные введены правильно и нажмите
                    "Оформить заказ"
                  </li>
                </ol>

                <div className='bg-green-50 border-l-4 border-green-400 p-6 mb-6'>
                  <p className='text-gray-700' style={{ fontSize: '18px' }}>
                    Интернет магазин сообщит вам номер вашего заказа, который
                    понадобиться вам только в случае если вы собираетесь
                    изменить свой заказ.
                  </p>
                  <p
                    className='text-green-700 font-semibold mt-2'
                    style={{ fontSize: '18px' }}
                  >
                    🎉 Поздравляем! Ваш заказ оформлен!
                  </p>
                </div>

                <h3
                  className='text-xl font-semibold mb-4 text-gray-800'
                  style={{ fontSize: '22px' }}
                >
                  Cпособы и стоимость доставки заказов
                </h3>

                <p className='text-gray-700 mb-4' style={{ fontSize: '18px' }}>
                  Возможны два способа доставки товаров:
                </p>

                <div className='bg-blue-50 border-l-4 border-blue-400 p-6 mb-4'>
                  <h4
                    className='font-semibold text-blue-800 mb-3'
                    style={{ fontSize: '20px' }}
                  >
                    🚗 Доставка курьером по Москве
                  </h4>
                  <p
                    className='text-gray-700 mb-2'
                    style={{ fontSize: '18px' }}
                  >
                    Оплата курьеру при получении.
                  </p>
                  <p className='text-gray-700' style={{ fontSize: '18px' }}>
                    Стоимость зависит от веса заказа:
                  </p>
                  <ul
                    className='list-disc list-inside ml-4 mt-2 space-y-1 text-gray-700'
                    style={{ fontSize: '18px' }}
                  >
                    <li>0-3 кг = 200 рублей</li>
                    <li>3-6 кг = 300 рублей</li>
                    <li>6 кг и выше = 600 рублей</li>
                  </ul>
                  <p
                    className='text-sm text-gray-600 mt-2'
                    style={{ fontSize: '16px' }}
                  >
                    (автоматически вычисляется при оформлении заказа)
                  </p>
                </div>

                <div className='bg-orange-50 border-l-4 border-orange-400 p-6 mb-6'>
                  <h4
                    className='font-semibold text-orange-800 mb-3'
                    style={{ fontSize: '20px' }}
                  >
                    📮 Доставка по России наложенным платежом (Почта России)
                  </h4>
                  <p className='text-gray-700' style={{ fontSize: '18px' }}>
                    Оплата на почте при получении. Стоимость зависит от веса и
                    региона (примерная стоимость автоматически вычисляется при
                    оформлении заказа).
                  </p>
                </div>
              </div>
            </div>

            <div className='border-t border-gray-200 pt-6'>
              <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center'>
                <p
                  className='text-lg font-semibold text-yellow-800 mb-2'
                  style={{ fontSize: '20px' }}
                >
                  📞 Остались вопросы?
                </p>
                <p className='text-gray-700' style={{ fontSize: '18px' }}>
                  Свяжитесь с нами любым удобным способом! Мы всегда рады
                  помочь.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
