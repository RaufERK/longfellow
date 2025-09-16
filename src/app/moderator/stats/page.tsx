'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ModeratorHeader from '@/components/ModeratorHeader'

export const dynamic = 'force-dynamic'

interface Overview {
  totalRevenue: number
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  totalProducts: number
  inStockProducts: number
  conversionRate: string
}

interface TopProduct {
  productId: string
  title: string
  quantitySold: number
  revenue: number
  ordersCount: number
}

interface DailySale {
  date: string
  revenue: number
  orders: number
}

interface CategoryStats {
  category: string
  quantity: number
  revenue: number
}

interface StatsData {
  overview: Overview
  topProducts: TopProduct[]
  dailySales: DailySale[]
  categories: CategoryStats[]
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  const periods = [
    { value: '7', label: 'Последние 7 дней' },
    { value: '30', label: 'Последние 30 дней' },
    { value: '90', label: 'Последние 3 месяца' },
    { value: '365', label: 'Последний год' },
  ]

  const loadStats = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/moderator/stats?period=${period}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const formatPrice = (priceInCopecks: number) => {
    return (
      (priceInCopecks / 100).toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + ' ₽'
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
    })
  }

  return (
    <div
      className='min-h-screen bg-[#ccffcc]'
      style={{ fontFamily: 'Times, Times New Roman, serif' }}
    >
      <ModeratorHeader title='Статистика продаж' icon='📈' />

      <nav className='bg-green-600 text-white'>
        <div className='max-w-6xl mx-auto px-4'>
          <ul className='flex space-x-8 py-4'>
            <li>
              <Link
                href='/moderator'
                className='hover:text-green-200 font-medium'
                style={{ fontSize: '18px' }}
              >
                🏠 Главная
              </Link>
            </li>
            <li>
              <Link
                href='/moderator/products'
                className='hover:text-green-200 font-medium'
                style={{ fontSize: '18px' }}
              >
                📚 Товары
              </Link>
            </li>
            <li>
              <Link
                href='/moderator/orders'
                className='hover:text-green-200 font-medium'
                style={{ fontSize: '18px' }}
              >
                🛒 Заказы
              </Link>
            </li>
            <li>
              <span
                className='text-green-200 font-medium'
                style={{ fontSize: '18px' }}
              >
                📈 Статистика
              </span>
            </li>
          </ul>
        </div>
      </nav>

      <main className='max-w-6xl mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <div className='flex items-center gap-4'>
            <label className='font-medium' style={{ fontSize: '18px' }}>
              Период:
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
              style={{ fontSize: '18px' }}
            >
              {periods.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className='text-center py-8' style={{ fontSize: '18px' }}>
            ⏳ Загрузка статистики...
          </div>
        ) : stats ? (
          <div className='space-y-6'>
            {/* Общая статистика */}
            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <div className='text-center'>
                  <div className='text-3xl mb-2'>💰</div>
                  <h3 className='font-bold mb-1' style={{ fontSize: '20px' }}>
                    Выручка
                  </h3>
                  <p className='text-2xl font-bold text-green-600'>
                    {formatPrice(stats.overview.totalRevenue)}
                  </p>
                </div>
              </div>

              <div className='bg-white rounded-lg shadow-md p-6'>
                <div className='text-center'>
                  <div className='text-3xl mb-2'>📦</div>
                  <h3 className='font-bold mb-1' style={{ fontSize: '20px' }}>
                    Заказов
                  </h3>
                  <p className='text-2xl font-bold text-blue-600'>
                    {stats.overview.totalOrders}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Выполнено: {stats.overview.completedOrders}
                  </p>
                </div>
              </div>

              <div className='bg-white rounded-lg shadow-md p-6'>
                <div className='text-center'>
                  <div className='text-3xl mb-2'>📚</div>
                  <h3 className='font-bold mb-1' style={{ fontSize: '20px' }}>
                    Товаров
                  </h3>
                  <p className='text-2xl font-bold text-purple-600'>
                    {stats.overview.totalProducts}
                  </p>
                  <p className='text-sm text-gray-600'>
                    В наличии: {stats.overview.inStockProducts}
                  </p>
                </div>
              </div>

              <div className='bg-white rounded-lg shadow-md p-6'>
                <div className='text-center'>
                  <div className='text-3xl mb-2'>📊</div>
                  <h3 className='font-bold mb-1' style={{ fontSize: '20px' }}>
                    Конверсия
                  </h3>
                  <p className='text-2xl font-bold text-orange-600'>
                    {stats.overview.conversionRate}%
                  </p>
                  <p className='text-sm text-gray-600'>Успешных заказов</p>
                </div>
              </div>
            </div>

            {/* Продажи по дням */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-2xl font-bold mb-4'>📈 Продажи по дням</h2>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gray-50'>
                      <th
                        className='px-4 py-2 text-left font-semibold'
                        style={{ fontSize: '18px' }}
                      >
                        Дата
                      </th>
                      <th
                        className='px-4 py-2 text-right font-semibold'
                        style={{ fontSize: '18px' }}
                      >
                        Заказов
                      </th>
                      <th
                        className='px-4 py-2 text-right font-semibold'
                        style={{ fontSize: '18px' }}
                      >
                        Выручка
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.dailySales?.slice(0, 10)?.map((day) => (
                      <tr key={day.date} className='border-t'>
                        <td className='px-4 py-2' style={{ fontSize: '18px' }}>
                          {formatDate(day.date)}
                        </td>
                        <td
                          className='px-4 py-2 text-right'
                          style={{ fontSize: '18px' }}
                        >
                          {day.orders}
                        </td>
                        <td
                          className='px-4 py-2 text-right font-medium'
                          style={{ fontSize: '18px' }}
                        >
                          {formatPrice(day.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Топ товаров */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-2xl font-bold mb-4'>🏆 Топ товаров</h2>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gray-50'>
                      <th
                        className='px-4 py-2 text-left font-semibold'
                        style={{ fontSize: '18px' }}
                      >
                        Товар
                      </th>
                      <th
                        className='px-4 py-2 text-right font-semibold'
                        style={{ fontSize: '18px' }}
                      >
                        Продано
                      </th>
                      <th
                        className='px-4 py-2 text-right font-semibold'
                        style={{ fontSize: '18px' }}
                      >
                        Заказов
                      </th>
                      <th
                        className='px-4 py-2 text-right font-semibold'
                        style={{ fontSize: '18px' }}
                      >
                        Выручка
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts?.map((product, index) => (
                      <tr key={product.productId} className='border-t'>
                        <td className='px-4 py-2'>
                          <div className='flex items-center gap-2'>
                            <span className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-bold'>
                              #{index + 1}
                            </span>
                            <span style={{ fontSize: '18px' }}>
                              {product.title}
                            </span>
                          </div>
                        </td>
                        <td
                          className='px-4 py-2 text-right font-medium'
                          style={{ fontSize: '18px' }}
                        >
                          {product.quantitySold} шт.
                        </td>
                        <td
                          className='px-4 py-2 text-right'
                          style={{ fontSize: '18px' }}
                        >
                          {product.ordersCount}
                        </td>
                        <td
                          className='px-4 py-2 text-right font-medium text-green-600'
                          style={{ fontSize: '18px' }}
                        >
                          {formatPrice(product.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Статистика по категориям */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-2xl font-bold mb-4'>
                📋 Продажи по категориям
              </h2>
              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {stats.categories?.map((cat) => (
                  <div key={cat.category} className='bg-gray-50 rounded-lg p-4'>
                    <h3
                      className='font-bold mb-2 text-center'
                      style={{ fontSize: '18px' }}
                    >
                      {cat.category}
                    </h3>
                    <div className='text-center'>
                      <p className='text-lg font-medium'>{cat.quantity} шт.</p>
                      <p className='text-lg font-bold text-green-600'>
                        {formatPrice(cat.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className='text-center py-8 bg-white rounded-lg shadow-md'>
            <p style={{ fontSize: '18px' }}>Не удалось загрузить статистику</p>
          </div>
        )}
      </main>
    </div>
  )
}
