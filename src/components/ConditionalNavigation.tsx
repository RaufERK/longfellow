'use client'

import { usePathname } from 'next/navigation'
import SideNavigation from './SideNavigation'
import MobileNavigation from './MobileNavigation'

export default function ConditionalNavigation() {
  const pathname = usePathname()

  // Скрываем навигацию для страниц модератора
  const isModeratorPage = pathname.startsWith('/moderator')

  if (isModeratorPage) {
    return null
  }

  return (
    <>
      <SideNavigation />
      <MobileNavigation />
    </>
  )
}
