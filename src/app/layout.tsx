import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

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
      <body className='antialiased min-h-dvh bg-background text-foreground'>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
