'use client'

import { useState, useEffect, useCallback } from 'react'
import { Cart, CartItem } from '@/types/cart'

const CART_STORAGE_KEY = 'longfellow-cart'

const emptyCart: Cart = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  lastUpdated: new Date().toISOString(),
}

export function useCart() {
  const [cart, setCart] = useState<Cart>(emptyCart)
  const [isLoaded, setIsLoaded] = useState(false)

  // Загрузка корзины из localStorage при монтировании
  useEffect(() => {
    const loadCart = () => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
          const parsedCart = JSON.parse(stored) as Cart
          setCart(parsedCart)
        }
      } catch (error) {
        console.error('Ошибка загрузки корзины:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadCart()

    // Слушатель изменений localStorage для синхронизации между компонентами
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const parsedCart = JSON.parse(e.newValue) as Cart
          setCart(parsedCart)
        } catch (error) {
          console.error('Ошибка синхронизации корзины:', error)
        }
      }
    }

    // Слушатель кастомного события для синхронизации внутри вкладки
    const handleCartUpdate = (e: CustomEvent) => {
      setCart(e.detail)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cart-updated', handleCartUpdate as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(
        'cart-updated',
        handleCartUpdate as EventListener
      )
    }
  }, [])

  // Сохранение корзины в localStorage при изменении
  const saveCart = useCallback((newCart: Cart) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart))
      setCart(newCart)

      // Отправляем кастомное событие для синхронизации между компонентами
      window.dispatchEvent(
        new CustomEvent('cart-updated', {
          detail: newCart,
        })
      )
    } catch (error) {
      console.error('Ошибка сохранения корзины:', error)
    }
  }, [])

  // Пересчет итогов корзины
  const recalculateCart = useCallback((items: CartItem[]): Cart => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    return {
      items,
      totalItems,
      totalAmount,
      lastUpdated: new Date().toISOString(),
    }
  }, [])

  // Добавление товара в корзину
  const addToCart = useCallback(
    (product: {
      id: string
      title: string
      price: number
      thumbnailUrl?: string
      author?: string
    }) => {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === product.id
      )
      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Увеличиваем количество существующего товара
        newItems = cart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Добавляем новый товар
        const newItem: CartItem = {
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          thumbnailUrl: product.thumbnailUrl,
          author: product.author,
        }
        newItems = [...cart.items, newItem]
      }

      const newCart = recalculateCart(newItems)
      saveCart(newCart)
    },
    [cart.items, recalculateCart, saveCart]
  )

  // Обновление количества товара
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId)
        return
      }

      const newItems = cart.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )

      const newCart = recalculateCart(newItems)
      saveCart(newCart)
    },
    [cart.items, recalculateCart, saveCart]
  )

  // Удаление товара из корзины
  const removeFromCart = useCallback(
    (productId: string) => {
      const newItems = cart.items.filter((item) => item.productId !== productId)
      const newCart = recalculateCart(newItems)
      saveCart(newCart)
    },
    [cart.items, recalculateCart, saveCart]
  )

  // Очистка корзины
  const clearCart = useCallback(() => {
    saveCart(emptyCart)
  }, [saveCart])

  // Получение количества конкретного товара в корзине
  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = cart.items.find((item) => item.productId === productId)
      return item ? item.quantity : 0
    },
    [cart.items]
  )

  // Проверка минимальной суммы заказа
  const isMinimumOrderMet = useCallback(() => {
    const minSum = parseInt(process.env.NEXT_PUBLIC_MINSUMM || '500')
    return cart.totalAmount >= minSum
  }, [cart.totalAmount])

  return {
    cart,
    isLoaded,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemQuantity,
    isMinimumOrderMet,
  }
}
