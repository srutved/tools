import type { MetadataRoute } from "next";
import { toolUrl } from "@/config/site";
import { LIVE_TOOLS } from "@/tools/registry";

/**
 * Served at /tools/sitemap.xml. URLs point at the public srutved.com domain. Reference this file
 * from the main site's robots.txt so search engines find it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: toolUrl(), changeFrequency: "weekly", priority: 0.8 },
    ...LIVE_TOOLS.flatMap((tool) => [
      { url: toolUrl(tool.slug), changeFrequency: "weekly" as const, priority: 0.9 },
      ...(tool.subPages ?? []).map((page) => ({
        url: toolUrl(`${tool.slug}/${page}`),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ]),
  ];
}
