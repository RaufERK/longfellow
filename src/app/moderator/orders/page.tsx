'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface OrderItem {
  id: string
  productTitle: string
  quantity: number
  price: number
  product: {
    title: string
    thumbnailUrl?: string
  }
}

interface Order {
  id: string
  orderNumber: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  deliveryType: string
  notes?: string
  totalAmount: number
  status: string
  createdAt: string
  items: OrderItem[]
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const router = useRouter()

  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'pending', label: '⏳ В ожидании' },
    { value: 'sent', label: '📦 Отправлен' },
    { value: 'completed', label: '✅ Выполнен' },
  ]

  const statusLabels = {
    pending: '⏳ В ожидании',
    sent: '📦 Отправлен',
    completed: '✅ Выполнен',
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  }

  const loadOrders = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      })

      const response = await fetch(`/api/moderator/orders?${params}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [search, statusFilter])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/moderator/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        loadOrders(pagination.page)
      } else {
        alert('Ошибка при обновлении статуса заказа')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Ошибка при обновлении статуса заказа')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/moderator/logout', { method: 'POST' })
    router.push('/moderator/login')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (priceInCopecks: number) => {
    return (priceInCopecks / 100).toFixed(2) + ' ₽'
  }

  return (
    <div
      className='min-h-screen bg-[#ccffcc]'
      style={{ fontFamily: 'Times, Times New Roman, serif' }}
    >
      <header className='bg-white shadow-md'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex justify-between items-center'>
          <h1 className='text-3xl font-bold text-green-800'>
            🛒 Управление заказами
          </h1>
          <button
            onClick={handleLogout}
            className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200'
            style={{ fontSize: '18px' }}
          >
            🚪 Выйти
          </button>
        </div>
      </header>

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
              <span
                className='text-green-200 font-medium'
                style={{ fontSize: '18px' }}
              >
                🛒 Заказы
              </span>
            </li>
            <li>
              <Link
                href='/moderator/stats'
                className='hover:text-green-200 font-medium'
                style={{ fontSize: '18px' }}
              >
                📈 Статистика
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className='max-w-6xl mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <div className='flex flex-col lg:flex-row gap-4 items-center'>
            <input
              type='text'
              placeholder='Поиск по имени, email, телефону или номеру заказа...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
              style={{ fontSize: '18px' }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
              style={{ fontSize: '18px' }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className='text-center py-8' style={{ fontSize: '18px' }}>
            ⏳ Загрузка...
          </div>
        ) : (
          <div className='space-y-6'>
            {orders.map((order) => (
              <div
                key={order.id}
                className='bg-white rounded-lg shadow-md overflow-hidden'
              >
                <div className='p-6'>
                  <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4'>
                    <div>
                      <h3
                        className='text-xl font-bold'
                        style={{ fontSize: '20px' }}
                      >
                        Заказ #{order.orderNumber}
                      </h3>
                      <p className='text-gray-600' style={{ fontSize: '18px' }}>
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className='flex gap-2 mt-4 lg:mt-0'>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[
                            order.status as keyof typeof statusColors
                          ]
                        }`}
                      >
                        {
                          statusLabels[
                            order.status as keyof typeof statusLabels
                          ]
                        }
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        className='px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500'
                      >
                        <option value='pending'>В ожидании</option>
                        <option value='sent'>Отправлен</option>
                        <option value='completed'>Выполнен</option>
                      </select>
                    </div>
                  </div>

                  <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                      <h4
                        className='font-semibold mb-2'
                        style={{ fontSize: '18px' }}
                      >
                        Информация о клиенте:
                      </h4>
                      <div
                        className='space-y-1 text-gray-700'
                        style={{ fontSize: '18px' }}
                      >
                        <p>
                          <strong>Имя:</strong> {order.customerName}
                        </p>
                        <p>
                          <strong>Email:</strong> {order.customerEmail}
                        </p>
                        <p>
                          <strong>Телефон:</strong> {order.customerPhone}
                        </p>
                        <p>
                          <strong>Адрес:</strong> {order.customerAddress}
                        </p>
                        <p>
                          <strong>Доставка:</strong> {order.deliveryType}
                        </p>
                        {order.notes && (
                          <p>
                            <strong>Примечания:</strong> {order.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4
                        className='font-semibold mb-2'
                        style={{ fontSize: '18px' }}
                      >
                        Товары в заказе:
                      </h4>
                      <div className='space-y-2'>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className='flex items-center gap-3 p-2 bg-gray-50 rounded'
                          >
                            {item.product.thumbnailUrl && (
                              <img
                                src={item.product.thumbnailUrl}
                                alt={item.product.title}
                                className='w-12 h-12 object-cover rounded'
                              />
                            )}
                            <div className='flex-1'>
                              <p
                                className='font-medium'
                                style={{ fontSize: '18px' }}
                              >
                                {item.product.title}
                              </p>
                              <p className='text-sm text-gray-600'>
                                {item.quantity} шт. × {formatPrice(item.price)}{' '}
                                = {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className='mt-4 p-3 bg-green-50 rounded'>
                        <p className='font-bold text-lg text-green-800'>
                          Итого: {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className='text-center py-8 bg-white rounded-lg shadow-md'>
                <p style={{ fontSize: '18px' }}>Заказов не найдено</p>
              </div>
            )}

            {pagination.pages > 1 && (
              <div className='bg-white rounded-lg shadow-md px-4 py-3 flex justify-between items-center'>
                <div style={{ fontSize: '18px' }}>
                  Показано {orders.length} из {pagination.total} заказов
                </div>
                <div className='flex gap-2'>
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => loadOrders(page)}
                      className={`px-3 py-1 rounded transition duration-200 ${
                        page === pagination.page
                          ? 'bg-green-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                      style={{ fontSize: '18px' }}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
