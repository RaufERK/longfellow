import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const data = await req.json()

    const product = await prisma.product.update({
      where: { id },
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
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const data = await req.json()

    const product = await prisma.product.update({
      where: { id },
      data: {
        inStock: data.inStock,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
