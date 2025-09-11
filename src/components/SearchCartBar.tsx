'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
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
  const [mounted, setMounted] = useState(false)
  const [validationError, setValidationError] = useState('')
  const { cart, isLoaded } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
    const currentQuery = searchParams.get('q')
    if (currentQuery) {
      setSearchQuery(currentQuery)
    }
  }, [searchParams])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setValidationError('')
    onSearch?.(value)
  }

  const performSearch = () => {
    const trimmedQuery = searchQuery.trim()

    if (trimmedQuery.length < 4) {
      setValidationError('Минимум 4 символа для поиска')
      return
    }

    setValidationError('')
    router.push(`/results?q=${encodeURIComponent(trimmedQuery)}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch()
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  if (!mounted || !isLoaded) {
    return (
      <div className='w-full bg-yellow-400 border-b border-yellow-500 py-3 px-4 rounded-bl-lg relative'>
        <div className='flex items-center justify-between max-w-7xl mx-auto'>
          <div className='flex-1 max-w-md'>
            <div className='flex gap-2'>
              <Input
                type='text'
                placeholder={placeholder}
                className='flex-1 bg-white border-white'
                disabled
              />
              <button
                className='bg-green-600 text-white px-4 py-2 rounded-md font-medium text-sm'
                disabled
              >
                Поиск
              </button>
            </div>
          </div>
          <div className='text-gray-700'>Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full bg-yellow-400 border-b border-yellow-500 py-3 px-4 rounded-bl-lg relative'>
      <div className='flex items-center justify-between max-w-7xl mx-auto gap-4'>
        {/* Левая часть - поиск */}
        <div className='flex-1 max-w-md'>
          <div className='space-y-2'>
            <div className='flex gap-2'>
              <Input
                type='text'
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className='flex-1 bg-white border-white'
              />
              <button
                onClick={performSearch}
                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm'
              >
                Поиск
              </button>
            </div>
            {validationError && (
              <div className='text-sm text-red-600 bg-red-50 px-2 py-1 rounded'>
                {validationError}
              </div>
            )}
          </div>
        </div>

        {/* Правая часть - информация о корзине */}
        <div className='flex items-center gap-4'>
          {cart.totalItems > 0 ? (
            <>
              <div className='text-sm text-gray-800 font-medium'>
                Товаров: <span className='font-bold'>{cart.totalItems}</span>
              </div>
              <div className='text-sm text-gray-800 font-medium'>
                Сумма:{' '}
                <span className='font-bold text-green-700'>
                  {formatPrice(cart.totalAmount)} ₽
                </span>
              </div>
              <Link
                href='/shoppingcart'
                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm'
              >
                Корзина
              </Link>
            </>
          ) : (
            <div className='text-sm text-gray-800 font-medium'>
              Товаров: 0, Сумма: 0 ₽
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
