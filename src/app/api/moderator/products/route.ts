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
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''

    const skip = (page - 1) * limit

    const where = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' as const } },
                { author: { contains: search, mode: 'insensitive' as const } },
                { sku: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {},
        category ? { category: { equals: category } } : {},
      ],
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.json()

    const product = await prisma.product.create({
      data: {
        title: data.title,
        author: data.author || null,
        shortDescription: data.shortDescription || null,
        longDescription: data.longDescription || null,
        price: data.price ? parseInt(data.price) : null,
        wholesalePrice1: data.wholesalePrice1
          ? parseInt(data.wholesalePrice1)
          : null,
        wholesalePrice2: data.wholesalePrice2
          ? parseInt(data.wholesalePrice2)
          : null,
        weight: data.weight ? parseInt(data.weight) : null,
        sku: data.sku || null,
        inStock: data.inStock !== undefined ? data.inStock : true,
        dimensions: data.dimensions || null,
        pages: data.pages ? parseInt(data.pages) : null,
        publisher: data.publisher || null,
        isbn: data.isbn || null,
        publishYear: data.publishYear ? parseInt(data.publishYear) : null,
        thumbnailUrl: data.thumbnailUrl || null,
        largeImageUrl: data.largeImageUrl || null,
        category: data.category,
        subcategory: data.subcategory || null,
        originalImagePath: data.originalImagePath || null,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
