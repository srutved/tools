import { Calculator, FileSignature, FileText, Mail, ReceiptText, type LucideIcon } from "lucide-react";

export interface ToolDefinition {
  slug: string;
  name: string;
  /** One line for cards and navigation. */
  tagline: string;
  icon: LucideIcon;
  status: "live" | "coming-soon";
  /** Extra public pages under the tool, e.g. /<slug>/templates, linked from the tool page. */
  subPages?: { slug: string; label: string }[];
  /** Suggested after a download: the tool people usually need next. */
  nextStep?: { slug: string; text: string };
}

/**
 * Every tool in the app. The /tools hub, the header navigation and the sitemap are generated from
 * this list, so adding a tool here is all it takes to make it discoverable.
 */
export const TOOLS: ToolDefinition[] = [
  {
    slug: "invoice-generator",
    nextStep: { slug: "quotation-generator", text: "Quote your next project in the same design." },
    name: "Invoice Generator",
    tagline: "Professional invoices in any currency, with GST, VAT and UPI QR codes.",
    icon: ReceiptText,
    status: "live",
    subPages: [
      { slug: "templates", label: "Invoice templates" },
      { slug: "formats", label: "Invoice formats by profession" },
    ],
  },
  {
    slug: "quotation-generator",
    nextStep: {
      slug: "invoice-generator",
      text: "When the client accepts, use “Convert to invoice” to bill them without retyping.",
    },
    name: "Quotation Generator",
    tagline: "Quotes and estimates in any currency, with GST or VAT. Convert to an invoice in one click.",
    icon: Calculator,
    status: "live",
    subPages: [
      { slug: "templates", label: "Quotation templates" },
      { slug: "formats", label: "Quotation formats by business" },
    ],
  },
  {
    slug: "resume-builder",
    nextStep: {
      slug: "cover-letter-builder",
      text: "Write a cover letter in the matching design - your details fill in automatically.",
    },
    name: "Resume Builder",
    tagline: "ATS-friendly resumes in 15 templates, with free PDF download and no watermark.",
    icon: FileText,
    status: "live",
    subPages: [
      { slug: "templates", label: "Resume templates" },
      { slug: "examples", label: "Resume examples by job" },
    ],
  },
  {
    slug: "cover-letter-builder",
    nextStep: { slug: "resume-builder", text: "Need the matching resume? Pick the same template there." },
    name: "Cover Letter Builder",
    tagline: "Cover letters that match your resume template, filled in from your saved resume.",
    icon: Mail,
    status: "live",
    subPages: [{ slug: "templates", label: "Cover letter templates" }],
  },
  {
    slug: "contract-generator",
    nextStep: {
      slug: "invoice-generator",
      text: "Once the work is delivered, bill your client with a matching invoice.",
    },
    name: "Contract Generator",
    tagline: "Freelance agreements, NDAs and statements of work from plain-English templates.",
    icon: FileSignature,
    status: "live",
    subPages: [{ slug: "templates", label: "Contract templates" }],
  },
];

export const LIVE_TOOLS = TOOLS.filter((tool) => tool.status === "live");

/** The other live tools, for "More free tools" links. */
export const relatedTools = (slug: string) => LIVE_TOOLS.filter((tool) => tool.slug !== slug);

export function getTool(slug: string): ToolDefinition {
  const tool = TOOLS.find((candidate) => candidate.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}
