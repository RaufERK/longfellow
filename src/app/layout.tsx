import type { Metadata } from 'next'
import './globals.css'
import SideNavigation from '@/components/SideNavigation'
import MobileNavigation from '@/components/MobileNavigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Издательство Лонгфелло',
  description: 'Зеркало legacy-сайта longfellow.ru и новая платформа',
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
          className='lg:ml-[167px] min-h-screen bg-white lg:shadow-lg bg-[#ccffcc]'
          id='top'
        >
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
