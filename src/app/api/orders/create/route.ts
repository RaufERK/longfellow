import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateOrderRequest, CreateOrderResponse } from '@/types/cart'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

// Создание транспортера
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'mail.amasters.pro',
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
  })
}

// Форматирование письма
const formatOrderEmail = (
  orderNumber: number,
  orderData: CreateOrderRequest
) => {
  const { customer, items, totalAmount } = orderData

  let itemsList = ''
  items.forEach((item, index) => {
    itemsList += `${index + 1}. ${item.title.toUpperCase()} - {${
      item.quantity
    }} шт. Цена:${item.price} руб.\n`
  })

  // Формируем полный адрес из отдельных полей
  const fullAddress = `${customer.customerPostalCode}, ${customer.customerCity}, ${customer.customerAddress}`

  return `Заказ # ${orderNumber}
Кому: ${customer.customerName}
Адрес: ${fullAddress}
Телефон: ${customer.customerPhone}
Телефон2: ${customer.customerPhone2 || ''}
E-mail: ${customer.customerEmail}
Тип доставки: ${customer.deliveryType}
Примечание: ${customer.notes || ''}

 
Список товаров заказа:
 
${itemsList}
Стоимость товаров:${totalAmount} руб.
Стоимость доставки: будет рассчитана менеджером.`
}

export async function POST(request: NextRequest) {
  try {
    const orderData: CreateOrderRequest = await request.json()

    // Валидация данных
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Корзина пуста' } as CreateOrderResponse,
        { status: 400 }
      )
    }

    if (
      !orderData.customer.customerName ||
      !orderData.customer.customerEmail ||
      !orderData.customer.customerPhone ||
      !orderData.customer.customerPostalCode ||
      !orderData.customer.customerCity ||
      !orderData.customer.customerAddress
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Не заполнены обязательные поля',
        } as CreateOrderResponse,
        { status: 400 }
      )
    }

    // Проверка минимальной суммы заказа
    const minSum = parseInt(process.env.MINSUMM || '500')
    if (orderData.totalAmount < minSum) {
      return NextResponse.json(
        {
          success: false,
          message: `Минимальная сумма заказа: ${minSum} ₽`,
        } as CreateOrderResponse,
        { status: 400 }
      )
    }

    // Получение следующего номера заказа
    const lastOrder = await prisma.order.findFirst({
      orderBy: { orderNumber: 'desc' },
      select: { orderNumber: true },
    })
    const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 7000

    // Формируем полный адрес из отдельных полей
    const fullAddress = `${orderData.customer.customerPostalCode}, ${orderData.customer.customerCity}, ${orderData.customer.customerAddress}`

    // Создание заказа в базе данных
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: orderData.customer.customerName,
        customerEmail: orderData.customer.customerEmail,
        customerPhone: orderData.customer.customerPhone,
        customerPhone2: orderData.customer.customerPhone2 || null,
        customerAddress: fullAddress,
        deliveryType: orderData.customer.deliveryType,
        notes: orderData.customer.notes || null,
        totalAmount: orderData.totalAmount * 100, // сохраняем в копейках
        status: 'pending',
        items: {
          create: orderData.items.map((item) => ({
            productId: item.productId,
            productTitle: item.title,
            quantity: item.quantity,
            price: item.price * 100, // сохраняем в копейках
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Отправка email
    try {
      const transporter = createTransporter()
      const emailContent = formatOrderEmail(orderNumber, orderData)

      // Письмо в отдел продаж
      await transporter.sendMail({
        from: process.env.SOURCE_MAIL,
        to: process.env.TARGET_MAIL || 'kniga@longfellow.ru',
        subject: `Новый заказ #${orderNumber} с сайта`,
        text: emailContent,
      })

      // Копия клиенту
      await transporter.sendMail({
        from: process.env.SOURCE_MAIL,
        to: orderData.customer.customerEmail,
        subject: `Ваш заказ #${orderNumber} принят`,
        text: `Спасибо за ваш заказ!

${emailContent}

Мы свяжемся с вами в ближайшее время для уточнения деталей доставки.

С уважением,
Команда Longfellow`,
      })

      // Обновляем статус заказа
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'sent' },
      })
    } catch (emailError) {
      console.error('Ошибка отправки email:', emailError)
      // Не возвращаем ошибку, так как заказ уже создан
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      message: 'Заказ успешно создан',
    } as CreateOrderResponse)
  } catch (error) {
    console.error('Ошибка создания заказа:', error)
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' } as CreateOrderResponse,
      { status: 500 }
    )
  }
}
