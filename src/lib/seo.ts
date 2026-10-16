import type { Metadata } from "next";
import { SITE } from "@/config/site";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Absolute public URL of the page (always on srutved.com, never the deployment URL). */
  url: string;
}

/**
 * Capitalises the first letter of every word (including after "-" and "/") and leaves the rest as
 * written, so names like MVP, GST, VAT and PDF keep their casing. Matches the main site's titles.
 */
export function toTitleCase(text: string): string {
  return text.replace(
    /(^|[\s(/-])([a-z])(?![A-Z])/g,
    (_, separator: string, letter: string) => separator + letter.toUpperCase(),
  );
}

/**
 * Page metadata with a canonical URL on the public domain. This is what makes search engines
 * credit srutved.com even though the app is deployed separately and served through a rewrite.
 * Social preview images come from each route's opengraph-image.tsx.
 */
export function buildMetadata({ title: rawTitle, description, url }: PageMetadataInput): Metadata {
  const title = toTitleCase(rawTitle);
  const fullTitle = `${title} | ${SITE.titleSuffix}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      locale: SITE.locale,
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.social.xHandle,
      creator: SITE.social.xHandle,
      title: fullTitle,
      description,
    },
  };
}

export interface Faq {
  question: string;
  answer: string;
}

/** The publisher of everything here: the same organisation the main site declares. */
const publisher = { "@type": "Organization", "@id": SITE.organizationId, name: SITE.company, url: SITE.url };

export function softwareApplicationJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher,
  };
}

/** A page that lists items, e.g. the tools hub or the template gallery. */
export function collectionPageJsonLd({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    publisher,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(item.url && { url: item.url }),
      })),
    },
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
