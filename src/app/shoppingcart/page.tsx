'use client'

import dynamicImport from 'next/dynamic'

export const dynamic = 'force-dynamic'

const ShoppingCartClient = dynamicImport(() => import('@/components/ShoppingCartClient'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: '100vh', backgroundColor: '#ccffcc', padding: '2rem' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <p style={{ fontSize: '18px', color: '#666' }}>
          Загрузка корзины и формы заказа...
        </p>
      </div>
    </div>
  )
})

export default function ShoppingCartPage() {
  return <ShoppingCartClient />
}
