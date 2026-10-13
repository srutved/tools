import { FileSignature, FileText, ReceiptText, type LucideIcon } from "lucide-react";

export interface ToolDefinition {
  slug: string;
  name: string;
  /** One line for cards and navigation. */
  tagline: string;
  icon: LucideIcon;
  status: "live" | "coming-soon";
  /** Extra public pages under the tool, e.g. ["templates"] for /<slug>/templates. */
  subPages?: string[];
}

/**
 * Every tool in the app. The /tools hub, the header navigation and the sitemap are generated from
 * this list, so adding a tool here is all it takes to make it discoverable.
 */
export const TOOLS: ToolDefinition[] = [
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    tagline: "Professional invoices in any currency, with GST, VAT and UPI QR codes.",
    icon: ReceiptText,
    status: "live",
    subPages: ["templates"],
  },
  {
    slug: "resume-builder",
    name: "Resume Builder",
    tagline: "ATS-friendly resumes in 15 templates, with free PDF download and no watermark.",
    icon: FileText,
    status: "live",
    subPages: ["templates"],
  },
  {
    slug: "contract-generator",
    name: "Contract Generator",
    tagline: "Freelance agreements, NDAs and statements of work from plain-English templates.",
    icon: FileSignature,
    status: "coming-soon",
  },
];

export const LIVE_TOOLS = TOOLS.filter((tool) => tool.status === "live");

export function getTool(slug: string): ToolDefinition {
  const tool = TOOLS.find((candidate) => candidate.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}
