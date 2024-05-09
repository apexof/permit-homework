/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: { fs: false, net: false, tls: false },
      },
      externals: [...config.externals, 'pino-pretty', 'lokijs', 'encoding'],
    }
  },
}

export default nextConfig
