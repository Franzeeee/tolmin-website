/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'static.soccerway.com'],
    remotePatterns: [{ protocol: 'https', hostname: 'storage.livescore.com' }],
  },
}

module.exports = nextConfig
