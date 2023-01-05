/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  rewrites: () => [
    {
      // Fetch light field photoset from Luma CDN
      // https://cdn-luma.com/719e19928a3baa9730417df0d8664d3bf807f56f38077f921ac70ff389b9d082.zip
      source: '/external/luma/lightfield/:filename',
      destination: 'https://cdn-luma.com/:filename',
    },
    {
      // PyScript CORS support
      source: '/external/pyscript/:path*',
      destination: 'https://pyscript.net/:path*',
    },
  ],
}

module.exports = nextConfig
