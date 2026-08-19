import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateOrderRequest, CreateOrderResponse } from '@/types/cart'
import { checkOrderRateLimit } from '@/lib/redis'
import { getClientIp } from '@/lib/clientIp'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

const MAX_ITEMS = 50
const MAX_QUANTITY = 99

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_SERVER || 'mail.amasters.pro',
    port: 587,
    secure: false,
    requireTLS: true,
    tls: {
      servername: 'sm30.hosting.reg.ru',
    },
    auth: {
      user: process.env.SOURCE_MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
    name: 'amasters.pro',
  })
}

type PricedItem = {
  productId: string
  title: string
  quantity: number
  price: number
}

function formatOrderEmail({
  orderNumber,
  customer,
  items,
  totalAmount,
}: {
  orderNumber: number
  customer: CreateOrderRequest['customer']
  items: PricedItem[]
  totalAmount: number
}) {
  const itemsList = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.title.toUpperCase()} - {${item.quantity}} шт. Цена:${item.price} руб.`
    )
    .join('\n')

  const fullAddress = `${customer.customerPostalCode}, ${customer.customerCity}, ${customer.customerAddress}`

  return `Заказ # ${orderNumber}
Кому: ${customer.customerName} ${customer.customerSurname}
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

    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Корзина пуста' } as CreateOrderResponse,
        { status: 400 }
      )
    }

    if (orderData.items.length > MAX_ITEMS) {
      return NextResponse.json(
        { success: false, message: 'Слишком много позиций в заказе' } as CreateOrderResponse,
        { status: 400 }
      )
    }

    if (
      !orderData.customer.customerName ||
      !orderData.customer.customerSurname ||
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

    for (const item of orderData.items) {
      if (
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > MAX_QUANTITY
      ) {
        return NextResponse.json(
          {
            success: false,
            message: 'Некорректное количество товара',
          } as CreateOrderResponse,
          { status: 400 }
        )
      }
    }

    const productIds = [...new Set(orderData.items.map((item) => item.productId))]
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        title: true,
        price: true,
        inStock: true,
      },
    })
    const productsById = new Map(products.map((product) => [product.id, product]))

    const pricedItems: PricedItem[] = []

    for (const item of orderData.items) {
      const product = productsById.get(item.productId)

      if (!product || product.price == null || !product.inStock) {
        return NextResponse.json(
          {
            success: false,
            message: 'Один из товаров недоступен для заказа',
          } as CreateOrderResponse,
          { status: 400 }
        )
      }

      pricedItems.push({
        productId: product.id,
        title: product.title,
        quantity: item.quantity,
        price: product.price,
      })
    }

    const totalAmount = pricedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const minSum = parseInt(process.env.MINSUMM || '500')

    if (totalAmount < minSum) {
      return NextResponse.json(
        {
          success: false,
          message: `Минимальная сумма заказа: ${minSum} ₽`,
        } as CreateOrderResponse,
        { status: 400 }
      )
    }

    const clientIP = getClientIp(request)
    const rateLimit = await checkOrderRateLimit(clientIP)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Слишком много заказов. Попробуйте позже.',
        } as CreateOrderResponse,
        { status: 429 }
      )
    }

    const lastOrder = await prisma.order.findFirst({
      orderBy: { orderNumber: 'desc' },
      select: { orderNumber: true },
    })
    const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 7000
    const fullAddress = `${orderData.customer.customerPostalCode}, ${orderData.customer.customerCity}, ${orderData.customer.customerAddress}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: orderData.customer.customerName,
        customerSurname: orderData.customer.customerSurname,
        customerEmail: orderData.customer.customerEmail,
        customerPhone: orderData.customer.customerPhone,
        customerPhone2: orderData.customer.customerPhone2 || null,
        customerAddress: fullAddress,
        deliveryType: orderData.customer.deliveryType,
        notes: orderData.customer.notes || null,
        totalAmount: totalAmount * 100,
        status: 'pending',
        items: {
          create: pricedItems.map((item) => ({
            productId: item.productId,
            productTitle: item.title,
            quantity: item.quantity,
            price: item.price * 100,
          })),
        },
      },
    })

    try {
      const transporter = createTransporter()
      const emailContent = formatOrderEmail({
        orderNumber,
        customer: orderData.customer,
        items: pricedItems,
        totalAmount,
      })

      await transporter.sendMail({
        from: process.env.SOURCE_MAIL,
        to: process.env.TARGET_MAIL || 'kniga@longfellow.ru',
        subject: `Новый заказ #${orderNumber} с сайта`,
        text: emailContent,
      })

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

      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'sent' },
      })
    } catch (emailError) {
      console.error('Ошибка отправки email:', emailError)
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
