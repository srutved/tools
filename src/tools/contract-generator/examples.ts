import type { UseCase, UseCaseCollection } from "@/components/tool/use-case";
import type { Contract, ContractParty } from "./schema";

/*
 * Contract templates: one landing page per kind of agreement (/contract-generator/templates/<slug>),
 * each with a complete example that opens in the generator with "Use this example".
 */

export const CONTRACT_TEMPLATES_COLLECTION: UseCaseCollection = {
  toolSlug: "contract-generator",
  segment: "templates",
  title: "Contract Templates",
  noun: "contract",
  metaTitle: "Free Contract Templates - Freelance Agreement, NDA & SOW (PDF)",
  metaDescription:
    "Free contract templates in plain English: freelance agreement, website development and social media contracts, NDA, mutual NDA and statement of work. Edit online and download a PDF.",
  intro:
    "Plain-English contract templates for freelancers and small businesses. Open one in the free contract generator, fill in your details and download a ready-to-sign PDF.",
};

let counter = 0;
const id = () => `contract-${++counter}`;

const party = (
  name: string,
  address: string,
  email: string,
  signatory = "",
  signatoryTitle = "",
): ContractParty => ({
  name,
  address,
  email,
  signatory,
  signatoryTitle,
});

const BASE: Contract = {
  kind: "service",
  templateId: "classic-navy",
  title: "",
  effectiveDate: "2026-10-15",
  you: party("", "", ""),
  other: party("", "", ""),
  projectName: "",
  overview: "",
  scope: "",
  deliverables: [],
  outOfScope: "",
  assumptions: "",
  acceptanceCriteria: "",
  masterAgreement: "",
  startDate: "2026-10-15",
  endDate: "",
  payment: {
    currency: "INR",
    structure: "fixed",
    amount: 0,
    hoursCap: 0,
    milestones: [],
    dueDays: 15,
    lateFeePercent: 0,
  },
  revisions: 2,
  ipOwnership: "assign-on-payment",
  portfolioUse: true,
  ndaType: "one-way",
  purpose: "",
  confidentialityYears: 3,
  noticeDays: 15,
  governingLaw: "the laws of India",
  jurisdiction: "Bengaluru, Karnataka",
  disputes: "courts",
  limitLiability: true,
  nonSolicitation: false,
  customClauses: [],
};

const contract = (overrides: Partial<Contract>): Contract => ({
  ...BASE,
  ...overrides,
  payment: { ...BASE.payment, ...overrides.payment },
});

const milestone = (description: string, amount: number) => ({ id: id(), description, amount });
const deliverable = (description: string, date: string) => ({ id: id(), description, date });

const DISCLAIMER_FAQ = {
  question: "Is this contract legally binding?",
  answer:
    "A contract signed by both parties is generally binding if they agreed to its terms freely. These templates are a well-structured starting point, not legal advice: for high-value or unusual agreements, have a lawyer review the final version.",
};

const STAMP_DUTY_FAQ = {
  question: "Does a contract need stamp paper in India?",
  answer:
    "Many agreements in India attract stamp duty, which varies by state and type of agreement. You can print on stamp paper or pay e-stamp duty for your state; an unstamped agreement may not be admissible as evidence until the duty and any penalty are paid.",
};

