import type { Metadata } from 'next'
import './globals.css'
import ConditionalNavigation from '@/components/ConditionalNavigation'
import ClientLayout from '@/components/ClientLayout'
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
        <ConditionalNavigation />

        {/* Основной контент */}
        <ClientLayout>
          <main className='flex-1'>{children}</main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  )
}
