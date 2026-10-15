import {
  BadgeIndianRupee,
  Calculator,
  FileSignature,
  FileText,
  FileUser,
  House,
  Mail,
  Percent,
  ReceiptText,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type ToolCategoryId = "billing" | "careers" | "hr" | "agreements";

export interface ToolCategory {
  id: ToolCategoryId;
  name: string;
  /** One line under the category heading. */
  description: string;
}

/** How the tools are grouped in the hub, the header menu and the footer, in this order. */
export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "billing",
    name: "Invoicing & billing",
    description: "Quote, bill and get paid, with GST, VAT or any currency.",
  },
  {
    id: "hr",
    name: "HR & payroll",
    description: "Payslips, offer and experience letters, and salary maths for small teams.",
  },
  {
    id: "careers",
    name: "Resumes & job search",
    description: "Stand out with a resume and cover letter that match.",
  },
  {
    id: "agreements",
    name: "Agreements & rent",
    description: "Put work in writing, and claim HRA on the rent you pay.",
  },
];

export interface ToolDefinition {
  slug: string;
  name: string;
  /** Short name for menus, e.g. "Invoices". */
  navLabel: string;
  /** One line for cards and navigation. */
  tagline: string;
  icon: LucideIcon;
  category: ToolCategoryId;
  /** Generators make documents (with designs and PDFs); calculators work numbers out on the page. */
  kind: "generator" | "calculator";
  status: "live" | "coming-soon";
  /** Extra public pages under the tool, e.g. /<slug>/templates, linked from the tool page. */
  subPages?: { slug: string; label: string }[];
  /** Suggested after a download: the tool people usually need next. */
  nextStep?: { slug: string; text: string };
  /** A short, relevant pitch for Srutved's custom software, shown under the tool. */
  promo?: { heading: string; text: string };
}

/**
 * Every tool in the app. The /tools hub, the header menu, the footer and the sitemap are generated
 * from this list, so adding a tool here is all it takes to make it discoverable.
 */
