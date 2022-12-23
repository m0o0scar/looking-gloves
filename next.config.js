/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  rewrites: () => [
    {
      // https://cdn-luma.com/719e19928a3baa9730417df0d8664d3bf807f56f38077f921ac70ff389b9d082.zip
      source: '/luma/lightfield/:filename',
      destination: 'https://cdn-luma.com/:filename',
    },
    {
      source: '/video',
      destination: '/images',
    }
  ],
}

module.exports = nextConfig
