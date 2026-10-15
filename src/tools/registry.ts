import {
  Calculator,
  FileSignature,
  FileText,
  House,
  Mail,
  Wallet,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

export interface ToolDefinition {
  slug: string;
  name: string;
  /** Short name for the header navigation, e.g. "Invoice". */
  navLabel: string;
  /** One line for cards and navigation. */
  tagline: string;
  icon: LucideIcon;
  status: "live" | "coming-soon";
  /** Extra public pages under the tool, e.g. /<slug>/templates, linked from the tool page. */
  subPages?: { slug: string; label: string }[];
  /** Suggested after a download: the tool people usually need next. */
  nextStep?: { slug: string; text: string };
  /** A short, relevant pitch for Srutved's custom software, shown under the tool. */
  promo?: { heading: string; text: string };
}

/**
 * Every tool in the app. The /tools hub, the header navigation and the sitemap are generated from
 * this list, so adding a tool here is all it takes to make it discoverable.
 */
export const TOOLS: ToolDefinition[] = [
  {
    slug: "invoice-generator",
    promo: {
      heading: "Sending lots of invoices?",
      text: "We build custom billing, payments and accounting systems that fit how your business works - with GST, reminders and dashboards built in.",
    },
    nextStep: { slug: "quotation-generator", text: "Quote your next project in the same design." },
    name: "Invoice Generator",
    navLabel: "Invoices",
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
    promo: {
      heading: "Quotes, approvals and invoices in one place?",
      text: "We build custom business software that takes a lead from quote to payment, so nothing slips through the cracks.",
    },
    nextStep: {
      slug: "invoice-generator",
      text: "When the client accepts, use “Convert to invoice” to bill them without retyping.",
    },
    name: "Quotation Generator",
    navLabel: "Quotes",
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
    promo: {
      heading: "Hiring for your startup?",
      text: "Srutved builds recruitment portals, job boards and HR tools - and MVPs for any idea, often in 15 days.",
    },
    nextStep: {
      slug: "cover-letter-builder",
      text: "Write a cover letter in the matching design - your details fill in automatically.",
    },
    name: "Resume Builder",
    navLabel: "Resumes",
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
    promo: {
      heading: "Building a career platform?",
      text: "We build job portals, learning platforms and other web and mobile apps - often as an MVP in 15 days.",
    },
    nextStep: { slug: "resume-builder", text: "Need the matching resume? Pick the same template there." },
    name: "Cover Letter Builder",
    navLabel: "Cover letters",
    tagline: "Cover letters that match your resume template, filled in from your saved resume.",
    icon: Mail,
    status: "live",
    subPages: [
      { slug: "templates", label: "Cover letter templates" },
      { slug: "examples", label: "Cover letter examples by job" },
    ],
  },
  {
    slug: "contract-generator",
    promo: {
      heading: "Contracts and onboarding inside your own app?",
      text: "We build client portals with e-signatures, onboarding flows and document automation for service businesses.",
    },
    nextStep: {
      slug: "invoice-generator",
      text: "Once the work is delivered, bill your client with a matching invoice.",
    },
    name: "Contract Generator",
    navLabel: "Contracts",
    tagline: "Freelance agreements, NDAs and statements of work from plain-English templates.",
    icon: FileSignature,
    status: "live",
    subPages: [{ slug: "templates", label: "Contract templates" }],
  },
  {
    slug: "rent-receipt-generator",
    promo: {
      heading: "Managing rentals?",
      text: "We build property management apps that track tenants, collect rent online and send receipts automatically.",
    },
    name: "Rent Receipt Generator",
    navLabel: "Rent receipts",
    tagline: "Monthly rent receipts for HRA, with landlord PAN and signature, for the whole year in one PDF.",
    icon: House,
    status: "live",
  },
  {
    slug: "salary-slip-generator",
    promo: {
      heading: "Running payroll every month?",
      text: "We build custom HR and payroll software: attendance, salary runs, payslips and compliance reports, all in one place.",
    },
    name: "Salary Slip Generator",
    navLabel: "Payslips",
    tagline: "Professional payslips with earnings, deductions and net pay in words. Next month in one click.",
    icon: Wallet,
    status: "live",
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
