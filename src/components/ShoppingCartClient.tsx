'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PageHeader from '@/components/PageHeader'
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
          totalAmount: parsedCart.totalAmount || 0
        })
      } else {
        setCartData({
          items: [],
          totalItems: 0,
          totalAmount: 0
        })
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error)
      setCartData({
        items: [],
        totalItems: 0,
        totalAmount: 0
      })
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  if (!mounted) {
    return null // Не рендерим ничего на сервере
  }

  if (!isLoaded || !cartData) {
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
            {!cartData.items || cartData.items.length === 0 ? (
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
                    <span className='font-semibold'>{cartData.totalItems}</span>, на сумму:{' '}
                    <span className='font-semibold text-green-600'>
                      {formatPrice(cartData.totalAmount)} ₽
                    </span>
                  </p>
                </div>

                {/* Список товаров */}
                <div className='space-y-4 mb-6'>
                  {cartData.items.map((item) => (
                    <div key={item.productId} className='bg-white rounded-lg shadow-lg p-6'>
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
                            <p className='text-gray-600 mb-2' style={{ fontSize: '18px' }}>
                              Автор: {item.author}
                            </p>
                          )}
                          
                          <div className='flex items-center gap-4 mt-3'>
                            <span
                              className='text-lg font-semibold text-green-600'
                              style={{ fontSize: '20px' }}
                            >
                              {formatPrice(item.price)} ₽
                            </span>
                            <span className='text-gray-600' style={{ fontSize: '18px' }}>
                              × {item.quantity} шт.
                            </span>
                            <span
                              className='text-lg font-bold text-gray-800'
                              style={{ fontSize: '20px' }}
                            >
                              = {formatPrice(item.price * item.quantity)} ₽
                            </span>
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
                      {formatPrice(cartData.totalAmount)} ₽
                    </span>
                  </div>

                  {/* Проверка минимальной суммы */}
                  {cartData.totalAmount < parseInt(process.env.NEXT_PUBLIC_MINSUMM || '500') && (
                    <div className='bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4'>
                      <p className='text-orange-700' style={{ fontSize: '18px' }}>
                        ⚠️ Минимальная сумма заказа: {process.env.NEXT_PUBLIC_MINSUMM || 500} ₽
                      </p>
                    </div>
                  )}

                  <p className='text-gray-600 text-center' style={{ fontSize: '18px' }}>
                    Управление товарами будет добавлено на следующем этапе...
                  </p>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
