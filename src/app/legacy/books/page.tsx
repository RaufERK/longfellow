export const dynamic = 'force-dynamic'

export default function LegacyBooksPage() {
  return (
    <div>
      <iframe
        src='/legacy/books.html'
        width='100%'
        height='800px'
        style={{ border: 'none' }}
        title='Legacy Books Page'
      />
    </div>
  )
}
