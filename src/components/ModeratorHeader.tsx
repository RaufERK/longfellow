'use client'

import { useRouter } from 'next/navigation'

interface ModeratorHeaderProps {
  title: string
  icon: string
  maxWidth?: string
}

export default function ModeratorHeader({
  title,
  icon,
  maxWidth = 'max-w-6xl',
}: ModeratorHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('moderatorToken')
    router.push('/moderator/login')
  }

  return (
    <header className='bg-white shadow-md'>
      <div
        className={`${maxWidth} mx-auto px-4 py-4 flex justify-between items-center`}
      >
        <h1 className='text-3xl font-bold text-green-800'>
          {icon} {title}
        </h1>
        <button
          onClick={handleLogout}
          className='bg-violet-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-200'
          style={{ fontSize: '18px' }}
        >
          🚪 Выйти
        </button>
      </div>
    </header>
  )
}
