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
        hostname: "**"
      }
    ],
    formats: ["image/webp"]
  },
  compress: true
}

export default nextConfig
