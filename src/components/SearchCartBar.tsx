'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { Input } from '@/components/ui/input'

interface SearchCartBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export default function SearchCartBar({
  onSearch,
  placeholder = 'Поиск товаров...',
}: SearchCartBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { cart, isLoaded } = useCart()

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  if (!isLoaded) {
    return (
      <div className='w-full bg-gray-50 border-b border-gray-200 py-3 px-4'>
        <div className='flex items-center justify-between max-w-7xl mx-auto'>
          <div className='flex-1 max-w-md'>
            <Input
              type='text'
              placeholder={placeholder}
              className='w-full'
              disabled
            />
          </div>
          <div className='text-gray-500'>Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full bg-gray-50 border-b border-gray-200 py-3 px-4'>
      <div className='flex items-center justify-between max-w-7xl mx-auto gap-4'>
        {/* Левая часть - поиск */}
        <div className='flex-1 max-w-md'>
          <Input
            type='text'
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='w-full'
          />
        </div>

        {/* Правая часть - информация о корзине */}
        <div className='flex items-center gap-4'>
          {cart.totalItems > 0 ? (
            <>
              <div className='text-sm text-gray-600'>
                Товаров: <span className='font-medium'>{cart.totalItems}</span>
              </div>
              <div className='text-sm text-gray-600'>
                Сумма:{' '}
                <span className='font-medium text-green-600'>
                  {formatPrice(cart.totalAmount)} ₽
                </span>
              </div>
              <Link
                href='/shoppingcart'
                className='bg-yellow-400 hover:bg-orange-400 text-black px-4 py-2 rounded-md transition-colors font-medium text-sm'
              >
                Корзина
              </Link>
            </>
          ) : (
            <div className='text-sm text-gray-500'>Товаров: 0, Сумма: 0 ₽</div>
          )}
        </div>
      </div>
    </div>
  )
}
