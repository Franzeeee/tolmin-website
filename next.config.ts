/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'static.soccerway.com',
      'storage.livescore.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.livescore.com',
      },
      // Facebook CDN wildcards
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: '**.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.*.fbcdn.net',
      }
    ],
  },
};

module.exports = nextConfig;
