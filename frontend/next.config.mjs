/** @type {import('next').NextConfig} */
const rawBackendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://127.0.0.1:8000';
const backendUrl = rawBackendUrl.replace(/\/+$/, '');

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
