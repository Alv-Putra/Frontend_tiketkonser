import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: rootDir,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
