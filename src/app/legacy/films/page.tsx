export const dynamic = 'force-dynamic'

export default function LegacyFilmsPage() {
  return (
    <div>
      <iframe
        src='/legacy/films.html'
        width='100%'
        height='800px'
        style={{ border: 'none' }}
        title='Legacy Films Page'
      />
    </div>
  )
}
