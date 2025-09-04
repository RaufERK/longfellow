import { NextResponse } from 'next/server'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const ordersDir = join(process.cwd(), 'orders')

    // Проверяем есть ли папка orders
    try {
      const files = await readdir(ordersDir)
      const orderFiles = files.filter((file) => file.endsWith('.json'))

      if (orderFiles.length === 0) {
        return NextResponse.json({
          orders: [],
          message: 'Нет резервных заказов',
        })
      }

      // Читаем все файлы заказов
      const orders = await Promise.all(
        orderFiles.map(async (filename) => {
          const filePath = join(ordersDir, filename)
          const content = await readFile(filePath, 'utf-8')
          const orderData = JSON.parse(content)

          return {
            filename,
            timestamp: orderData.timestamp,
            customerName: orderData.order.customerName,
            customerEmail: orderData.order.customerEmail,
            totalAmount: orderData.order.totalAmount,
            itemsCount: orderData.order.items.length,
            fullData: orderData,
          }
        })
      )

      // Сортируем по времени (новые первыми)
      orders.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      return NextResponse.json({
        orders,
        total: orders.length,
      })
    } catch {
      return NextResponse.json({
        orders: [],
        message: 'Папка заказов не найдена или пуста',
      })
    }
  } catch (error) {
    console.error('Error reading backup orders:', error)
    return NextResponse.json(
      { error: 'Ошибка чтения резервных заказов' },
      { status: 500 }
    )
  }
}
