import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/common", "@repo/ui"],
  // Lets `next build` run while `next dev` holds `.next` (e.g. NEXT_DIST_DIR=.next-build).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-f170a2592d2c4a1485466404c36807be.r2.dev",
      },
    ],
  },
};

export default nextConfig;
