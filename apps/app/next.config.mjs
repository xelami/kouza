/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@kouza/ui"],
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  experimental: {
    runtime: "edge",
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.pages.dev"],
    },
  },
}

export default nextConfig
