import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface CartItem {
  productId: string
  title: string
  price: number
  quantity: number
  author?: string
}

interface OrderData {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCity: string
  customerAddress: string
  customerPostalCode: string
}

export async function POST(req: NextRequest) {
  try {
    const orderData: OrderData = await req.json()

    // Создаем транспорт для Yandex SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 587,
      secure: false,
      auth: {
        user: process.env.YANDEX_EMAIL,
        pass: process.env.YANDEX_PASSWORD,
      },
    })

    // Формируем содержимое письма
    const orderItems = orderData.items
      .map(
        (item: CartItem) =>
          `• ${item.title}${item.author ? ` (${item.author})` : ''} - ${
            item.quantity
          } шт. × ${item.price.toLocaleString('ru-RU')} ₽ = ${(
            item.price * item.quantity
          ).toLocaleString('ru-RU')} ₽`
      )
      .join('\n')

    const emailContent = `
НОВЫЙ ЗАКАЗ с сайта Longfellow

=== ИНФОРМАЦИЯ О ЗАКАЗЕ ===
Товаров: ${orderData.totalItems}
Сумма: ${orderData.totalAmount.toLocaleString('ru-RU')} ₽

=== СОСТАВ ЗАКАЗА ===
${orderItems}

=== ДАННЫЕ КЛИЕНТА ===
Имя: ${orderData.customerName}
Email: ${orderData.customerEmail}
Телефон: ${orderData.customerPhone}

=== АДРЕС ДОСТАВКИ ===
Индекс: ${orderData.customerPostalCode}
Город: ${orderData.customerCity}
Адрес: ${orderData.customerAddress}
Доставка: Почтой России

=== ДАТА И ВРЕМЯ ===
${new Date().toLocaleString('ru-RU', {
  timeZone: 'Europe/Moscow',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})}

---
Заказ отправлен с сайта longfellow.ru
`

    // Отправляем письмо
    await transporter.sendMail({
      from: process.env.YANDEX_EMAIL,
      to: process.env.YANDEX_EMAIL, // отправляем на тот же ящик
      subject: `Новый заказ на ${orderData.totalAmount.toLocaleString(
        'ru-RU'
      )} ₽ от ${orderData.customerName}`,
      text: emailContent,
    })

    return NextResponse.json({
      success: true,
      message: 'Заказ успешно отправлен!',
    })
  } catch (error) {
    console.error('Ошибка отправки письма:', error)
    return NextResponse.json(
      { success: false, message: 'Ошибка отправки заказа' },
      { status: 500 }
    )
  }
}
