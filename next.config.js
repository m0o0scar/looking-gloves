/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  rewrites: () => [
    {
      // Fetch light field photoset from Luma CDN
      // https://cdn-luma.com/b3b4...89e2/Garden_light_field.zip
      source: '/external/luma/lightfield/:filename*',
      destination: 'https://cdn-luma.com/:filename*',
    },
    {
      // PyScript CORS support
      source: '/external/pyscript/:path*',
      destination: 'https://pyscript.net/:path*',
    },
  ],
};

module.exports = nextConfig;
