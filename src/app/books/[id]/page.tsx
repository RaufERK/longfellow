import { prisma } from '@/lib/prisma'

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const idNum = Number(id)
  const book = await prisma.book.findFirst({
    where: {
      OR: [
        { id: isNaN(idNum) ? -1 : idNum },
        { legacyId: isNaN(idNum) ? -1 : idNum },
      ],
    },
  })
  if (!book) {
    return (
      <iframe
        src={`/legacy/index.html@item_id=${encodeURIComponent(params.id)}.html`}
        className='w-full h-dvh border-0'
        title='Legacy Book'
      />
    )
  }
  return (
    <div className='container mx-auto p-6 prose max-w-none'>
      <h1 className='text-2xl font-semibold mb-4'>{book.title}</h1>
      {book.priceRub ? (
        <div className='mb-4'>Цена: {book.priceRub} руб.</div>
      ) : null}
      {book.coverUrl ? (
        <img src={book.coverUrl} alt={book.title} className='max-w-xs mb-6' />
      ) : null}
      <div className='whitespace-pre-wrap text-sm leading-relaxed'>
        {book.description}
      </div>
      {book.htmlPath ? (
        <a
          href={book.htmlPath}
          className='underline block mt-6'
          target='_blank'
        >
          Открыть оригинальную страницу
        </a>
      ) : null}
    </div>
  )
}