export const CONTRACT_EXAMPLES: UseCase<Contract>[] = [
  {
    slug: "freelance-contract",
    name: "Freelance Contract",
    summary: "A general services agreement for freelancers.",
    metaTitle: "Freelance Contract Template - Free Freelance Agreement (PDF)",
    metaDescription:
      "A free freelance contract template in plain English: scope, fees, revisions, IP, confidentiality, termination and signatures. Edit online and download a PDF.",
    heading: "Freelance Contract Template",
    intro:
      "A balanced freelance agreement that protects you and reassures clients: what you'll deliver, what it costs, when you're paid, who owns the work and how either side can walk away.",
    highlights: {
      title: "What this freelance contract covers",
      items: [
        "Scope of services and deliverables with dates",
        "Fees, invoice due dates and late payment interest",
        "Rounds of revisions and how acceptance works",
        "Intellectual property that transfers on full payment",
        "Confidentiality, independent contractor status and termination",
        "Governing law, disputes and signature blocks",
      ],
    },
    guide: [
      {
        heading: "Why freelancers need a contract",
        paragraphs: [
          "Most freelance disputes come from unclear expectations: work that grows beyond the original brief, endless revisions, or invoices paid months late. A short contract agreed before you start settles all of these in advance, and clients take a freelancer with a contract more seriously.",
        ],
      },
      {
        heading: "The clauses that matter most",
        paragraphs: [
          "Be specific about scope - list deliverables rather than describing them loosely - and limit revisions. Tie the transfer of intellectual property to full payment, so you keep leverage until you're paid. And give either side a simple way to end the agreement with notice, with payment for work already done.",
        ],
      },
    ],
    faqs: [
      DISCLAIMER_FAQ,
      {
        question: "Should I ask for an advance?",
        answer:
          "For new clients and larger projects, yes. Switch payment to milestones and make the first one due on signing - 30 to 50% is common.",
      },
      STAMP_DUTY_FAQ,
    ],
    document: contract({
      kind: "service",
      templateId: "modern-teal",
      title: "Freelance Services Agreement",
      you: party(
        "Riya Sharma",
        "Flat 302, Green Park Apartments, Pune, Maharashtra 411045",
        "riya@riyadesigns.in",
      ),
      other: party(
        "Brightside Cafe Pvt Ltd",
        "14 FC Road, Shivajinagar, Pune, Maharashtra 411004",
        "owner@brightside.cafe",
        "Aman Gupta",
        "Director",
      ),
      scope:
        "Brand identity design: logo, colour palette and typography\nMenu card and signage design\nTemplates for 10 social media posts",
      deliverables: [
        deliverable("Three logo concepts", "30 October 2026"),
        deliverable("Final brand kit and menu design", "20 November 2026"),
      ],
      endDate: "2026-11-30",
      payment: {
        currency: "INR",
        structure: "milestones",
        amount: 0,
        hoursCap: 0,
        milestones: [
          milestone("On signing this Agreement", 15000),
          milestone("On delivery of the final brand kit", 15000),
        ],
        dueDays: 7,
        lateFeePercent: 1.5,
      },
      jurisdiction: "Pune, Maharashtra",
    }),
  },
  {
    slug: "website-development-agreement",
    name: "Website Development Agreement",
    summary: "Design and development of a business website.",
    metaTitle: "Website Development Agreement Template - Free Contract (PDF)",
    metaDescription:
      "A free website development agreement template: pages, features, milestones, hosting, revisions, ownership and support. Edit online and download a PDF.",
    heading: "Website Development Agreement",
    intro:
      "A website development contract for agencies and freelance developers: pages and features, milestone payments, content responsibilities, ownership of the code and post-launch support.",
    highlights: {
      title: "What to cover in a website contract",
      items: [
        "Pages, features and integrations in scope",
        "Who provides content, images and hosting access",
        "Milestone payments tied to design, build and launch",
        "Revisions and acceptance testing",
        "Ownership of the code and design after payment",
        "Bug fixes and support after launch",
      ],
    },
    guide: [
      {
        heading: "Protect against scope creep",
        paragraphs: [
          "Website projects grow: one more page, one more integration, one more round of changes. List the pages and features precisely, and keep the change-request clause - every addition then gets a quote before work starts.",
        ],
      },
      {
        heading: "Pay by milestone",
        paragraphs: [
          "Tie payments to visible progress: an advance on signing, a payment on design approval, and the balance at launch. Clients see what they're paying for, and you're never far ahead of the money.",
        ],
      },
    ],
    faqs: [
      DISCLAIMER_FAQ,
      {
        question: "Who should own the website code?",
        answer:
          "Clients usually expect to own their website once it's paid for - this template assigns ownership on full payment, while you keep your reusable tools and libraries.",
      },
    ],
    document: contract({
      kind: "service",
      templateId: "modern-indigo",
      title: "Website Development Agreement",
      you: party(
        "Bluefin Web Studio LLP",
        "Office 7, Baner Road, Pune, Maharashtra 411045",
        "hello@bluefin.studio",
        "Kunal Desai",
        "Partner",
      ),
      other: party(
        "Green Leaf Clinics Pvt Ltd",
        "22 Koregaon Park, Pune, Maharashtra 411001",
        "admin@greenleafclinics.in",
        "Dr. Sana Kulkarni",
        "Managing Director",
      ),
      scope:
        "Design and development of a 6-page responsive website\nOnline appointment booking form with email notifications\nBasic on-page SEO and Google Business Profile setup\nHosting setup and launch",
      deliverables: [
        deliverable("Homepage and inner page designs", "1 November 2026"),
        deliverable("Website on a staging link for review", "15 November 2026"),
        deliverable("Live website", "22 November 2026"),
      ],
      endDate: "2026-11-30",
      payment: {
        currency: "INR",
        structure: "milestones",
        amount: 0,
        hoursCap: 0,
        milestones: [
          milestone("Advance on signing", 20000),
          milestone("On approval of designs", 12000),
          milestone("On launch", 12000),
        ],
        dueDays: 7,
        lateFeePercent: 0,
      },
      customClauses: [
        {
          id: id(),
          title: "Support after launch",
          text: "For 30 days after launch, the Service Provider will fix any bugs in the website free of charge. Further support and changes will be quoted separately.",
        },
      ],
      jurisdiction: "Pune, Maharashtra",
    }),
  },
  {
    slug: "social-media-management-contract",
    name: "Social Media Management Contract",
    summary: "A monthly retainer for social media services.",
    metaTitle: "Social Media Management Contract Template - Free (PDF)",
    metaDescription:
      "A free social media management contract template for monthly retainers: posts per month, platforms, approvals, ad spend, reporting and notice period. Edit online and download a PDF.",
    heading: "Social Media Management Contract",
    intro:
      "Social media work is ongoing, so this contract is a monthly retainer: the platforms and number of posts, how approvals work, who pays for ads, and how either side can end it with notice.",
    highlights: {
      title: "What a social media contract should say",
      items: [
        "Platforms and number of posts per month",
        "Content approval process and timelines",
        "Whether ad spend is included or paid by the client",
        "Monthly reporting",
        "Access to accounts and who owns them",
        "Notice period to end the retainer",
      ],
    },
    guide: [
      {
        heading: "Retainers need a notice period",
        paragraphs: [
          "Because the work continues month to month, the most important terms are the monthly fee, what it includes and the notice period. 30 days' notice is common: it gives you time to replace the income and the client time to hand over.",
        ],
      },
      {
        heading: "Keep ad spend separate",
        paragraphs: [
          "Make clear that advertising budgets are paid by the client directly to the platforms, and that your fee covers management only. It avoids you fronting money and disputes about results.",
        ],
      },
    ],
    faqs: [
      DISCLAIMER_FAQ,
      {
        question: "Who owns the social media accounts?",
        answer:
          "The client should always own their accounts and give you access. Add a custom clause saying so, and that you'll hand back access when the agreement ends.",
      },
    ],
    document: contract({
      kind: "service",
      templateId: "minimal-slate",
      title: "Social Media Management Agreement",
      you: party("Neha Kapoor", "B-14 Sector 21, Gurugram, Haryana 122016", "neha@nehakapoor.in"),
      other: party(
        "Urban Roots Organics",
        "56 Hauz Khas Village, New Delhi 110016",
        "founder@urbanroots.in",
        "Ishaan Bhatia",
        "Founder",
      ),
      scope:
        "Manage Instagram and LinkedIn accounts\nPlan, design and publish 16 posts and 8 stories per month\nRespond to comments and messages on business days\nMonthly performance report with recommendations",
      payment: {
        currency: "INR",
        structure: "fixed",
        amount: 25000,
        hoursCap: 0,
        milestones: [],
        dueDays: 7,
        lateFeePercent: 0,
      },
      revisions: 1,
      noticeDays: 30,
      customClauses: [
        {
          id: id(),
          title: "Monthly retainer",
          text: "The fee in the Fees and payment clause is payable each month in advance, and this Agreement renews monthly until either Party ends it under the Termination clause.\n\nAdvertising budgets are paid by the Client directly to the platforms and are not included in the fee. The Client owns its social media accounts, and the Service Provider will hand back all access when this Agreement ends.",
        },
      ],
      jurisdiction: "New Delhi",
    }),
  },
  {
    slug: "nda",
    name: "NDA (One-Way)",
    summary: "Protect information you share with someone.",
    metaTitle: "NDA Template - Free Non-Disclosure Agreement (One-Way, PDF)",
    metaDescription:
      "A free one-way NDA template in plain English: definition of confidential information, obligations, exclusions, duration and remedies. Edit online and download a PDF.",
    heading: "Non-Disclosure Agreement (NDA) Template",
    intro:
      "A one-way NDA for when only you share confidential information - with a freelancer, a potential investor, a manufacturer or a new hire. Short, clear and balanced.",
    highlights: {
      title: "What this NDA covers",
      items: [
        "The purpose the information may be used for",
        "A clear definition of confidential information",
        "How the receiving party must protect it",
        "Standard exclusions (public, already known, independently developed)",
        "Return or destruction at the end",
        "How long confidentiality lasts and remedies for breaches",
      ],
    },
    guide: [
      {
        heading: "One-way or mutual?",
        paragraphs: [
          "Use a one-way NDA when only one side shares secrets - for example a startup briefing a freelance developer. If both sides will share confidential information, such as two companies exploring a partnership, use a mutual NDA instead.",
        ],
      },
      {
        heading: "Define the purpose narrowly",
        paragraphs: [
          "The purpose clause limits what the recipient may do with your information. 'Evaluating and developing the mobile app described in our discussions' is far more protective than 'business purposes'.",
        ],
      },
    ],
    faqs: [
      DISCLAIMER_FAQ,
      {
        question: "How long should an NDA last?",
        answer:
          "Two to five years is common for business information. Trade secrets stay protected for as long as they remain secret, which this template covers.",
      },
      STAMP_DUTY_FAQ,
    ],
    document: contract({
      kind: "nda",
      templateId: "classic-navy",
      you: party(
        "Pixelcraft Studios LLP",
        "4th Floor, Cyber Towers, HITEC City, Hyderabad, Telangana 500081",
        "legal@pixelcraft.studio",
        "Arjun Reddy",
        "Designated Partner",
      ),
      other: party("Vikram Iyer", "12 Jubilee Hills, Hyderabad, Telangana 500033", "vikram.iyer@email.com"),
      ndaType: "one-way",
      purpose: "evaluating and working on the design of the Disclosing Party's unreleased mobile banking app",
      confidentialityYears: 3,
      jurisdiction: "Hyderabad, Telangana",
    }),
  },
  {
    slug: "mutual-nda",
    name: "Mutual NDA",
    summary: "Both parties share confidential information.",
    metaTitle: "Mutual NDA Template - Free Two-Way Non-Disclosure Agreement",
    metaDescription:
      "A free mutual NDA template for partnerships, vendor discussions and joint projects, where both sides share confidential information. Edit online and download a PDF.",
    heading: "Mutual NDA Template",
    intro:
      "When both sides share sensitive information - exploring a partnership, a joint venture or an acquisition - a mutual NDA protects each party equally.",
    highlights: {
      title: "When to use a mutual NDA",
      items: [
        "Two companies exploring a partnership or integration",
        "Due diligence for an investment or acquisition",
        "Joint product development or co-marketing",
        "Vendor evaluations where both sides share pricing and plans",
      ],
    },
    guide: [
      {
        heading: "Equal obligations on both sides",
        paragraphs: [
          "In a mutual NDA each party is both a discloser and a recipient, so the same protections apply in both directions. That balance makes it quicker to agree - neither side has to negotiate for fairness.",
        ],
      },
      {
        heading: "Sign before the first meeting",
        paragraphs: [
          "Sign the NDA before you share anything sensitive. Information shared before it's signed may not be covered, depending on how the agreement is worded.",
        ],
      },
    ],
    faqs: [
      DISCLAIMER_FAQ,
      {
        question: "Does an NDA stop the other party from competing with me?",
        answer:
          "No. An NDA protects information, not markets. To restrict poaching staff, turn on the non-solicitation clause; non-compete restrictions need specific legal advice.",
      },
    ],
    document: contract({
      kind: "nda",
      templateId: "classic-black",
      you: party(
        "Nimbus Software Pvt Ltd",
        "Embassy Golf Links, Domlur, Bengaluru, Karnataka 560071",
        "legal@nimbus.software",
        "Kavya Rao",
        "Chief Executive Officer",
      ),
      other: party(
        "Lighthouse Labs Inc.",
        "500 Howard Street, San Francisco, CA 94105, USA",
        "partnerships@lighthouselabs.com",
        "Daniel Brooks",
        "VP Partnerships",
      ),
      ndaType: "mutual",
      purpose: "evaluating a potential technology partnership and integration between the Parties' products",
      confidentialityYears: 3,
      nonSolicitation: true,
      disputes: "arbitration",
    }),
  },
  {
    slug: "statement-of-work",
    name: "Statement of Work",
    summary: "Scope, deliverables, timeline and fees for one project.",
    metaTitle: "Statement of Work (SOW) Template - Free Example (PDF)",
    metaDescription:
      "A free statement of work template: project overview, scope, deliverables with dates, out of scope, assumptions, acceptance criteria and milestone payments. Edit online and download a PDF.",
    heading: "Statement of Work (SOW) Template",
    intro:
      "A statement of work pins down one project in detail: what will be built, by when, what's not included, how it will be accepted and how it's paid. Use it on its own or under a master services agreement.",
    highlights: {
      title: "What a good SOW includes",
      items: [
        "A short project overview and goals",
        "Scope of work and deliverables with due dates",
        "What's explicitly out of scope",
        "Assumptions the plan depends on",
        "Acceptance criteria for sign-off",
        "Fees and milestone payments",
      ],
    },
    guide: [
      {
        heading: "SOW or contract?",
        paragraphs: [
          "Many clients sign one master services agreement (MSA) with general terms, then a short statement of work for each project. If you have an MSA, name it in the SOW and the general terms come from there; if not, this template includes them.",
        ],
      },
      {
        heading: "Out of scope is as important as scope",
        paragraphs: [
          "Listing what's not included - content writing, ongoing maintenance, a second platform - prevents the most common project disputes. It's much easier to agree before work starts than to argue at delivery.",
        ],
      },
    ],
    faqs: [
      DISCLAIMER_FAQ,
      {
        question: "What are acceptance criteria?",
        answer:
          "Objective tests a deliverable must pass to be signed off - for example 'the app runs on Android 10 and later' or 'all pages score 90+ on Lighthouse performance'. They stop sign-off from depending on opinion.",
      },
    ],
    document: contract({
      kind: "sow",
      templateId: "minimal-burgundy",
      projectName: "FreshBasket grocery delivery app - MVP",
      you: party(
        "Launchpad App Studio",
        "2nd Floor, 80 Feet Road, Koramangala, Bengaluru, Karnataka 560034",
        "hello@launchpadapps.in",
        "Rahul Menon",
        "Founder",
      ),
      other: party(
        "FreshBasket Grocers Pvt Ltd",
        "HSR Layout, Bengaluru, Karnataka 560102",
        "ops@freshbasket.in",
        "Meera Pillai",
        "Director",
      ),
      overview:
        "FreshBasket wants to let customers in HSR Layout order groceries for same-day delivery. This project delivers a minimum viable product to test demand with real customers.",
      scope:
        "UX/UI design of 12 screens\nCross-platform mobile app for Android and iOS (React Native)\nAdmin panel to manage products, orders and delivery slots\nRazorpay payments and push notifications\nPublishing to Google Play and the App Store",
      deliverables: [
        deliverable("Approved designs", "25 October 2026"),
        deliverable("Test build for review", "8 November 2026"),
        deliverable("Apps published to the stores", "15 November 2026"),
      ],
      outOfScope:
        "Product photography and catalogue data entry\nDelivery partner app\nMarketing and app store optimisation",
      assumptions:
        "The Client provides product data and brand assets by 20 October 2026\nThe Client creates Google Play and Apple developer accounts\nFeedback on each deliverable is given within 3 business days",
      acceptanceCriteria:
        "Customers can sign up, browse, add to cart, pay and track an order\nThe app runs on Android 10+ and iOS 16+\nNo critical bugs open at launch",
      endDate: "2026-11-30",
      payment: {
        currency: "INR",
        structure: "milestones",
        amount: 0,
        hoursCap: 0,
        milestones: [
          milestone("Advance on signing", 23200),
          milestone("On design approval", 17400),
          milestone("On publishing to the stores", 17400),
        ],
        dueDays: 7,
        lateFeePercent: 0,
      },
      revisions: 2,
    }),
  },
];

/** The freelance contract doubles as sample data for thumbnails and tests. */
export const SAMPLE_CONTRACT = CONTRACT_EXAMPLES[0].document;
