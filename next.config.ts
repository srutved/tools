import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The tools are served at https://www.srutved.com/tools via a rewrite on the main site,
  // so every route and asset of this app lives under /tools.
  basePath: "/tools",
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
