import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/api/search/contributors",
      headers: [
        {
          key: "Vercel-CDN-Cache-Control",
          value: "s-maxage=60, stale-while-revalidate=3600",
        },
      ],
    },
    {
      source: "/api/parties/:owner/:projectId/contributors",
      headers: [
        {
          key: "Vercel-CDN-Cache-Control",
          value: "s-maxage=60, stale-while-revalidate=3600",
        },
      ],
    },
  ],
};

export default nextConfig;
