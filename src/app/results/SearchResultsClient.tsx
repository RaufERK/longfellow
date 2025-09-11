'use client'

import { useState, useEffect } from 'react'
import BookCard from '@/components/BookCard'
import CompactCard from '@/components/CompactCard'

type Product = {
  id: string
  title: string
  author?: string | null
  thumbnailUrl?: string | null
  shortDescription?: string | null
  longDescription?: string | null
  price?: number | null
  dimensions?: string | null
  pages?: number | null
  publisher?: string | null
  publishYear?: number | null
  isbn?: string | null
  category: string
  relevance?: number
}

type SearchResults = {
  query?: string
  totalResults?: number
  error?: string
  results?: {
    books: Product[]
    buklets: Product[]
    films: Product[]
    cards: Product[]
    calendars: Product[]
  }
}

type SearchResultsClientProps = {
  query?: string
}

export default function SearchResultsClient({
  query,
}: SearchResultsClientProps) {
  const [searchResults, setSearchResults] = useState<SearchResults>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      )
      const data = await response.json()
      setSearchResults(data)
    } catch {
      setSearchResults({
        error: 'Ошибка при выполнении поиска',
      })
    } finally {
      setLoading(false)
    }
  }

  const categoryTitles = {
    books: 'Книги',
    buklets: 'Буклеты',
    films: 'Фильмы',
    cards: 'Открытки',
    calendars: 'Календарики',
  }

  const renderProductsByCategory = (products: Product[], category: string) => {
    if (!products || products.length === 0) return null

    const isCompactCategory = category === 'cards' || category === 'calendars'
    const gridClass = isCompactCategory
      ? category === 'calendars'
        ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

    return (
      <div key={category} className='mb-8'>
        <h2 className='text-2xl font-bold mb-4 text-gray-800'>
          {categoryTitles[category as keyof typeof categoryTitles]} (
          {products.length})
        </h2>
        <div className={`grid ${gridClass} gap-6`}>
          {products.map((product) =>
            isCompactCategory ? (
              <CompactCard
                key={product.id}
                product={product}
                variant={category as 'cards' | 'calendars'}
              />
            ) : (
              <BookCard key={product.id} product={product} />
            )
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
      {loading && (
        <div className='text-center py-12'>
          <p className='text-xl text-gray-600'>Поиск...</p>
        </div>
      )}

      {searchResults.error && (
        <div className='text-center py-12'>
          <p className='text-xl text-red-600'>{searchResults.error}</p>
        </div>
      )}

      {query && !loading && !searchResults.error && (
        <>
          <div className='mb-6'>
            <h1 className='text-3xl font-bold text-gray-800'>
              Результаты поиска: &quot;{query}&quot;
            </h1>
            {searchResults.totalResults !== undefined &&
              searchResults.totalResults > 0 && (
                <p className='text-lg text-gray-600 mt-2'>
                  Найдено товаров: {searchResults.totalResults}
                </p>
              )}
          </div>

          {searchResults.results && searchResults.totalResults === 0 && (
            <div className='text-center py-12'>
              <p className='text-xl text-gray-600'>Ничего не найдено</p>
            </div>
          )}

          {searchResults.results &&
            searchResults.totalResults !== undefined &&
            searchResults.totalResults > 0 && (
              <div className='space-y-8'>
                {searchResults.results.books &&
                  renderProductsByCategory(
                    searchResults.results.books,
                    'books'
                  )}
                {searchResults.results.buklets &&
                  renderProductsByCategory(
                    searchResults.results.buklets,
                    'buklets'
                  )}
                {searchResults.results.films &&
                  renderProductsByCategory(
                    searchResults.results.films,
                    'films'
                  )}
                {searchResults.results.cards &&
                  renderProductsByCategory(
                    searchResults.results.cards,
                    'cards'
                  )}
                {searchResults.results.calendars &&
                  renderProductsByCategory(
                    searchResults.results.calendars,
                    'calendars'
                  )}
              </div>
            )}
        </>
      )}

      {!query && !loading && (
        <div className='text-center py-12'>
          <p className='text-xl text-gray-600'>
            Введите поисковый запрос (минимум 4 символа)
          </p>
        </div>
      )}
    </div>
  )
}
