import type { NextConfig } from "next";

const tanstackQueryModernEntry = "@tanstack/react-query/build/modern/index.js";

const tanstackDevtoolsModernEntry =
  "@tanstack/react-query-devtools/build/modern/index.js";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  transpilePackages: [
    "@tanstack/react-query",
    "@tanstack/react-query-devtools",
  ],
  turbopack: {
    resolveAlias: {
      "@tanstack/react-query": tanstackQueryModernEntry,
      "@tanstack/react-query-devtools": tanstackDevtoolsModernEntry,
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_BASE_URL}/api/v1/:path*`,
      },
      {
        source: "/health",
        destination: `${API_BASE_URL}/health`,
      },
    ];
  },
};

export default nextConfig;
