'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface Product {
  id: string
  title: string
  author?: string
  category: string
  price?: number
  inStock: boolean
  sku?: string
  updatedAt: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const router = useRouter()

  const categories = ['books', 'buklets', 'calendars', 'cards', 'films']

  const loadProducts = useCallback(
    async (page = 1) => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
          ...(search && { search }),
          ...(category && { category }),
        })

        const response = await fetch(`/api/moderator/products?${params}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products)
          setPagination(data.pagination)
        }
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    },
    [search, category]
  )

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

    try {
      const response = await fetch(`/api/moderator/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadProducts(pagination.page)
      } else {
        alert('Ошибка при удалении товара')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Ошибка при удалении товара')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/moderator/logout', { method: 'POST' })
    router.push('/moderator/login')
  }

  return (
    <div
      className='min-h-screen bg-[#ccffcc]'
      style={{ fontFamily: 'Times, Times New Roman, serif' }}
    >
      <header className='bg-white shadow-md'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex justify-between items-center'>
          <h1 className='text-3xl font-bold text-green-800'>
            📚 Управление товарами
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
              <span
                className='text-green-200 font-medium'
                style={{ fontSize: '18px' }}
              >
                📚 Товары
              </span>
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
          <div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
            <div className='flex flex-col lg:flex-row gap-4 flex-1'>
              <input
                type='text'
                placeholder='Поиск по названию, автору, артикулу...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                style={{ fontSize: '18px' }}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                style={{ fontSize: '18px' }}
              >
                <option value=''>Все категории</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <Link
              href='/moderator/products/new'
              className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200'
              style={{ fontSize: '18px' }}
            >
              ➕ Добавить товар
            </Link>
          </div>
        </div>

        {loading ? (
          <div className='text-center py-8' style={{ fontSize: '18px' }}>
            ⏳ Загрузка...
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow-md overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      className='px-4 py-3 text-left font-semibold'
                      style={{ fontSize: '18px' }}
                    >
                      Название
                    </th>
                    <th
                      className='px-4 py-3 text-left font-semibold'
                      style={{ fontSize: '18px' }}
                    >
                      Автор
                    </th>
                    <th
                      className='px-4 py-3 text-left font-semibold'
                      style={{ fontSize: '18px' }}
                    >
                      Категория
                    </th>
                    <th
                      className='px-4 py-3 text-left font-semibold'
                      style={{ fontSize: '18px' }}
                    >
                      Цена
                    </th>
                    <th
                      className='px-4 py-3 text-center font-semibold'
                      style={{ fontSize: '18px' }}
                    >
                      В наличии
                    </th>
                    <th
                      className='px-4 py-3 text-center font-semibold'
                      style={{ fontSize: '18px' }}
                    >
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className='border-t hover:bg-gray-50'>
                      <td className='px-4 py-3'>
                        <div
                          className='font-medium'
                          style={{ fontSize: '18px' }}
                        >
                          {product.title}
                        </div>
                        {product.sku && (
                          <div className='text-gray-500 text-sm'>
                            Артикул: {product.sku}
                          </div>
                        )}
                      </td>
                      <td className='px-4 py-3' style={{ fontSize: '18px' }}>
                        {product.author || '—'}
                      </td>
                      <td className='px-4 py-3' style={{ fontSize: '18px' }}>
                        {product.category}
                      </td>
                      <td className='px-4 py-3' style={{ fontSize: '18px' }}>
                        {product.price
                          ? `${(product.price / 100).toFixed(2)} ₽`
                          : '—'}
                      </td>
                      <td className='px-4 py-3 text-center'>
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            product.inStock
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.inStock ? '✅ Да' : '❌ Нет'}
                        </span>
                      </td>
                      <td className='px-4 py-3 text-center'>
                        <div className='flex justify-center gap-2'>
                          <Link
                            href={`/moderator/products/${product.id}/edit`}
                            className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition duration-200'
                          >
                            ✏️ Редактировать
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-200'
                          >
                            🗑️ Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className='px-4 py-3 bg-gray-50 flex justify-between items-center'>
                <div style={{ fontSize: '18px' }}>
                  Показано {products.length} из {pagination.total} товаров
                </div>
                <div className='flex gap-2'>
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => loadProducts(page)}
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
