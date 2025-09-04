export const dynamic = 'force-dynamic'

export default function ShoppingCartPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ccffcc', padding: '2rem' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontFamily: 'Times, Times New Roman', 
          fontSize: '24px',
          marginBottom: '1rem' 
        }}>
          ✅ Этап 2A: Страница корзины работает!
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '1rem' }}>
          Проблема была в серверном рендеринге. 
        </p>
        <p style={{ fontSize: '18px', color: '#666' }}>
          Теперь страница полностью клиентская и готова для добавления функциональности корзины.
        </p>
      </div>
    </div>
  )
}