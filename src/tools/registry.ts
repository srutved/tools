import {
  BadgeIndianRupee,
  Calculator,
  ChartLine,
  Coins,
  FileClock,
  FileMinus2,
  FilePlus2,
  FileSignature,
  FileText,
  FileUser,
  HandCoins,
  House,
  Landmark,
  Mail,
  Percent,
  PiggyBank,
  Receipt,
  ReceiptText,
  Repeat,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type ToolCategoryId = "billing" | "sales" | "hr" | "finance" | "careers" | "agreements";

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
    name: "Invoicing & GST",
    description: "Bill, adjust and record payments, with GST, VAT or any currency.",
  },
  {
    id: "sales",
    name: "Quotes, orders & delivery",
    description: "From the first quote to the purchase order and the goods on the truck.",
  },
  {
    id: "hr",
    name: "HR & payroll",
    description: "Payslips, offer and experience letters, and salary maths for small teams.",
  },
  {
    id: "finance",
    name: "Loans & investments",
    description: "Work out EMIs, interest and how your savings grow.",
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
  /* ------------------------------------------------------------------ Invoicing & GST */
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
    category: "sales",
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
    slug: "proforma-invoice-generator",
    name: "Proforma Invoice Generator",
    navLabel: "Proforma invoices",
    tagline: "Proforma invoices for advance payments and export orders, with GST and any currency.",
    icon: FileClock,
    category: "billing",
    kind: "generator",
    status: "live",
    nextStep: { slug: "invoice-generator", text: "When the order is confirmed, raise the final invoice." },
    promo: {
      heading: "Billing that runs itself?",
      text: "We build custom billing and accounting software with GST, e-invoicing, payment tracking and reports built in.",
    },
  },
  {
    slug: "receipt-generator",
    name: "Receipt Generator",
    navLabel: "Payment receipts",
    tagline: "Payment receipts for cash, UPI, bank or cheque payments, against any invoice.",
    icon: Receipt,
    category: "billing",
    kind: "generator",
    status: "live",
    nextStep: { slug: "invoice-generator", text: "Need the invoice for this payment too?" },
    promo: {
      heading: "Collecting payments online?",
      text: "We build payment collection, reminders and automatic receipts into custom billing apps.",
    },
  },
  {
    slug: "credit-note-generator",
    name: "Credit Note Generator",
    navLabel: "Credit notes",
    tagline: "GST credit notes for returns, discounts and overcharged invoices.",
    icon: FileMinus2,
    category: "billing",
    kind: "generator",
    status: "live",
    nextStep: { slug: "invoice-generator", text: "Raise a corrected invoice in the same design." },
    promo: {
      heading: "Billing that runs itself?",
      text: "We build custom billing and accounting software with GST, e-invoicing, payment tracking and reports built in.",
    },
  },
  {
    slug: "debit-note-generator",
    name: "Debit Note Generator",
    navLabel: "Debit notes",
    tagline: "GST debit notes when an invoice undercharged, or for extra charges.",
    icon: FilePlus2,
    category: "billing",
    kind: "generator",
    status: "live",
    nextStep: { slug: "credit-note-generator", text: "Reducing an invoice instead? Use a credit note." },
    promo: {
      heading: "Billing that runs itself?",
      text: "We build custom billing and accounting software with GST, e-invoicing, payment tracking and reports built in.",
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

  {
    slug: "purchase-order-generator",
    name: "Purchase Order Generator",
    navLabel: "Purchase orders",
    tagline: "Purchase orders to your suppliers, with delivery dates, GST and terms.",
    icon: ShoppingCart,
    category: "sales",
    kind: "generator",
    status: "live",
    nextStep: {
      slug: "delivery-challan-generator",
      text: "Shipping goods? Send them with a delivery challan.",
    },
    promo: {
      heading: "Managing purchases and stock?",
      text: "We build inventory and procurement software with purchase orders, approvals and supplier tracking.",
    },
  },
  {
    slug: "delivery-challan-generator",
    name: "Delivery Challan Generator",
    navLabel: "Delivery challans",
    tagline: "Delivery challans for goods sent on approval, for job work or between branches.",
    icon: Truck,
    category: "sales",
    kind: "generator",
    status: "live",
    nextStep: { slug: "invoice-generator", text: "When the goods are sold, raise the tax invoice." },
    promo: {
      heading: "Shipping goods every day?",
      text: "We build logistics and order-management apps with challans, e-way bills and delivery tracking.",
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

  {
    slug: "gratuity-calculator",
    name: "Gratuity Calculator",
    navLabel: "Gratuity calculator",
    tagline: "Gratuity under the new labour codes, including the one-year rule for fixed-term staff.",
    icon: HandCoins,
    category: "hr",
    kind: "calculator",
    status: "live",
    nextStep: { slug: "hr-letter-generator", text: "Write the relieving and experience letters." },
    promo: {
      heading: "Payroll for your whole team?",
      text: "We build payroll software that works out salaries, PF, gratuity, TDS and payslips for everyone, every month.",
    },
  },
  {
    slug: "pf-calculator",
    name: "PF Calculator",
    navLabel: "PF calculator",
    tagline: "Your EPF balance at retirement, with employer and employee contributions and interest.",
    icon: PiggyBank,
    category: "hr",
    kind: "calculator",
    status: "live",
    nextStep: { slug: "salary-calculator", text: "See your take-home pay after PF." },
    promo: {
      heading: "Payroll for your whole team?",
      text: "We build payroll software that works out salaries, PF, gratuity, TDS and payslips for everyone, every month.",
    },
  },

  /* ------------------------------------------------------------------ Loans & investments */
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    navLabel: "EMI calculator",
    tagline: "Monthly EMI, total interest and the full repayment schedule for any loan.",
    icon: Landmark,
    category: "finance",
    kind: "calculator",
    status: "live",
    nextStep: { slug: "fd-calculator", text: "Saving up instead? See what a fixed deposit earns." },
    promo: {
      heading: "Building a fintech product?",
      text: "We build lending, investment and personal-finance apps for startups, often as an MVP in 15 days.",
    },
  },
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    navLabel: "SIP calculator",
    tagline: "What a monthly SIP could grow to, with an optional yearly step-up.",
    icon: ChartLine,
    category: "finance",
    kind: "calculator",
    status: "live",
    nextStep: { slug: "ppf-calculator", text: "Compare it with a PPF account." },
    promo: {
      heading: "Building a fintech product?",
      text: "We build lending, investment and personal-finance apps for startups, often as an MVP in 15 days.",
    },
  },
  {
    slug: "fd-calculator",
    name: "FD Calculator",
    navLabel: "FD calculator",
    tagline: "Fixed deposit maturity and interest, compounded the way banks do.",
    icon: ShieldCheck,
    category: "finance",
    kind: "calculator",
    status: "live",
    nextStep: { slug: "rd-calculator", text: "Saving monthly? Try the RD calculator." },
    promo: {
      heading: "Building a fintech product?",
      text: "We build lending, investment and personal-finance apps for startups, often as an MVP in 15 days.",
    },
  },
  {
    slug: "rd-calculator",
    name: "RD Calculator",
    navLabel: "RD calculator",
    tagline: "Recurring deposit maturity for monthly savings, with quarterly compounding.",
    icon: Repeat,
    category: "finance",
    kind: "calculator",
    status: "live",
    nextStep: { slug: "sip-calculator", text: "See what the same amount could do in a SIP." },
    promo: {
      heading: "Building a fintech product?",
      text: "We build lending, investment and personal-finance apps for startups, often as an MVP in 15 days.",
    },
  },
  {
    slug: "ppf-calculator",
    name: "PPF Calculator",
    navLabel: "PPF calculator",
    tagline: "Public Provident Fund maturity at the current rate, year by year.",
    icon: Sprout,
    category: "finance",
    kind: "calculator",
    status: "live",
    nextStep: { slug: "sip-calculator", text: "Compare it with a SIP." },
    promo: {
      heading: "Building a fintech product?",
      text: "We build lending, investment and personal-finance apps for startups, often as an MVP in 15 days.",
    },
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    navLabel: "Compound interest",
    tagline: "How money grows with compound interest, with optional regular deposits.",
    icon: Coins,
    category: "finance",
    kind: "calculator",
    status: "live",
    nextStep: { slug: "fd-calculator", text: "Put it to work in a fixed deposit." },
    promo: {
      heading: "Building a fintech product?",
      text: "We build lending, investment and personal-finance apps for startups, often as an MVP in 15 days.",
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
