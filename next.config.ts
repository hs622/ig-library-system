process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["igls.localhost", "192.168.*.*"],
  experimental: { 
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;

