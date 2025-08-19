import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function BooksPage() {
  const books = await prisma.book.findMany({ orderBy: { legacyId: 'asc' } })
  if (!books.length) {
    return (
      <iframe
        src='/legacy/books.html'
        className='w-full h-dvh border-0'
        title='Legacy Books'
      />
    )
  }
  return (
    <div className='container mx-auto p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {books.map((b) => (
        <Card key={b.id}>
          <CardHeader>
            <CardTitle className='line-clamp-2 text-base'>
              <Link href={`/books/${b.legacyId ?? b.id}`}>{b.title}</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-sm text-muted-foreground line-clamp-4'>
              {b.description}
            </div>
            {b.priceRub ? (
              <div className='mt-3 font-medium'>{b.priceRub} руб.</div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
