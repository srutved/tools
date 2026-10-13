import type { Faq } from "@/lib/seo";

/**
 * The written content around a tool: what search engines index and what helps people use it.
 * Each tool provides one of these from its own `content.ts`.
 */
export interface ToolContent {
  /** Page <title> and social title. */
  metaTitle: string;
  metaDescription: string;
  /** Visible H1. */
  heading: string;
  intro: string;
  howItWorks: { title: string; text: string }[];
  features: { title: string; text: string }[];
  faqs: Faq[];
}
