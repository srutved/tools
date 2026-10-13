import type { NextConfig } from "next";
import { BASE_PATH } from "./src/config/site";

const nextConfig: NextConfig = {
  // The tools are served at https://www.srutved.com/tools via a rewrite on the main site,
  // so every route and asset of this app lives under /tools.
  basePath: BASE_PATH,
  poweredByHeader: false,
  async redirects() {
    // The bare deployment URL (e.g. srutved-tools.vercel.app/) has no page of its own.
    return [{ source: "/", destination: BASE_PATH, basePath: false, permanent: false }];
  },
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
