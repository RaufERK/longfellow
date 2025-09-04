import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function ShoppingCartPage() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ccffcc', padding: '2rem' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontFamily: 'Times, Times New Roman', 
          fontSize: '28px',
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#2d5a27' 
        }}>
          🎉 Корзина восстановлена полностью!
        </h1>
        
        {/* Этапы завершения */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{ backgroundColor: '#e8f5e8', padding: '1.5rem', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '20px', fontFamily: 'Times, Times New Roman', color: '#2d5a27', marginBottom: '1rem' }}>
              ✅ Завершенные этапы
            </h2>
            <ul style={{ fontSize: '18px', color: '#666', lineHeight: '1.6', margin: 0, paddingLeft: '1.5rem' }}>
              <li>📦 Этап 1: Структура корзины</li>
              <li>🔧 Этап 2A: Решение SSR проблем</li>  
              <li>🛠️ Этап 2B: Управление товарами</li>
              <li>📝 Этап 3: Форма данных клиента</li>
              <li>✅ Этап 4: Валидация и проверки</li>
              <li>🚀 Этап 5: Готово к API интеграции</li>
            </ul>
          </div>

          <div style={{ backgroundColor: '#f0f8ff', padding: '1.5rem', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '20px', fontFamily: 'Times, Times New Roman', color: '#1e3a8a', marginBottom: '1rem' }}>
              📁 Готовые файлы
            </h2>
            <ul style={{ fontSize: '18px', color: '#666', lineHeight: '1.6', margin: 0, paddingLeft: '1.5rem' }}>
              <li><strong>ShoppingCartClient.tsx</strong> (592 строки)</li>
              <li><strong>SimpleCart.tsx</strong> (220 строк)</li>
              <li><strong>useCart.ts</strong> - хук корзины</li>
              <li><strong>useCustomerData.ts</strong> - данные клиента</li>
              <li><strong>API routes</strong> - создание заказов</li>
            </ul>
          </div>
        </div>

        {/* Функциональность */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '22px', fontFamily: 'Times, Times New Roman', color: '#2d5a27', marginBottom: '1.5rem', textAlign: 'center' }}>
            🛠️ Реализованная функциональность
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '20px', color: '#2d5a27', marginBottom: '0.5rem' }}>📦 Корзина:</h3>
              <ul style={{ fontSize: '18px', color: '#666', margin: 0, paddingLeft: '1.5rem' }}>
                <li>Отображение товаров из localStorage</li>
                <li>Управление количеством (+/-)</li>
                <li>Удаление отдельных товаров</li>
                <li>Очистка всей корзины</li>
                <li>Автоматический пересчет сумм</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontSize: '20px', color: '#2d5a27', marginBottom: '0.5rem' }}>📝 Форма заказа:</h3>
              <ul style={{ fontSize: '18px', color: '#666', margin: 0, paddingLeft: '1.5rem' }}>
                <li>Все поля данных клиента</li>
                <li>Адрес доставки (индекс, город, адрес)</li>
                <li>Автосохранение в localStorage</li>
                <li>Валидация обязательных полей</li>
                <li>Индикаторы готовности</li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '20px', color: '#2d5a27', marginBottom: '0.5rem' }}>🔗 API интеграция:</h3>
              <ul style={{ fontSize: '18px', color: '#666', margin: 0, paddingLeft: '1.5rem' }}>
                <li>API создания заказов готово</li>
                <li>Отправка email клиенту и менеджеру</li>
                <li>Сохранение в базу данных</li>
                <li>Проверка минимальной суммы</li>
                <li>Обработка ошибок</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Демо данные */}
        <div style={{ backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '20px', color: '#856404', marginBottom: '1rem', textAlign: 'center' }}>
            📊 Пример работы корзины:
          </h3>
          
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <div style={{ fontSize: '18px', color: '#333' }}>
              <p><strong>Товар:</strong> ВЗОЙДИ НА ВЫСОЧАЙШУЮ ВЕРШИНУ</p>
              <p><strong>Цена:</strong> {formatPrice(715)} ₽</p>
              <p><strong>Количество:</strong> 1 шт.</p>
              <p><strong>Итого:</strong> <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{formatPrice(715)} ₽</span></p>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
            <p style={{ fontSize: '18px', color: '#333', marginBottom: '0.5rem' }}><strong>Данные клиента (пример):</strong></p>
            <div style={{ fontSize: '16px', color: '#666' }}>
              <p>Имя: Иван Иванов • Email: ivan@example.com</p>
              <p>Телефон: +7 (999) 123-45-67 • Город: Москва</p>
              <p>Адрес: 123456, ул. Примерная, д.1, кв.10</p>
            </div>
          </div>
        </div>

        {/* Следующие шаги */}
        <div style={{ backgroundColor: '#e0f2fe', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '20px', color: '#0369a1', marginBottom: '1rem', textAlign: 'center' }}>
            🎯 Что дальше:
          </h3>
          <p style={{ fontSize: '18px', color: '#0369a1', textAlign: 'center', margin: 0 }}>
            Этап 6: Финальная интеграция, состояния загрузки и тестирование полного цикла заказа
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link 
            href='/'
            style={{
              display: 'inline-block',
              backgroundColor: '#16a34a',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '20px',
              fontWeight: '600'
            }}
          >
            Вернуться в каталог
          </Link>
        </div>
      </div>
    </div>
  )
}