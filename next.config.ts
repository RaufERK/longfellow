import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/legacy/index.html',
      },
      {
        source: '/books',
        destination: '/legacy/books.html',
      },
      {
        source: '/buklets',
        destination: '/legacy/buklets.html',
      },
      {
        source: '/films',
        destination: '/legacy/films.html',
      },
      {
        source: '/cards',
        destination: '/legacy/cards.html',
      },
      {
        source: '/calendars',
        destination: '/legacy/calendars.html',
      },
      {
        source: '/authors',
        destination: '/legacy/authors.html',
      },
      {
        source: '/contacts',
        destination: '/legacy/contacts.html',
      },
      {
        source: '/present',
        destination: '/legacy/present.html',
      },
      {
        source: '/favicon.ico',
        destination: '/legacy/long.ico',
      },
      {
        source: '/img2/:path*',
        destination: '/legacy/img2/:path*',
      },
      {
        source: '/shopimg/:path*',
        destination: '/legacy/shopimg/:path*',
      },
      {
        source: '/Scripts/:path*',
        destination: '/legacy/Scripts/:path*',
      },
      {
        source: '/robots.txt',
        destination: '/legacy/robots.txt',
      },
      {
        source: '/index.html',
        destination: '/legacy/index.html',
      },
      {
        source: '/books/index.html',
        destination: '/legacy/books.html',
      },
      {
        source: '/:any*',
        destination: '/legacy/:any*',
      },
    ]
  },
}

export default nextConfig
