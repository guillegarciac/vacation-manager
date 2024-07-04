/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.bstatic.com',
      },
    ],
  },
  // ... other configurations ...
}

module.exports = nextConfig;
