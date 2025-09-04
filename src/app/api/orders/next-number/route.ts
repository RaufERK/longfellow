import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Найти максимальный номер заказа
    const lastOrder = await prisma.order.findFirst({
      orderBy: { orderNumber: 'desc' },
      select: { orderNumber: true },
    })

    // Если заказов нет, начинаем с 7000
    const nextNumber = lastOrder ? lastOrder.orderNumber + 1 : 7000

    return NextResponse.json({ nextNumber })
  } catch (error) {
    console.error('Ошибка получения следующего номера заказа:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

