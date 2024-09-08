// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com', 
      'dynamic-media-cdn.tripadvisor.com', 
      'media-cdn.tripadvisor.com',
      'lh3.googleusercontent.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/**',
      },
      {
        protocol: 'https',
        hostname: 'dynamic-media-cdn.tripadvisor.com',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'media-cdn.tripadvisor.com',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
  env: {
    TRIPADVISOR_API_KEY: process.env.TRIPADVISOR_API_KEY,
  },
};

export default nextConfig;
