'use client'

import dynamic from 'next/dynamic'

const SimpleCart = dynamic(() => import('@/components/SimpleCart'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ccffcc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #16a34a',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }}
        ></div>
        <h2
          style={{
            fontSize: '22px',
            color: '#2d5a27',
            fontFamily: 'Times, Times New Roman',
            margin: '0 0 0.5rem 0',
          }}
        >
          Загружается рабочая корзина...
        </h2>
        <p
          style={{
            fontSize: '18px',
            color: '#666',
            margin: '0',
          }}
        >
          Полная функциональность • localStorage • Форма заказа
        </p>
      </div>
    </div>
  ),
})

export default function ShoppingCartWrapper() {
  return <SimpleCart />
}
