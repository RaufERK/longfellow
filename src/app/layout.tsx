import type { Metadata } from 'next'
import './globals.css'
import SideNavigation from '@/components/SideNavigation'
import MobileNavigation from '@/components/MobileNavigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Издательство Лонгфелло',
  description: 'Зеркало legacy-сайта longfellow.ru и новая платформа',
  icons: {
    icon: '/long.png',
    shortcut: '/long.png',
    apple: '/long.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ru'>
      <body className='antialiased min-h-dvh text-foreground bg-[#ccffcc]'>
        <SideNavigation />
        <MobileNavigation />

        {/* Основной контент сдвинут вправо на десктопе */}
        <div
          className='lg:ml-[167px] min-h-screen lg:shadow-lg bg-[#ccffcc] flex flex-col'
          id='top'
        >
          <main className='flex-1'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
