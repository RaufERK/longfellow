import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Уникальный Build ID при каждом деплое
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  rewrites: async () => {
    return [
      // Legacy images used in components
      { source: '/img2/:path*', destination: '/legacy/img2/:path*' },
    ]
  },
}

export default nextConfig
