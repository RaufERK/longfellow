'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'
import ToggleSwitch from '@/components/ToggleSwitch'

export const dynamic = 'force-dynamic'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  const categories = [
    { value: 'books', label: 'Книги' },
    { value: 'buklets', label: 'Буклеты' },
    { value: 'calendars', label: 'Календарики' },
    { value: 'cards', label: 'Открытки' },
    { value: 'films', label: 'Фильмы' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/moderator/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/moderator/products')
      } else {
        alert('Ошибка при создании товара')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Ошибка при создании товара')
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

  return (
    <div
      className='min-h-screen bg-[#ccffcc]'
      style={{ fontFamily: 'Times, Times New Roman, serif' }}
    >
      <header className='bg-white shadow-md'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex justify-between items-center'>
          <h1 className='text-3xl font-bold text-green-800'>
            ➕ Добавить товар
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

      <main className='max-w-4xl mx-auto px-4 py-8 bg-green-700'>
        <div className='rounded-lg shadow-md p-6  bg-green-700'>
          <form onSubmit={handleSubmit} className='space-y-6 bg-green-700'>
            <div className='grid md:grid-cols-2 gap-6 bg-green-700'>
              <div className='bg-green-700'>
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
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className='block text-lg font-medium mb-2'
                  style={{ fontSize: '18px' }}
                >
                  Подкategория
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
                  Цена
                </label>
                <input
                  type='number'
                  name='price'
                  value={formData.price}
                  onChange={handleChange}
                  placeholder='Например: 500'
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
              <ToggleSwitch
                checked={formData.inStock}
                onChange={(checked) =>
                  setFormData((prev) => ({ ...prev, inStock: checked }))
                }
                size='md'
                label='В наличии'
              />
            </div>

            <div className='flex gap-4 pt-6'>
              <button
                type='submit'
                disabled={loading}
                className='bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200'
                style={{ fontSize: '18px' }}
              >
                {loading ? '⏳ Создание...' : '💾 Создать товар'}
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
