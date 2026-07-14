import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Fix pnpm monorepo standalone tracing so Next's internal modules
  // (e.g. get-network-host) are correctly included in the build output.
  outputFileTracingRoot: path.join(__dirname, "../../"),
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
