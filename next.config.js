/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://checkout.razorpay.com https://cdn.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://i.ibb.co https://images.unsplash.com https://encrypted-tbn3.gstatic.com https://www.gigabyte.com https://static.gigabyte.com",
      "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://api.postalpincode.in",
      "frame-src https://api.razorpay.com",
      "worker-src 'self' blob:",
    ].join('; ')
  },
];

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["i.ibb.co", "images.unsplash.com", "encrypted-tbn3.gstatic.com", "www.gigabyte.com", "static.gigabyte.com"],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
