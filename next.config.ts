import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      // Legacy images used in components
      { source: '/img2/:path*', destination: '/legacy/img2/:path*' },
    ]
  },
}

export default nextConfig
