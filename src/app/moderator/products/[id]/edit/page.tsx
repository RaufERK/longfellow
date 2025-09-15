'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'

interface ProductData {
  id: string
  title: string
  author?: string
  shortDescription?: string
  longDescription?: string
  price?: number
  wholesalePrice1?: number
  wholesalePrice2?: number
  weight?: number
  sku?: string
  inStock: boolean
  dimensions?: string
  pages?: number
  publisher?: string
  isbn?: string
  publishYear?: number
  thumbnailUrl?: string
  largeImageUrl?: string
  category: string
  subcategory?: string
  originalImagePath?: string
}

export default function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    shortDescription: '',
    longDescription: '',
    price: '',
    wholesalePrice1: '',
    wholesalePrice2: '',
    weight: '',
    sku: '',
    inStock: true,
    dimensions: '',
    pages: '',
    publisher: '',
    isbn: '',
    publishYear: '',
    thumbnailUrl: '',
    largeImageUrl: '',
    category: 'books',
    subcategory: '',
    originalImagePath: '',
  })

  const [originalData, setOriginalData] = useState({}) // Для отслеживания изменений

  const categories = ['books', 'buklets', 'calendars', 'cards', 'films']

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/moderator/products/${params.id}`)
        if (response.ok) {
          const product: ProductData = await response.json()
          const productData = {
            title: product.title || '',
            author: product.author || '',
            shortDescription: product.shortDescription || '',
            longDescription: product.longDescription || '',
            price: product.price ? product.price.toString() : '',
            wholesalePrice1: product.wholesalePrice1
              ? product.wholesalePrice1.toString()
              : '',
            wholesalePrice2: product.wholesalePrice2
              ? product.wholesalePrice2.toString()
              : '',
            weight: product.weight ? product.weight.toString() : '',
            sku: product.sku || '',
            inStock: product.inStock,
            dimensions: product.dimensions || '',
            pages: product.pages ? product.pages.toString() : '',
            publisher: product.publisher || '',
            isbn: product.isbn || '',
            publishYear: product.publishYear
              ? product.publishYear.toString()
              : '',
            thumbnailUrl: product.thumbnailUrl || '',
            largeImageUrl: product.largeImageUrl || '',
            category: product.category,
            subcategory: product.subcategory || '',
            originalImagePath: product.originalImagePath || '',
          }

          setFormData(productData)
          setOriginalData(productData) // Сохраняем оригинальные данные
        } else {
          alert('Товар не найден')
          router.push('/moderator/products')
        }
      } catch (error) {
        console.error('Error loading product:', error)
        alert('Ошибка при загрузке товара')
      } finally {
        setInitialLoading(false)
      }
    }

    loadProduct()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Отправляем только измененные поля
      const changedData = {}
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== originalData[key]) {
          changedData[key] = formData[key]
        }
      })

      // Если ничего не изменилось, просто редиректим
      if (Object.keys(changedData).length === 0) {
        router.push('/moderator/products')
        return
      }

      const response = await fetch(`/api/moderator/products/${params.id}`, {
        method: 'PATCH', // Используем PATCH для частичного обновления
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changedData),
      })

      if (response.ok) {
        router.push('/moderator/products')
      } else {
        alert('Ошибка при обновлении товара')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Ошибка при обновлении товара')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleLogout = async () => {
    await fetch('/api/moderator/logout', { method: 'POST' })
    router.push('/moderator/login')
  }

  if (initialLoading) {
    return (
      <div
        className='min-h-screen bg-[#ccffcc] flex items-center justify-center'
        style={{ fontFamily: 'Times, Times New Roman, serif' }}
      >
        <div className='text-2xl'>⏳ Загрузка товара...</div>
      </div>
    )
  }

  return (
    <div
      className='min-h-screen bg-[#ccffcc]'
      style={{ fontFamily: 'Times, Times New Roman, serif' }}
    >
      <header className='bg-white shadow-md'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex justify-between items-center'>
          <h1 className='text-3xl font-bold text-green-800'>
            ✏️ Редактировать товар
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

      <main className='max-w-4xl mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <label
                  className='block text-lg font-medium mb-2'
                  style={{ fontSize: '18px' }}
                >
                  Название товара *
                </label>
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                  style={{ fontSize: '18px' }}
                />
              </div>

              <div>
                <label
                  className='block text-lg font-medium mb-2'
                  style={{ fontSize: '18px' }}
                >
                  Автор
                </label>
                <input
                  type='text'
                  name='author'
                  value={formData.author}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                  style={{ fontSize: '18px' }}
                />
              </div>

              <div>
                <label
                  className='block text-lg font-medium mb-2'
                  style={{ fontSize: '18px' }}
                >
                  Категория *
                </label>
                <select
                  name='category'
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                  style={{ fontSize: '18px' }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className='block text-lg font-medium mb-2'
                  style={{ fontSize: '18px' }}
                >
                  Подkategория
                </label>
                <input
                  type='text'
                  name='subcategory'
                  value={formData.subcategory}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                  style={{ fontSize: '18px' }}
                />
              </div>

              <div>
                <label
                  className='block text-lg font-medium mb-2'
                  style={{ fontSize: '18px' }}
                >
                  Цена (в копейках)
                </label>
                <input
                  type='number'
                  name='price'
                  value={formData.price}
                  onChange={handleChange}
                  placeholder='Например: 50000 (500 руб)'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                  style={{ fontSize: '18px' }}
                />
              </div>

              <div>
                <label
                  className='block text-lg font-medium mb-2'
                  style={{ fontSize: '18px' }}
                >
                  Артикул (SKU)
                </label>
                <input
                  type='text'
                  name='sku'
                  value={formData.sku}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                  style={{ fontSize: '18px' }}
                />
              </div>

              <div>
                <label
                  className='block text-lg font-medium mb-2'
                  style={{ fontSize: '18px' }}
                >
                  Издательство
                </label>
                <input
                  type='text'
                  name='publisher'
                  value={formData.publisher}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                  style={{ fontSize: '18px' }}
                />
              </div>

              <div>
                <label
                  className='block text-lg font-medium mb-2'
                  style={{ fontSize: '18px' }}
                >
                  ISBN
                </label>
                <input
                  type='text'
                  name='isbn'
                  value={formData.isbn}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                  style={{ fontSize: '18px' }}
                />
              </div>

              <div>
                <label
                  className='block text-lg font-medium mb-2'
                  style={{ fontSize: '18px' }}
                >
                  Год издания
                </label>
                <input
                  type='number'
                  name='publishYear'
                  value={formData.publishYear}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                  style={{ fontSize: '18px' }}
                />
              </div>

              <div>
                <label
                  className='block text-lg font-medium mb-2'
                  style={{ fontSize: '18px' }}
                >
                  Количество страниц
                </label>
                <input
                  type='number'
                  name='pages'
                  value={formData.pages}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                  style={{ fontSize: '18px' }}
                />
              </div>

              <div>
                <label
                  className='block text-lg font-medium mb-2'
                  style={{ fontSize: '18px' }}
                >
                  Вес (граммы)
                </label>
                <input
                  type='number'
                  name='weight'
                  value={formData.weight}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                  style={{ fontSize: '18px' }}
                />
              </div>

              <div>
                <label
                  className='block text-lg font-medium mb-2'
                  style={{ fontSize: '18px' }}
                >
                  Размеры
                </label>
                <input
                  type='text'
                  name='dimensions'
                  value={formData.dimensions}
                  onChange={handleChange}
                  placeholder='Например: 20x15x2 см'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                  style={{ fontSize: '18px' }}
                />
              </div>
            </div>

            <div>
              <label
                className='block text-lg font-medium mb-2'
                style={{ fontSize: '18px' }}
              >
                Краткое описание
              </label>
              <textarea
                name='shortDescription'
                value={formData.shortDescription}
                onChange={handleChange}
                rows={3}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                style={{ fontSize: '18px' }}
              />
            </div>

            <div>
              <label
                className='block text-lg font-medium mb-2'
                style={{ fontSize: '18px' }}
              >
                Полное описание
              </label>
              <textarea
                name='longDescription'
                value={formData.longDescription}
                onChange={handleChange}
                rows={6}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500'
                style={{ fontSize: '18px' }}
              />
            </div>

            <div className='grid md:grid-cols-2 gap-6'>
              <ImageUpload
                currentImage={formData.thumbnailUrl}
                onImageChange={(imagePath) =>
                  setFormData((prev) => ({ ...prev, thumbnailUrl: imagePath }))
                }
                type='thumbnail'
                label='Миниатюра товара'
              />

              <ImageUpload
                currentImage={formData.largeImageUrl}
                onImageChange={(imagePath) =>
                  setFormData((prev) => ({ ...prev, largeImageUrl: imagePath }))
                }
                type='large'
                label='Большое изображение'
              />
            </div>

            <div className='flex items-center'>
              <input
                type='checkbox'
                id='inStock'
                name='inStock'
                checked={formData.inStock}
                onChange={handleChange}
                className='mr-2 scale-125'
              />
              <label
                htmlFor='inStock'
                className='text-lg font-medium'
                style={{ fontSize: '18px' }}
              >
                В наличии
              </label>
            </div>

            <div className='flex gap-4 pt-6'>
              <button
                type='submit'
                disabled={loading}
                className='bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200'
                style={{ fontSize: '18px' }}
              >
                {loading ? '⏳ Сохранение...' : '💾 Сохранить изменения'}
              </button>
              <Link
                href='/moderator/products'
                className='bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 inline-block text-center'
                style={{ fontSize: '18px' }}
              >
                ↩️ Отмена
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
