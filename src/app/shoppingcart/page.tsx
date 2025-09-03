'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import ProductImage from '@/components/ProductImage'
import SearchCartBar from '@/components/SearchCartBar'
import {
  OrderFormData,
  CreateOrderRequest,
  CreateOrderResponse,
} from '@/types/cart'

export default function ShoppingCartPage() {
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart, clearCart, isMinimumOrderMet } =
    useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerPhone2: '',
    customerAddress: '',
    deliveryType: 'Почтой России',
    notes: '',
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  const handleFormChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitOrder = async () => {
    if (!isMinimumOrderMet()) {
      alert(`Минимальная сумма заказа: ${process.env.NEXT_PUBLIC_MINSUMM} ₽`)
      return
    }

    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone ||
      !formData.customerAddress
    ) {
      alert('Пожалуйста, заполните все обязательные поля')
      return
    }

    setIsLoading(true)

    try {
      const orderData: CreateOrderRequest = {
        items: cart.items,
        customer: formData,
        totalAmount: cart.totalAmount,
      }

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result: CreateOrderResponse = await response.json()

      if (result.success) {
        clearCart()
        alert(
          `Заказ #${result.orderNumber} успешно отправлен! Мы свяжемся с вами в ближайшее время.`
        )
        router.push('/')
      } else {
        alert(`Ошибка при создании заказа: ${result.message}`)
      }
    } catch (error) {
      console.error('Ошибка отправки заказа:', error)
      alert('Произошла ошибка при отправке заказа. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  const minSum = parseInt(process.env.NEXT_PUBLIC_MINSUMM || '500')

  if (cart.items.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <SearchCartBar placeholder='Поиск товаров...' />
        <div className='py-8'>
          <div className='container mx-auto px-4'>
            <div className='max-w-2xl mx-auto'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-2xl text-center'>
                    Корзина пуста
                  </CardTitle>
                </CardHeader>
                <CardContent className='text-center py-8'>
                  <p className='text-gray-600 mb-4'>
                    В вашей корзине пока нет товаров
                  </p>
                  <Button
                    onClick={() => router.push('/')}
                    className='bg-yellow-400 hover:bg-orange-400 text-black'
                  >
                    Перейти к покупкам
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <SearchCartBar placeholder='Поиск товаров...' />
      <div className='py-8'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-3xl font-bold text-center mb-8'>
              Корзина товаров
            </h1>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Левая колонка - товары в корзине */}
              <Card>
                <CardHeader>
                  <CardTitle>Выбранные товары</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {cart.items.map((item) => (
                    <div
                      key={item.productId}
                      className='flex items-center gap-4 p-4 border rounded-lg'
                    >
                      {item.thumbnailUrl && (
                        <div className='flex-shrink-0'>
                          <ProductImage
                            src={item.thumbnailUrl}
                            alt={item.title}
                            width={60}
                            height={80}
                            useNativeSize={true}
                            sizes='60px'
                          />
                        </div>
                      )}

                      <div className='flex-1 min-w-0'>
                        <h3 className='font-medium text-sm line-clamp-2'>
                          {item.title}
                        </h3>
                        {item.author && (
                          <p className='text-xs text-gray-600'>{item.author}</p>
                        )}
                        <p className='text-sm font-bold text-green-600'>
                          {formatPrice(item.price)} ₽
                        </p>
                      </div>

                      <div className='flex items-center gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className='w-8 text-center'>{item.quantity}</span>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() => removeFromCart(item.productId)}
                          className='ml-2'
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className='border-t pt-4'>
                    <div className='flex justify-between items-center text-lg font-bold'>
                      <span>Итого:</span>
                      <span className='text-green-600'>
                        {formatPrice(cart.totalAmount)} ₽
                      </span>
                    </div>
                    {!isMinimumOrderMet() && (
                      <p className='text-red-600 text-sm mt-2'>
                        Минимальная сумма заказа: {formatPrice(minSum)} ₽ (не
                        хватает: {formatPrice(minSum - cart.totalAmount)} ₽)
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Правая колонка - форма заказа */}
              <Card>
                <CardHeader>
                  <CardTitle>Оформление заказа</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Label htmlFor='customerName'>ФИО *</Label>
                    <Input
                      id='customerName'
                      value={formData.customerName}
                      onChange={(e) =>
                        handleFormChange('customerName', e.target.value)
                      }
                      placeholder='Иванов Иван Иванович'
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor='customerEmail'>E-mail *</Label>
                    <Input
                      id='customerEmail'
                      type='email'
                      value={formData.customerEmail}
                      onChange={(e) =>
                        handleFormChange('customerEmail', e.target.value)
                      }
                      placeholder='ivan@example.com'
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor='customerPhone'>Телефон *</Label>
                    <Input
                      id='customerPhone'
                      type='tel'
                      value={formData.customerPhone}
                      onChange={(e) =>
                        handleFormChange('customerPhone', e.target.value)
                      }
                      placeholder='+7 (999) 123-45-67'
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor='customerPhone2'>
                      Дополнительный телефон
                    </Label>
                    <Input
                      id='customerPhone2'
                      type='tel'
                      value={formData.customerPhone2}
                      onChange={(e) =>
                        handleFormChange('customerPhone2', e.target.value)
                      }
                      placeholder='+7 (999) 123-45-67'
                    />
                  </div>

                  <div>
                    <Label htmlFor='customerAddress'>
                      Полный адрес доставки *
                    </Label>
                    <textarea
                      id='customerAddress'
                      className='w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md resize-none'
                      value={formData.customerAddress}
                      onChange={(e) =>
                        handleFormChange('customerAddress', e.target.value)
                      }
                      placeholder='630036, Новосибирская обл., НОВОСИБИРСК, ПОРТОВАЯ 2 КВАРТИРА 8'
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor='deliveryType'>Тип доставки</Label>
                    <Input
                      id='deliveryType'
                      value={formData.deliveryType}
                      onChange={(e) =>
                        handleFormChange('deliveryType', e.target.value)
                      }
                      readOnly
                      className='bg-gray-100'
                    />
                  </div>

                  <div>
                    <Label htmlFor='notes'>Примечание</Label>
                    <textarea
                      id='notes'
                      className='w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md resize-none'
                      value={formData.notes}
                      onChange={(e) =>
                        handleFormChange('notes', e.target.value)
                      }
                      placeholder='Дополнительная информация к заказу...'
                    />
                  </div>

                  <div className='pt-4'>
                    <p className='text-sm text-gray-600 mb-4'>
                      * Обязательные поля
                      <br />
                      Стоимость доставки будет рассчитана менеджером.
                    </p>

                    <Button
                      onClick={handleSubmitOrder}
                      disabled={isLoading || !isMinimumOrderMet()}
                      className='w-full bg-green-600 hover:bg-green-700 text-white'
                    >
                      {isLoading ? 'Отправляем заказ...' : 'Отправить заказ'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
