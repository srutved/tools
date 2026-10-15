import type { Faq } from "@/lib/seo";

/**
 * A landing page for one specific need, e.g. "Software engineer resume" or "Invoice format for
 * photographers": a ready-made example document plus guidance written for that search. Visitors
 * open the example in the tool with one click and make it their own.
 */
export interface UseCase<T> {
  slug: string;
  /** Short name for cards, breadcrumbs and links, e.g. "Software Engineer". */
  name: string;
  /** One line for cards on the index page. */
  summary: string;
  metaTitle: string;
  metaDescription: string;
  /** Visible H1. */
  heading: string;
  intro: string;
  /** A short checklist beside the example, e.g. "Skills to include". */
  highlights: { title: string; items: string[] };
  guide: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  faqs: Faq[];
  /** The example document, opened in the tool by "Use this example". */
  document: T;
}

/** A tool's set of use-case pages, e.g. the resume examples at /resume-builder/examples. */
export interface UseCaseCollection {
  toolSlug: string;
  /** URL segment: /<tool>/<segment>/<slug>. */
  segment: "examples" | "formats" | "templates";
  /** e.g. "Resume Examples". */
  title: string;
  /** e.g. "resume". */
  noun: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
}
