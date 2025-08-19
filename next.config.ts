import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      { source: '/', destination: '/legacy/index.html' },
      { source: '/books', destination: '/legacy/books.html' },
      { source: '/buklets', destination: '/legacy/buklets.html' },
      { source: '/films', destination: '/legacy/films.html' },
      { source: '/cards', destination: '/legacy/cards.html' },
      { source: '/calendars', destination: '/legacy/calendars.html' },
      { source: '/authors', destination: '/legacy/authors.html' },
      { source: '/contacts', destination: '/legacy/contacts.html' },
      { source: '/present', destination: '/legacy/present.html' },
      // legacy internal links without .html
      { source: '/legacy/books', destination: '/legacy/books.html' },
      { source: '/legacy/buklets', destination: '/legacy/buklets.html' },
      { source: '/legacy/shedevry', destination: '/legacy/shedevry.html' },
      { source: '/legacy/films', destination: '/legacy/films.html' },
      { source: '/legacy/cards', destination: '/legacy/cards.html' },
      { source: '/legacy/calendars', destination: '/legacy/calendars.html' },
      { source: '/legacy/authors', destination: '/legacy/authors.html' },
      { source: '/legacy/contacts', destination: '/legacy/contacts.html' },
      { source: '/legacy/present', destination: '/legacy/present.html' },
      // assets referenced from legacy root
      { source: '/img2/:path*', destination: '/legacy/img2/:path*' },
      { source: '/shopimg/:path*', destination: '/legacy/shopimg/:path*' },
      { source: '/Scripts/:path*', destination: '/legacy/Scripts/:path*' },
      { source: '/robots.txt', destination: '/legacy/robots.txt' },
      { source: '/index.html', destination: '/legacy/index.html' },
      { source: '/books/index.html', destination: '/legacy/books.html' },
      // support legacy query links like /legacy?item_id=123
      {
        source: '/legacy',
        has: [{ type: 'query', key: 'item_id', value: '(?<id>.*)' }],
        destination: '/legacy/index.html@item_id=:id.html',
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'item_id', value: '(?<id>.*)' }],
        destination: '/legacy/index.html@item_id=:id.html',
      },
    ]
  },
}

export default nextConfig
