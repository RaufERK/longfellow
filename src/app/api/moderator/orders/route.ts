import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where = {
      AND: [
        status ? { status: { equals: status } } : {},
        search
          ? {
              OR: [
                {
                  customerName: {
                    contains: search,
                    mode: 'insensitive' as const,
                  },
                },
                {
                  customerEmail: {
                    contains: search,
                    mode: 'insensitive' as const,
                  },
                },
                {
                  customerPhone: {
                    contains: search,
                    mode: 'insensitive' as const,
                  },
                },
                { orderNumber: { equals: parseInt(search) || 0 } },
              ],
            }
          : {},
      ],
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  title: true,
                  thumbnailUrl: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
