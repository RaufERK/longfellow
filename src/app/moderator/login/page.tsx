'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ModeratorLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    console.log('🔐 Отправляю запрос логина...')

    try {
      const response = await fetch('/api/moderator/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      console.log('📡 Ответ сервера:', response.status, response.statusText)

      const data = await response.json()
      console.log('📄 Данные ответа:', data)

      if (response.ok) {
        console.log('✅ Авторизация успешна, редиректим...')
        router.push('/moderator')
      } else {
        console.log('❌ Ошибка авторизации:', data.error)
        setError(data.error || 'Ошибка авторизации')
      }
    } catch (error) {
      console.error('💥 Ошибка сети:', error)
      setError('Ошибка сети')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className='min-h-screen flex items-center justify-center bg-[#ccffcc]'
      style={{ fontFamily: 'Times, Times New Roman, serif' }}
    >
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1
          className='text-2xl font-bold text-center mb-6'
          style={{ fontSize: '24px' }}
        >
          🔐 Вход в админку
        </h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='password'
              className='block text-lg font-medium mb-2'
              style={{ fontSize: '18px' }}
            >
              Пароль модератора:
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg'
              style={{ fontSize: '18px' }}
              placeholder='Введите пароль'
              required
            />
          </div>

          {error && (
            <div
              className='text-red-600 text-center font-medium'
              style={{ fontSize: '18px' }}
            >
              {error}
            </div>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200'
            style={{ fontSize: '18px' }}
          >
            {isLoading ? '⏳ Вход...' : '🚀 Войти'}
          </button>
        </form>

        <div
          className='mt-6 text-center text-gray-600'
          style={{ fontSize: '18px' }}
        >
          <p>Доступ только для модератора сайта</p>
        </div>
      </div>
    </div>
  )
}
