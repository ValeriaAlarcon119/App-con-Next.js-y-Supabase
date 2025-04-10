/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: ['localhost', 'supabase.co'],
  },
  output: 'standalone',
  experimental: {
    appDir: true,
    serverActions: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    optimizePackageImports: ['lucide-react']
  },
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 