/**
 * The app is served at srutved.com/tools through a rewrite on the main site, so every route and asset
 * lives under this base path. Used by next.config.ts, the PDF font loader and analytics.
 */
export const BASE_PATH = "/tools";

/** Public URLs and brand constants. */
export const SITE = {
  name: "Srutved Tools",
  company: "Srutved",
  /** Main website. Tool pages declare canonical URLs on this domain, never on the deployment URL. */
  url: "https://www.srutved.com",
  toolsUrl: `https://www.srutved.com${BASE_PATH}`,
  contactUrl: "https://www.srutved.com/contact",
  repoUrl: "https://github.com/srutved/srutved-tools",
  /** The organisation declared in the main site's structured data; tools refer to the same entity. */
  organizationId: "https://www.srutved.com/#organization",
  description:
    "Free, open-source business tools by Srutved. No sign-up, no watermark - everything runs in your browser and your data never leaves your device.",
  locale: "en_IN",
  themeColor: "#22c55e",
  social: {
    xHandle: "@srutved",
    x: "https://x.com/srutved",
    instagram: "https://www.instagram.com/srutved",
    linkedin: "https://www.linkedin.com/company/srutved",
  },
} as const;

/**
 * Srutved's contact page, tagged with the tool the visitor came from so enquiries can be traced
 * back to it in the main site's analytics.
 */
export const contactUrlFrom = (toolSlug: string) =>
  `${SITE.contactUrl}?utm_source=srutved-tools&utm_medium=tool&utm_campaign=${toolSlug}`;

/** Absolute URL of a tool page on the public domain, e.g. toolUrl("invoice-generator"). */
export const toolUrl = (slug?: string) => (slug ? `${SITE.toolsUrl}/${slug}` : SITE.toolsUrl);
