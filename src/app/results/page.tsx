import { Suspense } from 'react'
import SearchResultsClient from './SearchResultsClient'
import PageHeader from '@/components/PageHeader'
import SearchCartBar from '@/components/SearchCartBar'

export const dynamic = 'force-dynamic'

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>
}

async function SearchResultsContent({ searchParams }: SearchPageProps) {
  const params = await searchParams
  return <SearchResultsClient query={params.q} />
}

export default async function ResultsPage({ searchParams }: SearchPageProps) {
  return (
    <div className='bg-[#ccffcc]'>
      <PageHeader titleImage='h_books.gif' titleAlt='Результаты поиска' />
      <SearchCartBar placeholder='Поиск товаров...' />

      <Suspense
        fallback={
          <div className='container mx-auto px-4 py-8 bg-[#ccffcc]'>
            <div className='text-center py-12'>
              <p className='text-xl text-gray-600'>Загрузка...</p>
            </div>
          </div>
        }
      >
        <SearchResultsContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
