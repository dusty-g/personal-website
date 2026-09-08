/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/games/boom-bust',
        destination: '/games/boom-bust/index.html',
      },
    ]
  },
}

module.exports = nextConfig
