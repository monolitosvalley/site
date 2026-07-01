import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co"
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com"
      },
      {
        protocol: "https",
        hostname: "pedrodaniel.my.canva.site"
      },
      {
        protocol: "https",
        hostname: "**"
      }
    ],
    formats: ["image/webp"]
  },
  compress: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
}

export default nextConfig
