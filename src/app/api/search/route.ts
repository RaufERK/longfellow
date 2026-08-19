import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { catalogProductSelect } from '@/lib/catalog'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')?.trim()

  if (!query || query.length < 4) {
    return NextResponse.json(
      {
        error: 'Минимум 4 символа для поиска',
        results: {},
      },
      { status: 400 }
    )
  }

  try {
    const searchTerms = query.toLowerCase().split(/\s+/)

    const allProducts = await prisma.product.findMany({
      where: {
        price: { not: null },
        inStock: true,
      },
      select: catalogProductSelect,
    })

    const products = allProducts.filter((product) => {
      return searchTerms.every((term) => {
        const searchableText = [
          product.title,
          product.author,
          product.shortDescription,
          product.publisher,
          product.isbn,
          product.dimensions,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchableText.includes(term)
      })
    })

    const calculateRelevance = (
      product: {
        title?: string | null
        author?: string | null
        shortDescription?: string | null
      },
      searchQuery: string
    ) => {
      const lowerQuery = searchQuery.toLowerCase()
      let relevanceScore = 0

      if (product.title?.toLowerCase().includes(lowerQuery)) {
        relevanceScore += 100
      }
      if (product.author?.toLowerCase().includes(lowerQuery)) {
        relevanceScore += 50
      }
      if (product.shortDescription?.toLowerCase().includes(lowerQuery)) {
        relevanceScore += 25
      }

      searchTerms.forEach((term) => {
        if (product.title?.toLowerCase().includes(term)) relevanceScore += 10
        if (product.author?.toLowerCase().includes(term)) relevanceScore += 5
      })

      return relevanceScore
    }

    const sortedProducts = products
      .map((product) => ({
        ...product,
        relevance: calculateRelevance(product, query),
      }))
      .sort((a, b) => b.relevance - a.relevance)

    const groupedResults = {
      books: sortedProducts.filter(
        (p) => p.category === 'books' || p.category === 'book'
      ),
      buklets: sortedProducts.filter((p) => p.category === 'buklets'),
      films: sortedProducts.filter((p) => p.category === 'films'),
      cards: sortedProducts.filter((p) => p.category === 'cards'),
      calendars: sortedProducts.filter((p) => p.category === 'calendars'),
    }

    return NextResponse.json({
      query,
      totalResults: products.length,
      results: groupedResults,
    })
  } catch (error) {
    console.error('Search error details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      query: query,
    })
    return NextResponse.json(
      {
        error: 'Ошибка поиска',
        results: {},
      },
      { status: 500 }
    )
  }
}
