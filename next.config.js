/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'omoideuriba-media-prod.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'omoideuriba-media-prod.s3.us-east-1.amazonaws.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
}

module.exports = nextConfig
