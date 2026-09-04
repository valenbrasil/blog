import path from 'node:path'
import type { NextConfig } from 'next'

// Mantido em sincronia com lib/site-config.ts, que não pode ser importado aqui:
// next.config roda antes do alias `@/` existir.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/blog'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.join(__dirname),
  },
}

export default nextConfig
