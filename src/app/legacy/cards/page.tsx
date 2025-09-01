export const dynamic = 'force-dynamic'

export default function LegacyCardsPage() {
  return (
    <div>
      <iframe
        src='/legacy/cards.html'
        width='100%'
        height='800px'
        style={{ border: 'none' }}
        title='Legacy Cards Page'
      />
    </div>
  )
}
