/** Public URLs and brand constants. The app is served under {@link SITE.toolsUrl} via basePath. */
/**
 * The app is served at srutved.com/tools through a rewrite on the main site, so every route and asset
 * lives under this base path. Used by next.config.ts, the PDF font loader and analytics.
 */
export const BASE_PATH = "/tools";

export const SITE = {
  name: "Srutved Tools",
  company: "Srutved",
  /** Main website. Tool pages declare canonical URLs on this domain, never on the deployment URL. */
  url: "https://www.srutved.com",
  toolsUrl: "https://www.srutved.com/tools",
  contactUrl: "https://www.srutved.com/contact",
  repoUrl: "https://github.com/srutved/srutved-tools",
  description:
    "Free, open-source business tools by Srutved. No sign-up, no watermark - everything runs in your browser and your data never leaves your device.",
} as const;

/** Absolute URL of a tool page on the public domain, e.g. toolUrl("invoice-generator"). */
export const toolUrl = (slug?: string) => (slug ? `${SITE.toolsUrl}/${slug}` : SITE.toolsUrl);
