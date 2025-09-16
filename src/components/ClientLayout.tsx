'use client'

import { usePathname } from 'next/navigation'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()

  // Определяем, является ли страница страницей модератора
  const isModeratorPage = pathname.startsWith('/moderator')

  // Для страниц модератора не применяем отступы
  if (isModeratorPage) {
    return <>{children}</>
  }

  // Для клиентских страниц применяем отступы
  return (
    <div className='lg:ml-[167px] min-h-screen lg:shadow-lg bg-[#ccffcc] flex flex-col'>
      {children}
    </div>
  )
}
