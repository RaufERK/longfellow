import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const queryString = params.q ? `?q=${encodeURIComponent(params.q)}` : ''
  
  redirect(`/results${queryString}`)
}