export const TOOLS: ToolDefinition[] = [
  /* ------------------------------------------------------------------ Invoicing & billing */
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    navLabel: "Invoices",
    tagline: "Professional invoices in any currency, with GST, VAT and UPI QR codes.",
    icon: ReceiptText,
    category: "billing",
    kind: "generator",
    status: "live",
    subPages: [
      { slug: "templates", label: "Invoice templates" },
      { slug: "formats", label: "Invoice formats by profession" },
    ],
    nextStep: { slug: "quotation-generator", text: "Quote your next project in the same design." },
    promo: {
      heading: "Sending lots of invoices?",
      text: "We build custom billing, payments and accounting systems that fit how your business works - with GST, reminders and dashboards built in.",
    },
  },
  {
    slug: "quotation-generator",
    name: "Quotation Generator",
    navLabel: "Quotations",
    tagline: "Quotes and estimates in any currency, with GST or VAT. Convert to an invoice in one click.",
    icon: Calculator,
    category: "billing",
    kind: "generator",
    status: "live",
    subPages: [
      { slug: "templates", label: "Quotation templates" },
      { slug: "formats", label: "Quotation formats by business" },
    ],
    nextStep: {
      slug: "invoice-generator",
      text: "When the client accepts, use “Convert to invoice” to bill them without retyping.",
    },
    promo: {
      heading: "Quotes, approvals and invoices in one place?",
      text: "We build custom business software that takes a lead from quote to payment, so nothing slips through the cracks.",
    },
  },
  {
    slug: "gst-calculator",
    name: "GST Calculator",
    navLabel: "GST calculator",
    tagline: "Add or remove GST at any rate, with the CGST, SGST or IGST split.",
    icon: Percent,
    category: "billing",
    kind: "calculator",
    status: "live",
    nextStep: { slug: "invoice-generator", text: "Put it on a GST invoice." },
    promo: {
      heading: "GST on every sale, worked out for you?",
      text: "We build billing and point-of-sale systems with GST, e-invoicing and reports built in.",
    },
  },

  /* ------------------------------------------------------------------ HR & payroll */
  {
    slug: "salary-slip-generator",
    name: "Salary Slip Generator",
    navLabel: "Salary slips",
    tagline: "Professional payslips with earnings, deductions and net pay in words. Next month in one click.",
    icon: Wallet,
    category: "hr",
    kind: "generator",
    status: "live",
    nextStep: { slug: "hr-letter-generator", text: "Need an offer or experience letter too?" },
    promo: {
      heading: "Running payroll every month?",
      text: "We build custom HR and payroll software: attendance, salary runs, payslips and compliance reports, all in one place.",
    },
  },
  {
    slug: "hr-letter-generator",
    name: "HR Letter Generator",
    navLabel: "HR letters",
    tagline: "Offer, appointment, experience and relieving letters on your letterhead, ready to sign.",
    icon: FileUser,
    category: "hr",
    kind: "generator",
    status: "live",
    subPages: [{ slug: "templates", label: "HR letter templates" }],
    nextStep: { slug: "salary-slip-generator", text: "Pay your new hire with a matching payslip." },
    promo: {
      heading: "Hiring and onboarding every month?",
      text: "We build HR software with offer letters, e-signatures, onboarding checklists and employee records in one place.",
    },
  },
  {
    slug: "salary-calculator",
    name: "Salary Calculator",
    navLabel: "Salary calculator",
    tagline: "Turn CTC into monthly in-hand salary, after PF, professional tax and income tax.",
    icon: BadgeIndianRupee,
    category: "hr",
    kind: "calculator",
    status: "live",
    nextStep: { slug: "salary-slip-generator", text: "Turn this salary into a payslip." },
    promo: {
      heading: "Payroll for your whole team?",
      text: "We build payroll software that works out salaries, PF, TDS and payslips for everyone, every month.",
    },
  },

  /* ------------------------------------------------------------------ Resumes & job search */
  {
    slug: "resume-builder",
    name: "Resume Builder",
    navLabel: "Resumes",
    tagline: "ATS-friendly resumes in 15 templates, with free PDF download and no watermark.",
    icon: FileText,
    category: "careers",
    kind: "generator",
    status: "live",
    subPages: [
      { slug: "templates", label: "Resume templates" },
      { slug: "examples", label: "Resume examples by job" },
    ],
    nextStep: {
      slug: "cover-letter-builder",
      text: "Write a cover letter in the matching design - your details fill in automatically.",
    },
    promo: {
      heading: "Hiring for your startup?",
      text: "Srutved builds recruitment portals, job boards and HR tools - and MVPs for any idea, often in 15 days.",
    },
  },
  {
    slug: "cover-letter-builder",
    name: "Cover Letter Builder",
    navLabel: "Cover letters",
    tagline: "Cover letters that match your resume template, filled in from your saved resume.",
    icon: Mail,
    category: "careers",
    kind: "generator",
    status: "live",
    subPages: [
      { slug: "templates", label: "Cover letter templates" },
      { slug: "examples", label: "Cover letter examples by job" },
    ],
    nextStep: { slug: "resume-builder", text: "Need the matching resume? Pick the same template there." },
    promo: {
      heading: "Building a career platform?",
      text: "We build job portals, learning platforms and other web and mobile apps - often as an MVP in 15 days.",
    },
  },

  /* ------------------------------------------------------------------ Agreements & rent */
  {
    slug: "contract-generator",
    name: "Contract Generator",
    navLabel: "Contracts",
    tagline: "Freelance agreements, NDAs and statements of work from plain-English templates.",
    icon: FileSignature,
    category: "agreements",
    kind: "generator",
    status: "live",
    subPages: [{ slug: "templates", label: "Contract templates" }],
    nextStep: {
      slug: "invoice-generator",
      text: "Once the work is delivered, bill your client with a matching invoice.",
    },
    promo: {
      heading: "Contracts and onboarding inside your own app?",
      text: "We build client portals with e-signatures, onboarding flows and document automation for service businesses.",
    },
  },
  {
    slug: "rent-receipt-generator",
    name: "Rent Receipt Generator",
    navLabel: "Rent receipts",
    tagline: "Monthly rent receipts for HRA, with landlord PAN and signature, for the whole year in one PDF.",
    icon: House,
    category: "agreements",
    kind: "generator",
    status: "live",
    nextStep: { slug: "hra-calculator", text: "See how much of your HRA is tax-free." },
    promo: {
      heading: "Managing rentals?",
      text: "We build property management apps that track tenants, collect rent online and send receipts automatically.",
    },
  },
  {
    slug: "hra-calculator",
    name: "HRA Calculator",
    navLabel: "HRA calculator",
    tagline: "How much of your house rent allowance is tax-free, under the latest metro city rules.",
    icon: Calculator,
    category: "agreements",
    kind: "calculator",
    status: "live",
    nextStep: { slug: "rent-receipt-generator", text: "Make the rent receipts your employer will ask for." },
    promo: {
      heading: "Building a fintech or tax app?",
      text: "We build web and mobile apps for fintech startups - calculators, dashboards and full products, often as an MVP in 15 days.",
    },
  },
];

export const LIVE_TOOLS = TOOLS.filter((tool) => tool.status === "live");

/** The live tools in each category, in category order; empty categories are left out. */
export const toolsByCategory = (tools: ToolDefinition[] = LIVE_TOOLS) =>
  TOOL_CATEGORIES.map((category) => ({
    category,
    tools: tools.filter((tool) => tool.category === category.id),
  })).filter((group) => group.tools.length > 0);

/** Other live tools for "More free tools": the same category first, then the next step, then the rest. */
export function relatedTools(slug: string, limit = 4): ToolDefinition[] {
  const tool = getTool(slug);
  const others = LIVE_TOOLS.filter((candidate) => candidate.slug !== slug);
  const rank = (candidate: ToolDefinition) =>
    candidate.category === tool.category ? 0 : candidate.slug === tool.nextStep?.slug ? 1 : 2;
  return [...others].sort((a, b) => rank(a) - rank(b)).slice(0, limit);
}

export function getTool(slug: string): ToolDefinition {
  const tool = TOOLS.find((candidate) => candidate.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}
