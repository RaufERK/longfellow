import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

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
  const orderData: OrderData = await req.json()

  try {
    console.log('=== EMAIL API START ===')
    console.log('MAIL_SERVER (env):', process.env.MAIL_SERVER)
    console.log('Using host: sm30.hosting.reg.ru')
    console.log('SOURCE_MAIL:', process.env.SOURCE_MAIL)
    console.log('MAIL_PASSWORD exists:', !!process.env.MAIL_PASSWORD)
    console.log('Order data received:', {
      items: orderData.items.length,
      totalAmount: orderData.totalAmount,
      customerEmail: orderData.customerEmail,
    })

    // Создаем SMTP подключение
    console.log('Creating SMTP connection...')
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVER || 'mail.amasters.pro',
      port: 587,
      secure: false,
      requireTLS: true,
      tls: {
        servername: 'sm30.hosting.reg.ru', // НЕОБХОДИМ! SSL сертификат выдан для *.hosting.reg.ru
      },
      auth: {
        user: process.env.SOURCE_MAIL,
        pass: process.env.MAIL_PASSWORD,
      },
      name: 'amasters.pro',
      connectionTimeout: 30000,
      greetingTimeout: 15000,
      socketTimeout: 30000,
    })

    try {
      await transporter.verify()
      console.log('SMTP connection successful!')
    } catch (error) {
      console.error('SMTP connection failed:', (error as Error).message)
      throw error
    }

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
    console.log('Sending email...')
    console.log('From:', process.env.SOURCE_MAIL)
    console.log('To:', process.env.TARGET_MAIL || 'kniga@longfellow.ru')

    const result = await transporter.sendMail({
      from: `"Longfellow Store" <${process.env.SOURCE_MAIL}>`,
      to: process.env.TARGET_MAIL || 'kniga@longfellow.ru',
      subject: `Новый заказ на ${orderData.totalAmount.toLocaleString(
        'ru-RU'
      )} ₽ от ${orderData.customerName}`,
      text: emailContent,
    })

    console.log('Email sent successfully:', result.messageId)
    console.log('=== EMAIL API SUCCESS ===')

    return NextResponse.json({
      success: true,
      message: 'Заказ успешно отправлен!',
    })
  } catch (error) {
    console.error('=== EMAIL API ERROR ===')
    console.error('Error details:', error)
    console.error('Error name:', (error as Error).name)
    console.error('Error message:', (error as Error).message)

    // Резервный вариант - сохраняем заказ в файл
    try {
      console.log('SMTP failed, saving order to file as backup...')

      const backupOrder = {
        timestamp: new Date().toISOString(),
        order: orderData,
        emailContent: `
НОВЫЙ ЗАКАЗ с сайта Longfellow (РЕЗЕРВНАЯ КОПИЯ)

=== ИНФОРМАЦИЯ О ЗАКАЗЕ ===
Товаров: ${orderData.totalItems}
Сумма: ${orderData.totalAmount.toLocaleString('ru-RU')} ₽

=== СОСТАВ ЗАКАЗА ===
${orderData.items
  .map(
    (item: CartItem) =>
      `• ${item.title}${item.author ? ` (${item.author})` : ''} - ${
        item.quantity
      } шт. × ${item.price.toLocaleString('ru-RU')} ₽ = ${(
        item.price * item.quantity
      ).toLocaleString('ru-RU')} ₽`
  )
  .join('\n')}

=== ДАННЫЕ КЛИЕНТА ===
Имя: ${orderData.customerName}
Email: ${orderData.customerEmail}
Телефон: ${orderData.customerPhone}

=== АДРЕС ДОСТАВКИ ===
Индекс: ${orderData.customerPostalCode}
Город: ${orderData.customerCity}
Адрес: ${orderData.customerAddress}

=== ОШИБКА SMTP ===
${(error as Error).message}
        `,
      }

      // Создаем папку orders если её нет
      const ordersDir = join(process.cwd(), 'orders')
      await mkdir(ordersDir, { recursive: true })

      // Сохраняем заказ в файл
      const filename = `order_${Date.now()}_${orderData.customerName.replace(
        /[^a-zA-Zа-яё0-9]/gi,
        '_'
      )}.json`
      await writeFile(
        join(ordersDir, filename),
        JSON.stringify(backupOrder, null, 2),
        'utf-8'
      )

      console.log('Order saved to file:', filename)

      // Возвращаем успех, но с пометкой о резервном сохранении
      return NextResponse.json({
        success: true,
        message:
          'Заказ принят! (сохранен резервно, письмо будет отправлено позже)',
        backup: true,
      })
    } catch (fileError) {
      console.error('Failed to save backup order:', fileError)

      return NextResponse.json(
        {
          success: false,
          message: 'Ошибка обработки заказа. Попробуйте еще раз.',
          error: (error as Error).message,
        },
        { status: 500 }
      )
    }
  }
}
