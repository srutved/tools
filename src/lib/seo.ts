import type { Metadata } from "next";
import { SITE } from "@/config/site";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Absolute public URL of the page (always on srutved.com, never the deployment URL). */
  url: string;
}

/**
 * Page metadata with a canonical URL on the public domain. This is what makes search engines
 * credit srutved.com even though the app is deployed separately and served through a rewrite.
 */
export function buildMetadata({ title, description, url }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE.name, type: "website", locale: "en" },
    twitter: { card: "summary", title, description },
  };
}

export interface Faq {
  question: string;
  answer: string;
}

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
    publisher: { "@type": "Organization", name: SITE.company, url: SITE.url },
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
