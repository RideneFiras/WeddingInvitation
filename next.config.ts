import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Font files read at runtime by the OG image route.
  outputFileTracingIncludes: {
    "/api/og/[code]": ["./assets/fonts/**"],
    "/icon": ["./assets/fonts/**"],
  },
};

export default nextConfig;
