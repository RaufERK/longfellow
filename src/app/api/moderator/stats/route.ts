import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '30' // days

    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - parseInt(period))

    // Общая статистика
    const [
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalProducts,
      inStockProducts,
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: { in: ['sent', 'completed'] },
          createdAt: { gte: fromDate },
        },
      }),
      prisma.order.count({
        where: { createdAt: { gte: fromDate } },
      }),
      prisma.order.count({
        where: {
          status: { in: ['sent', 'completed'] },
          createdAt: { gte: fromDate },
        },
      }),
      prisma.order.count({
        where: {
          status: 'pending',
          createdAt: { gte: fromDate },
        },
      }),
      prisma.product.count(),
      prisma.product.count({ where: { inStock: true } }),
    ])

    // Топ товаров по продажам
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId', 'productTitle'],
      _sum: {
        quantity: true,
        price: true,
      },
      _count: {
        _all: true,
      },
      where: {
        order: {
          status: { in: ['sent', 'completed'] },
          createdAt: { gte: fromDate },
        },
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    })

    // Продажи по дням
    const dailySales = await prisma.$queryRaw<
      Array<{ date: string; revenue: number; orders: number }>
    >`
      SELECT 
        DATE(createdAt) as date,
        SUM(totalAmount) as revenue,
        COUNT(*) as orders
      FROM "Order"
      WHERE status IN ('sent', 'completed')
        AND createdAt >= ${fromDate.toISOString()}
      GROUP BY DATE(createdAt)
      ORDER BY date DESC
      LIMIT 30
    `

    // Статистика по категориям
    const categoriesStats = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        price: true,
      },
      where: {
        order: {
          status: { in: ['sent', 'completed'] },
          createdAt: { gte: fromDate },
        },
      },
    })

    // Получаем информацию о категориях товаров
    const productIds = categoriesStats.map((stat) => stat.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, category: true },
    })

    const categoryMap = new Map(products.map((p) => [p.id, p.category]))

    const categoryStats = categoriesStats.reduce((acc, stat) => {
      const category = categoryMap.get(stat.productId) || 'unknown'
      if (!acc[category]) {
        acc[category] = { quantity: 0, revenue: 0 }
      }
      acc[category].quantity += stat._sum.quantity || 0
      acc[category].revenue += stat._sum.price || 0
      return acc
    }, {} as Record<string, { quantity: number; revenue: number }>)

    return NextResponse.json({
      overview: {
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        totalOrders,
        completedOrders,
        pendingOrders,
        totalProducts,
        inStockProducts,
        conversionRate:
          totalOrders > 0
            ? ((completedOrders / totalOrders) * 100).toFixed(1)
            : '0',
      },
      topProducts: topProducts.map((item) => ({
        productId: item.productId,
        title: item.productTitle,
        quantitySold: item._sum.quantity || 0,
        revenue: item._sum.price || 0,
        ordersCount: item._count._all,
      })),
      dailySales: dailySales.map((day) => ({
        date: day.date,
        revenue: Number(day.revenue) || 0,
        orders: Number(day.orders) || 0,
      })),
      categories: Object.entries(categoryStats).map(([category, stats]) => ({
        category,
        quantity: stats.quantity,
        revenue: stats.revenue,
      })),
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
