/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ["i.ibb.co", "images.unsplash.com", "encrypted-tbn3.gstatic.com", "www.gigabyte.com", "static.gigabyte.com"],
  },
};

module.exports = nextConfig;
