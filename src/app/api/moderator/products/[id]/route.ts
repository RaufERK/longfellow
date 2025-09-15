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

// PATCH для частичного обновления (только измененные поля)
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

    // Строим объект данных динамически, обрабатывая только переданные поля
    const updateData = {}

    if (data.title !== undefined) updateData.title = data.title
    if (data.author !== undefined) updateData.author = data.author || null
    if (data.shortDescription !== undefined)
      updateData.shortDescription = data.shortDescription || null
    if (data.longDescription !== undefined)
      updateData.longDescription = data.longDescription || null
    if (data.price !== undefined)
      updateData.price = data.price ? parseInt(data.price) : null
    if (data.wholesalePrice1 !== undefined)
      updateData.wholesalePrice1 = data.wholesalePrice1
        ? parseInt(data.wholesalePrice1)
        : null
    if (data.wholesalePrice2 !== undefined)
      updateData.wholesalePrice2 = data.wholesalePrice2
        ? parseInt(data.wholesalePrice2)
        : null
    if (data.weight !== undefined)
      updateData.weight = data.weight ? parseInt(data.weight) : null
    if (data.sku !== undefined) updateData.sku = data.sku || null
    if (data.inStock !== undefined) updateData.inStock = data.inStock
    if (data.dimensions !== undefined)
      updateData.dimensions = data.dimensions || null
    if (data.pages !== undefined)
      updateData.pages = data.pages ? parseInt(data.pages) : null
    if (data.publisher !== undefined)
      updateData.publisher = data.publisher || null
    if (data.isbn !== undefined) updateData.isbn = data.isbn || null
    if (data.publishYear !== undefined)
      updateData.publishYear = data.publishYear
        ? parseInt(data.publishYear)
        : null
    if (data.thumbnailUrl !== undefined)
      updateData.thumbnailUrl = data.thumbnailUrl || null
    if (data.largeImageUrl !== undefined)
      updateData.largeImageUrl = data.largeImageUrl || null
    if (data.category !== undefined) updateData.category = data.category
    if (data.subcategory !== undefined)
      updateData.subcategory = data.subcategory || null
    if (data.originalImagePath !== undefined)
      updateData.originalImagePath = data.originalImagePath || null

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
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
