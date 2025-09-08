'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCustomerData } from '@/hooks/useCustomerData'
import { CartItem } from '@/types/cart'

const CART_STORAGE_KEY = 'longfellow-cart'

export default function ShoppingCartClient() {
  const [mounted, setMounted] = useState(false)
  const [cartData, setCartData] = useState<{
    items: CartItem[]
    totalItems: number
    totalAmount: number
  } | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)

  // Хук для работы с данными клиента
  const {
    customerData,
    isLoaded: customerDataLoaded,
    updateField,
    hasBasicInfo,
    hasAddressInfo,
  } = useCustomerData()

  useEffect(() => {
    setMounted(true)

    // Загрузка корзины из localStorage на клиенте
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsedCart = JSON.parse(stored)
        setCartData({
          items: parsedCart.items || [],
          totalItems: parsedCart.totalItems || 0,
          totalAmount: parsedCart.totalAmount || 0,
        })
      } else {
        setCartData({
          items: [],
          totalItems: 0,
          totalAmount: 0,
        })
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error)
      setCartData({
        items: [],
        totalItems: 0,
        totalAmount: 0,
      })
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  // Пересчет итогов корзины
  const recalculateCart = (items: CartItem[] | undefined) => {
    const safeItems = items || []
    const totalItems = safeItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = safeItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    return {
      items: safeItems,
      totalItems,
      totalAmount,
    }
  }

  // Сохранение корзины в localStorage
  const saveCartToStorage = (newCartData: typeof cartData) => {
    try {
      const dataToSave = {
        ...newCartData,
        lastUpdated: new Date().toISOString(),
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave))
      setCartData(newCartData)
    } catch (error) {
      console.error('Ошибка сохранения корзины:', error)
    }
  }

  // Обновление количества товара
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (!cartData) return

    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    const newItems =
      cartData?.items?.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      ) || []

    const newCartData = recalculateCart(newItems)
    saveCartToStorage(newCartData)
  }

  // Удаление товара из корзины
  const removeFromCart = (productId: string) => {
    if (!cartData) return

    const newItems =
      cartData?.items?.filter((item) => item.productId !== productId) || []
    const newCartData = recalculateCart(newItems)
    saveCartToStorage(newCartData)
  }

  // Очистка корзины
  const clearCart = () => {
    const emptyCart = { items: [], totalItems: 0, totalAmount: 0 }
    saveCartToStorage(emptyCart)
  }

  // Обработчик кнопки "Оформить заказ"
  const handleOrderClick = () => {
    setShowOrderForm(true)
  }

  if (!mounted) {
    return null // Не рендерим ничего на сервере
  }

  if (!isLoaded || !cartData || !customerDataLoaded) {
    return (
      <div className='min-h-screen bg-[#ccffcc]'>
        <PageHeader titleImage='h_present.gif' titleAlt='Корзина товаров' />
        <div className='py-8'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl mx-auto'>
              <div className='bg-white rounded-lg shadow-lg p-6'>
                <p className='text-gray-600' style={{ fontSize: '18px' }}>
                  Загрузка корзины...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#ccffcc]'>
      <PageHeader titleImage='h_present.gif' titleAlt='Корзина товаров' />

      <div className='py-8'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            {/* Проверка пустой корзины */}
            {!cartData?.items || cartData.items.length === 0 ? (
              <div className='bg-white rounded-lg shadow-lg p-6 text-center'>
                <h2
                  className='text-2xl font-bold text-gray-800 mb-4'
                  style={{
                    fontFamily: 'Times, Times New Roman',
                    fontSize: '24px',
                  }}
                >
                  Ваша корзина пуста
                </h2>
                <p className='text-gray-600 mb-6' style={{ fontSize: '18px' }}>
                  Добавьте товары из каталога, чтобы оформить заказ
                </p>
                <Link
                  href='/'
                  className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium'
                  style={{ fontSize: '18px' }}
                >
                  Перейти в каталог
                </Link>
              </div>
            ) : (
              <>
                {/* Заголовок корзины */}
                <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
                  <h2
                    className='text-2xl font-bold text-gray-800 mb-2'
                    style={{
                      fontFamily: 'Times, Times New Roman',
                      fontSize: '24px',
                    }}
                  >
                    Корзина товаров
                  </h2>
                  <p className='text-gray-600' style={{ fontSize: '18px' }}>
                    Товаров в корзине:{' '}
                    <span className='font-semibold'>
                      {cartData?.totalItems || 0}
                    </span>
                    , на сумму:{' '}
                    <span className='font-semibold text-green-600'>
                      {formatPrice(cartData?.totalAmount || 0)} ₽
                    </span>
                  </p>
                </div>

                {/* Список товаров */}
                <div className='space-y-4 mb-6'>
                  {cartData?.items?.map((item) => (
                    <div
                      key={item.productId}
                      className='bg-white rounded-lg shadow-lg p-6'
                    >
                      <div className='flex items-start gap-4'>
                        {/* Изображение товара */}
                        <div className='w-20 h-28 flex-shrink-0'>
                          {item.thumbnailUrl ? (
                            <Image
                              src={item.thumbnailUrl}
                              alt={item.title}
                              width={80}
                              height={112}
                              className='w-full h-full object-cover rounded'
                            />
                          ) : (
                            <div className='w-full h-full bg-gray-200 rounded flex items-center justify-center'>
                              <span className='text-gray-400 text-xs'>
                                Нет фото
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Информация о товаре */}
                        <div className='flex-1'>
                          <h3
                            className='font-bold text-lg mb-1 text-gray-800'
                            style={{
                              fontFamily: 'Times, Times New Roman',
                              fontSize: '20px',
                            }}
                          >
                            {item.title}
                          </h3>

                          {item.author && (
                            <p
                              className='text-gray-600 mb-2'
                              style={{ fontSize: '18px' }}
                            >
                              Автор: {item.author}
                            </p>
                          )}

                          <div className='flex items-center justify-between mt-3'>
                            <div className='flex items-center gap-4'>
                              <span
                                className='text-lg font-semibold text-green-600'
                                style={{ fontSize: '20px' }}
                              >
                                {formatPrice(item.price)} ₽
                              </span>

                              {/* Управление количеством */}
                              <div className='flex items-center gap-2'>
                                <Button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity - 1
                                    )
                                  }
                                  variant='outline'
                                  size='sm'
                                  className='w-8 h-8 p-0'
                                >
                                  −
                                </Button>
                                <span
                                  className='text-gray-800 font-semibold min-w-[2rem] text-center'
                                  style={{ fontSize: '18px' }}
                                >
                                  {item.quantity}
                                </span>
                                <Button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity + 1
                                    )
                                  }
                                  variant='outline'
                                  size='sm'
                                  className='w-8 h-8 p-0'
                                >
                                  +
                                </Button>
                              </div>

                              <span
                                className='text-lg font-bold text-gray-800'
                                style={{ fontSize: '20px' }}
                              >
                                = {formatPrice(item.price * item.quantity)} ₽
                              </span>
                            </div>

                            {/* Кнопка удаления */}
                            <Button
                              onClick={() => removeFromCart(item.productId)}
                              variant='outline'
                              size='sm'
                              className='text-red-600 border-red-600 hover:bg-red-50'
                            >
                              Удалить
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Итого */}
                <div className='bg-white rounded-lg shadow-lg p-6'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3
                      className='text-xl font-bold text-gray-800'
                      style={{
                        fontFamily: 'Times, Times New Roman',
                        fontSize: '22px',
                      }}
                    >
                      Итого к оплате:
                    </h3>
                    <span
                      className='text-2xl font-bold text-green-600'
                      style={{ fontSize: '24px' }}
                    >
                      {formatPrice(cartData?.totalAmount || 0)} ₽
                    </span>
                  </div>

                  {/* Проверка минимальной суммы */}
                  {(cartData?.totalAmount || 0) <
                    parseInt(process.env.NEXT_PUBLIC_MINSUMM || '500') && (
                    <div className='bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4'>
                      <p
                        className='text-orange-700'
                        style={{ fontSize: '18px' }}
                      >
                        ⚠️ Минимальная сумма заказа:{' '}
                        {process.env.NEXT_PUBLIC_MINSUMM || 500} ₽
                      </p>
                    </div>
                  )}

                  <div className='flex gap-4 justify-center'>
                    <Button
                      onClick={clearCart}
                      variant='outline'
                      className='flex-1 max-w-xs'
                      style={{ fontSize: '18px' }}
                    >
                      Очистить корзину
                    </Button>

                    <Button
                      onClick={handleOrderClick}
                      disabled={
                        (cartData?.totalAmount || 0) <
                        parseInt(process.env.NEXT_PUBLIC_MINSUMM || '500')
                      }
                      className='flex-1 max-w-xs bg-green-600 hover:bg-green-700'
                      style={{ fontSize: '18px' }}
                    >
                      Оформить заказ
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Форма оформления заказа */}
            {showOrderForm && (
              <div className='mt-6 bg-white rounded-lg shadow-lg p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3
                    className='text-xl font-bold text-gray-800'
                    style={{
                      fontFamily: 'Times, Times New Roman',
                      fontSize: '22px',
                    }}
                  >
                    Данные для доставки
                  </h3>
                  <Button
                    onClick={() => setShowOrderForm(false)}
                    variant='outline'
                    size='sm'
                  >
                    Скрыть форму
                  </Button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Основная информация */}
                  <div className='space-y-4'>
                    <h4
                      className='font-semibold text-gray-700'
                      style={{
                        fontSize: '18px',
                        fontFamily: 'Times, Times New Roman',
                      }}
                    >
                      Контактная информация
                    </h4>

                    <div>
                      <label
                        className='block text-gray-700 mb-1'
                        style={{ fontSize: '18px' }}
                      >
                        Имя *
                      </label>
                      <Input
                        value={customerData.customerName}
                        onChange={(e) =>
                          updateField('customerName', e.target.value)
                        }
                        placeholder='Введите ваше имя'
                        className='text-lg'
                        style={{ fontSize: '18px' }}
                      />
                    </div>

                    <div>
                      <label
                        className='block text-gray-700 mb-1'
                        style={{ fontSize: '18px' }}
                      >
                        Email *
                      </label>
                      <Input
                        type='email'
                        value={customerData.customerEmail}
                        onChange={(e) =>
                          updateField('customerEmail', e.target.value)
                        }
                        placeholder='example@mail.com'
                        className='text-lg'
                        style={{ fontSize: '18px' }}
                      />
                    </div>

                    <div>
                      <label
                        className='block text-gray-700 mb-1'
                        style={{ fontSize: '18px' }}
                      >
                        Телефон *
                      </label>
                      <Input
                        type='tel'
                        value={customerData.customerPhone}
                        onChange={(e) =>
                          updateField('customerPhone', e.target.value)
                        }
                        placeholder='+7 (xxx) xxx-xx-xx'
                        className='text-lg'
                        style={{ fontSize: '18px' }}
                      />
                    </div>

                    <div>
                      <label
                        className='block text-gray-700 mb-1'
                        style={{ fontSize: '18px' }}
                      >
                        Дополнительный телефон
                      </label>
                      <Input
                        type='tel'
                        value={customerData.customerPhone2 || ''}
                        onChange={(e) =>
                          updateField('customerPhone2', e.target.value)
                        }
                        placeholder='+7 (xxx) xxx-xx-xx'
                        className='text-lg'
                        style={{ fontSize: '18px' }}
                      />
                    </div>
                  </div>

                  {/* Адрес доставки */}
                  <div className='space-y-4'>
                    <h4
                      className='font-semibold text-gray-700'
                      style={{
                        fontSize: '18px',
                        fontFamily: 'Times, Times New Roman',
                      }}
                    >
                      Адрес доставки
                    </h4>

                    <div>
                      <label
                        className='block text-gray-700 mb-1'
                        style={{ fontSize: '18px' }}
                      >
                        Почтовый индекс *
                      </label>
                      <Input
                        value={customerData.customerPostalCode}
                        onChange={(e) =>
                          updateField('customerPostalCode', e.target.value)
                        }
                        placeholder='123456'
                        className='text-lg'
                        style={{ fontSize: '18px' }}
                      />
                    </div>

                    <div>
                      <label
                        className='block text-gray-700 mb-1'
                        style={{ fontSize: '18px' }}
                      >
                        Город *
                      </label>
                      <Input
                        value={customerData.customerCity}
                        onChange={(e) =>
                          updateField('customerCity', e.target.value)
                        }
                        placeholder='Москва'
                        className='text-lg'
                        style={{ fontSize: '18px' }}
                      />
                    </div>

                    <div>
                      <label
                        className='block text-gray-700 mb-1'
                        style={{ fontSize: '18px' }}
                      >
                        Адрес *
                      </label>
                      <Input
                        value={customerData.customerAddress}
                        onChange={(e) =>
                          updateField('customerAddress', e.target.value)
                        }
                        placeholder='улица, дом, квартира'
                        className='text-lg'
                        style={{ fontSize: '18px' }}
                      />
                    </div>

                    <div>
                      <label
                        className='block text-gray-700 mb-1'
                        style={{ fontSize: '18px' }}
                      >
                        Способ доставки
                      </label>
                      <select
                        value={customerData.deliveryType}
                        onChange={(e) =>
                          updateField('deliveryType', e.target.value)
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        style={{ fontSize: '18px' }}
                      >
                        <option value='Почтой России'>Почтой России</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Примечания */}
                <div className='mt-4'>
                  <label
                    className='block text-gray-700 mb-1'
                    style={{ fontSize: '18px' }}
                  >
                    Примечания к заказу
                  </label>
                  <textarea
                    value={customerData.notes || ''}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder='Дополнительные пожелания...'
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    style={{ fontSize: '18px' }}
                  />
                </div>

                {/* Статус заполнения */}
                <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                  <div className='flex items-center gap-4 text-sm'>
                    <span
                      className={
                        hasBasicInfo() ? 'text-green-600' : 'text-orange-600'
                      }
                    >
                      {hasBasicInfo() ? '✅' : '⚠️'} Контактные данные
                    </span>
                    <span
                      className={
                        hasAddressInfo() ? 'text-green-600' : 'text-orange-600'
                      }
                    >
                      {hasAddressInfo() ? '✅' : '⚠️'} Адрес доставки
                    </span>
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className='mt-6 flex gap-4'>
                  <Button
                    onClick={() => setShowOrderForm(false)}
                    variant='outline'
                    className='flex-1'
                    style={{ fontSize: '18px' }}
                  >
                    Вернуться к корзине
                  </Button>

                  <Button
                    disabled={!hasBasicInfo() || !hasAddressInfo()}
                    className='flex-1 bg-green-600 hover:bg-green-700'
                    style={{ fontSize: '18px' }}
                  >
                    Отправить заказ
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
