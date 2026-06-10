import type { NextConfig } from "next";
import { createRequire } from "module";

const _require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  webpack(config) {
    // tsconfig paths points "sharp" to its .d.ts for TypeScript type resolution,
    // but webpack must resolve to the real module — override it here.
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp: _require.resolve("sharp"),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "pbxt.replicate.delivery",
      },
    ],
  },
};

export default nextConfig;
