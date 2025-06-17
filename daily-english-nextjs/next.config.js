/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages compatibility
  basePath: process.env.NODE_ENV === 'production' ? '/daily-english-topic' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/daily-english-topic/' : ''
}

module.exports = nextConfig