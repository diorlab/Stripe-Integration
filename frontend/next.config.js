/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable trailing slashes for cleaner URLs
  trailingSlash: false,
}

module.exports = nextConfig

