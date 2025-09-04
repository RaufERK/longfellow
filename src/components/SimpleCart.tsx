'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SimpleCartItem {
  productId: string
  title: string
  price: number
  quantity: number
  thumbnailUrl?: string
  author?: string
}

export default function SimpleCart() {
  const [mounted, setMounted] = useState(false)
  const [cartItems, setCartItems] = useState<SimpleCartItem[]>([])
  const [showForm, setShowForm] = useState(false)

  // Данные формы
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerCity, setCustomerCity] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [customerPostalCode, setCustomerPostalCode] = useState('')

  useEffect(() => {
    setMounted(true)

    // Загрузка корзины
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('longfellow-cart')
        if (stored) {
          const cart = JSON.parse(stored)
          setCartItems(cart.items || [])
        }

        // Загрузка данных клиента
        const customerStored = localStorage.getItem('longfellow-customer-data')
        if (customerStored) {
          const customerData = JSON.parse(customerStored)
          setCustomerName(customerData.customerName || '')
          setCustomerEmail(customerData.customerEmail || '')
          setCustomerPhone(customerData.customerPhone || '')
          setCustomerCity(customerData.customerCity || '')
          setCustomerAddress(customerData.customerAddress || '')
          setCustomerPostalCode(customerData.customerPostalCode || '')
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error)
      }
    }
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    const newItems = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(newItems)

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'longfellow-cart',
        JSON.stringify({
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: newItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          lastUpdated: new Date().toISOString(),
        })
      )
    }
  }

  const removeItem = (productId: string) => {
    const newItems = cartItems.filter((item) => item.productId !== productId)
    setCartItems(newItems)

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'longfellow-cart',
        JSON.stringify({
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: newItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          lastUpdated: new Date().toISOString(),
        })
      )
    }
  }

  const clearCart = () => {
    setCartItems([])
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'longfellow-cart',
        JSON.stringify({
          items: [],
          totalItems: 0,
          totalAmount: 0,
          lastUpdated: new Date().toISOString(),
        })
      )
    }
  }

  const saveCustomerData = () => {
    if (typeof window !== 'undefined') {
      const customerData = {
        customerName,
        customerEmail,
        customerPhone,
        customerCity,
        customerAddress,
        customerPostalCode,
        deliveryType: 'Почтой России',
        notes: '',
      }
      localStorage.setItem(
        'longfellow-customer-data',
        JSON.stringify(customerData)
      )
    }
  }

  if (!mounted) {
    return (
      <div className='min-h-screen bg-[#ccffcc]'>
        <div className='py-20'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl mx-auto'>
              <div className='bg-white rounded-lg shadow-lg p-6 text-center'>
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

  const minSum = parseInt(process.env.NEXT_PUBLIC_MINSUMM || '500')
  const isValidForm =
    customerName &&
    customerEmail &&
    customerPhone &&
    customerCity &&
    customerAddress &&
    customerPostalCode

  return (
    <div className='min-h-screen bg-[#ccffcc]'>
      <PageHeader titleImage='h_present.gif' titleAlt='Корзина товаров' />

      <div className='py-8'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            {cartItems.length === 0 ? (
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
                  Добавьте товары из каталога
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
                    Товаров: <span className='font-semibold'>{totalItems}</span>
                    , на сумму:{' '}
                    <span className='font-semibold text-green-600'>
                      {formatPrice(totalAmount)} ₽
                    </span>
                  </p>
                </div>

                <div className='space-y-4 mb-6'>
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className='bg-white rounded-lg shadow-lg p-6'
                    >
                      <div className='flex items-start gap-4'>
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

                            <Button
                              onClick={() => removeItem(item.productId)}
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
                      {formatPrice(totalAmount)} ₽
                    </span>
                  </div>

                  {totalAmount < minSum && (
                    <div className='bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4'>
                      <p
                        className='text-orange-700'
                        style={{ fontSize: '18px' }}
                      >
                        ⚠️ Минимальная сумма заказа: {minSum} ₽
                      </p>
                    </div>
                  )}

                  <div className='flex gap-4'>
                    <Button
                      onClick={clearCart}
                      variant='outline'
                      className='flex-1'
                      style={{ fontSize: '18px' }}
                    >
                      Очистить корзину
                    </Button>

                    <Button
                      onClick={() => setShowForm(!showForm)}
                      disabled={totalAmount < minSum}
                      className='flex-1 bg-green-600 hover:bg-green-700'
                      style={{ fontSize: '18px' }}
                    >
                      {showForm ? 'Скрыть форму' : 'Оформить заказ'}
                    </Button>
                  </div>
                </div>

                {showForm && (
                  <div className='mt-6 bg-white rounded-lg shadow-lg p-6'>
                    <h3
                      className='text-xl font-bold text-gray-800 mb-4'
                      style={{
                        fontFamily: 'Times, Times New Roman',
                        fontSize: '22px',
                      }}
                    >
                      Данные для доставки
                    </h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                            value={customerName}
                            onChange={(e) => {
                              setCustomerName(e.target.value)
                              saveCustomerData()
                            }}
                            placeholder='Введите ваше имя'
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
                            value={customerEmail}
                            onChange={(e) => {
                              setCustomerEmail(e.target.value)
                              saveCustomerData()
                            }}
                            placeholder='example@mail.com'
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
                            value={customerPhone}
                            onChange={(e) => {
                              setCustomerPhone(e.target.value)
                              saveCustomerData()
                            }}
                            placeholder='+7 (xxx) xxx-xx-xx'
                            style={{ fontSize: '18px' }}
                          />
                        </div>
                      </div>

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
                            Индекс *
                          </label>
                          <Input
                            value={customerPostalCode}
                            onChange={(e) => {
                              setCustomerPostalCode(e.target.value)
                              saveCustomerData()
                            }}
                            placeholder='123456'
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
                            value={customerCity}
                            onChange={(e) => {
                              setCustomerCity(e.target.value)
                              saveCustomerData()
                            }}
                            placeholder='Москва'
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
                            value={customerAddress}
                            onChange={(e) => {
                              setCustomerAddress(e.target.value)
                              saveCustomerData()
                            }}
                            placeholder='улица, дом, квартира'
                            style={{ fontSize: '18px' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                      <div className='flex items-center gap-4'>
                        <span
                          className={
                            isValidForm ? 'text-green-600' : 'text-orange-600'
                          }
                        >
                          {isValidForm
                            ? '✅ Все поля заполнены'
                            : '⚠️ Заполните все обязательные поля'}
                        </span>
                      </div>
                    </div>

                    <div className='mt-6'>
                      <Button
                        disabled={!isValidForm}
                        className='w-full bg-green-600 hover:bg-green-700'
                        style={{ fontSize: '18px' }}
                      >
                        Отправить заказ
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
