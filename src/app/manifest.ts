import type { MetadataRoute } from "next";
import { BASE_PATH, SITE } from "@/config/site";

/** Web app manifest, served at /tools/manifest.webmanifest. Lets people install the tools as an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    id: `${BASE_PATH}/`,
    start_url: `${BASE_PATH}/`,
    scope: `${BASE_PATH}/`,
    display: "standalone",
    background_color: "#fffefc",
    theme_color: SITE.themeColor,
    categories: ["business", "productivity", "finance"],
    icons: [
      {
        src: `${BASE_PATH}/web-app-manifest-192x192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: `${BASE_PATH}/web-app-manifest-512x512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
