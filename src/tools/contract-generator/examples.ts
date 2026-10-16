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
  metaTitle: "Free Contract Templates - Plain English, PDF",
  metaDescription:
    "Free contract templates in plain English: freelance, consulting and retainer agreements, NDAs and statements of work. Edit online and download a PDF.",
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
    metaTitle: "Freelance Contract Template - Free Agreement (PDF)",
    metaDescription:
      "A free freelance contract template in plain English: scope, fees, revisions, IP, confidentiality, termination and signatures. Edit online, download a PDF.",
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
    metaTitle: "Website Development Agreement Template - Free PDF",
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
    metaTitle: "Social Media Management Contract Template - Free",
    metaDescription:
      "A free social media management contract for monthly retainers: posts per month, platforms, approvals, ad spend, reporting and notice. Edit and get a PDF.",
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
    metaTitle: "NDA Template - One-Way Non-Disclosure Agreement",
    metaDescription:
      "A free one-way NDA template in plain English: confidential information, obligations, exclusions, duration and remedies. Edit online and download a PDF.",
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
    metaTitle: "Mutual NDA Template - Free Two-Way NDA (PDF)",
    metaDescription:
      "A free mutual NDA template for partnerships, vendor talks and joint projects where both sides share confidential information. Edit online, download a PDF.",
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
    metaTitle: "Statement of Work (SOW) Template - Free PDF",
    metaDescription:
      "A free SOW template: scope, deliverables with dates, out of scope, assumptions, acceptance criteria and milestone payments. Edit online and download a PDF.",
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
  {
    slug: "consulting-agreement",
    name: "Consulting Agreement",
    summary: "Hourly consulting with a cap on billable hours.",
    metaTitle: "Consulting Agreement Template (Hourly) - Free PDF",
    metaDescription:
      "A free hourly consulting agreement: scope, hourly rate with an hours cap, monthly invoicing, deliverables, confidentiality and termination. Download a PDF.",
    heading: "Consulting Agreement Template",
    intro:
      "A consulting agreement for advisers who bill by the hour: what you'll advise on, your hourly rate, a cap on hours the client must approve before you exceed it, and clear limits on what your advice promises.",
    highlights: {
      title: "What this consulting agreement covers",
      items: [
        "The areas you'll advise on and the reports you'll deliver",
        "Hourly rate, invoiced monthly with a summary of hours",
        "A cap on billable hours without written approval",
        "Travel time and pre-approved expenses",
        "The client's responsibility for decisions based on your advice",
        "Confidentiality, termination with notice and dispute resolution",
      ],
    },
    guide: [
      {
        heading: "Why an hours cap helps both sides",
        paragraphs: [
          "Clients hesitate to sign an open-ended hourly engagement because they can't predict the bill. A cap - say 60 hours - that you can only exceed with written approval gives them a budget, while you're still paid for every hour worked. When you approach the cap, send a short note on progress and what more time would achieve.",
        ],
      },
      {
        heading: "Advice, not guarantees",
        paragraphs: [
          "A consultant's work is only as good as the information the client provides, and the client decides what to implement. Say so in the contract: it sets realistic expectations and protects you if a recommendation isn't followed or doesn't deliver the result the client hoped for.",
          "If you'll travel to the client's sites, agree how travel time is billed - many consultants charge it at a reduced rate - and keep receipts for any expenses the client approves.",
        ],
      },
    ],
    faqs: [
      DISCLAIMER_FAQ,
      {
        question: "What hourly rate should a consultant charge?",
        answer:
          "It varies widely with experience and field. Work back from the annual income you need, allowing for the fact that only part of your time is billable, and check what clients in your sector pay. Agree the rate in writing before you start.",
      },
      STAMP_DUTY_FAQ,
    ],
    document: contract({
      kind: "service",
      templateId: "classic-navy",
      title: "Consulting Agreement",
      you: party(
        "Farhan Qureshi",
        "A-41, Sun Residency, Bodakdev, Ahmedabad, Gujarat 380054",
        "farhan@farhanqureshi.in",
      ),
      other: party(
        "Kesar Home Textiles Pvt Ltd",
        "Plot 112, GIDC Sachin, Surat, Gujarat 394230",
        "md@kesarhometextiles.in",
        "Hemal Desai",
        "Managing Director",
      ),
      scope:
        "Review of procurement, inventory and dispatch processes at the Surat plant\nInterviews with the purchase, stores and dispatch teams\nRecommendations to reduce stock-outs and excess inventory\nImplementation roadmap and fortnightly progress calls with management",
      deliverables: [
        deliverable("Current-state assessment", "13 November 2026"),
        deliverable("Recommendations report and implementation roadmap", "15 December 2026"),
      ],
      endDate: "2027-01-31",
      payment: {
        currency: "INR",
        structure: "hourly",
        amount: 4500,
        hoursCap: 60,
        milestones: [],
        dueDays: 15,
        lateFeePercent: 1,
      },
      revisions: 0,
      portfolioUse: false,
      customClauses: [
        {
          id: id(),
          title: "Nature of advice",
          text: "The Service Provider will give advice and recommendations based on the information the Client provides and will rely on that information being accurate and complete. Decisions on whether and how to implement any recommendation remain with the Client, and the Service Provider does not guarantee any particular business result.",
        },
        {
          id: id(),
          title: "Travel",
          text: "Time spent travelling to the Client's sites outside Ahmedabad is billed at half the hourly rate and counts towards the hours cap. Travel and stay costs are reimbursed as expenses under the Fees and payment clause.",
        },
      ],
      jurisdiction: "Ahmedabad, Gujarat",
    }),
  },
  {
    slug: "retainer-agreement",
    name: "Retainer Agreement",
    summary: "A monthly fee for an agreed amount of ongoing work.",
    metaTitle: "Retainer Agreement Template (Monthly) - Free PDF",
    metaDescription:
      "A free monthly retainer agreement: fee paid in advance, hours included, extra hours, turnaround times, renewal and notice. Edit online and download a PDF.",
    heading: "Retainer Agreement Template",
    intro:
      "A retainer turns repeat work into a steady monthly income. This agreement sets the monthly fee, the hours it includes, what happens to unused or extra hours, how quickly requests are handled and how either side can end it.",
    highlights: {
      title: "What a retainer agreement should say",
      items: [
        "The services covered and the hours included each month",
        "A monthly fee payable in advance",
        "Whether unused hours carry forward",
        "The rate for extra hours, and who approves them",
        "Turnaround times for requests",
        "Monthly renewal and the notice period to end it",
      ],
    },
    guide: [
      {
        heading: "Define what the monthly fee buys",
        paragraphs: [
          "A retainer works when both sides know what the fee covers. Tie it to a number of hours or a set of deliverables each month, say how requests are made and how quickly you'll respond, and set a rate for anything beyond the monthly allowance.",
          "Decide upfront whether unused hours roll over. Most retainers say they don't - the client is paying for your reserved availability, not a bank of hours.",
        ],
      },
      {
        heading: "Payment in advance and a notice period",
        paragraphs: [
          "Invoice at the start of each month, before the work is done. Combined with a 30-day notice period, that gives you predictable income and time to replace a client who leaves, and gives the client time to hand the work over.",
        ],
      },
    ],
    faqs: [
      DISCLAIMER_FAQ,
      {
        question: "What's the difference between a retainer and a fixed-price project?",
        answer:
          "A project has a defined end: a website, a report, a logo. A retainer pays for ongoing availability and work each month, and continues until one side gives notice. Use a freelance contract or statement of work for projects, and this template for ongoing work.",
      },
      {
        question: "Can I raise my retainer fee later?",
        answer:
          "Yes, by agreement. Give the client notice of the new fee - this template asks for 30 days - and confirm the change in writing, as the agreement requires.",
      },
    ],
    document: contract({
      kind: "service",
      templateId: "modern-indigo",
      title: "Design Retainer Agreement",
      you: party(
        "Tanvi Joshi Design Co.",
        "Flat 7, Aboli Apartments, Kothrud, Pune, Maharashtra 411038",
        "tanvi@tanvijoshi.design",
        "Tanvi Joshi",
        "Proprietor",
      ),
      other: party(
        "Hillcrest Naturals Pvt Ltd",
        "Unit 204, Kamala Mills, Lower Parel, Mumbai, Maharashtra 400013",
        "marketing@hillcrestnaturals.in",
        "Rhea Fernandes",
        "Head of Marketing",
      ),
      scope:
        "Social media creatives and ad banners\nPackaging and label design updates for existing products\nWebsite banners and email newsletter graphics\nSales presentations and product catalogues",
      payment: {
        currency: "INR",
        structure: "fixed",
        amount: 60000,
        hoursCap: 0,
        milestones: [],
        dueDays: 7,
        lateFeePercent: 0,
      },
      revisions: 2,
      noticeDays: 30,
      customClauses: [
        {
          id: id(),
          title: "Monthly retainer",
          text: "The fee in the Fees and payment clause is payable each month in advance, and this Agreement renews monthly until either Party ends it under the Termination clause.\n\nThe fee covers up to 40 hours of design work each month. Unused hours do not carry forward to the next month. Further hours are billed at ₹1,800 per hour, only with the Client's prior written approval.\n\nThe Client will send requests by email to the Service Provider. The Service Provider will deliver the first draft of a standard request within 3 business days, and agree a timeline for larger pieces of work.\n\nEither Party may propose a change to the monthly fee by giving at least 30 days' written notice. The new fee applies only once both Parties agree it in writing.",
        },
      ],
      jurisdiction: "Mumbai, Maharashtra",
    }),
  },
  {
    slug: "influencer-agreement",
    name: "Influencer Agreement",
    summary: "A brand collaboration with a content creator.",
    metaTitle: "Influencer Agreement Template for Brand Collabs",
    metaDescription:
      "A free influencer agreement for brand collaborations: reels, posts and stories, approvals, ad disclosure, usage rights, exclusivity and payment. Get a PDF.",
    heading: "Influencer Agreement Template",
    intro:
      "A brand collaboration agreement for creators and the brands that work with them: the reels, posts and stories to be published and when, how drafts are approved, how the partnership is disclosed, how the brand may reuse the content and when the creator is paid.",
    highlights: {
      title: "What an influencer agreement should cover",
      items: [
        "Deliverables by platform and format, with posting dates",
        "Draft approval and the number of changes included",
        "Paid partnership labels and disclosure",
        "Usage rights: where, how long and whether in paid ads",
        "Exclusivity with competing brands, and for how long",
        "Payment schedule and how long posts stay live",
      ],
    },
    guide: [
      {
        heading: "Usage rights are part of the price",
        paragraphs: [
          "Posting a reel on your own account is one thing; the brand running it as a paid ad for a year is another. Agree where the brand may reuse your content (its own social channels, website, ads), for how long and whether you're credited. Charge extra for paid ad usage, longer periods or exclusivity - each limits what you can do elsewhere.",
        ],
      },
      {
        heading: "Disclose every paid collaboration",
        paragraphs: [
          "In India, ASCI's guidelines for influencer advertising and the Department of Consumer Affairs' endorsement guidelines expect a clear, prominent disclosure on paid or gifted content - a label such as #ad, #collab, #sponsored or the platform's paid partnership tag, not one hidden among hashtags.",
          "Misleading endorsements can lead to action under the Consumer Protection Act, 2019, so make disclosure a contract term, keep claims to facts the brand has provided, and endorse only products you have actually used.",
        ],
      },
    ],
    faqs: [
      DISCLAIMER_FAQ,
      {
        question: "Do influencers need to charge GST and accept TDS?",
        answer:
          "Creators must register for GST once their turnover crosses ₹20 lakh (₹10 lakh in some special-category states), and then charge GST, generally at 18%. Brands often deduct TDS from the fee, and section 194R requires TDS on free products or other benefits worth more than ₹20,000 in a year. Check your position with a tax adviser.",
      },
      {
        question: "Can the brand use my content in its ads?",
        answer:
          "Only if the agreement allows it. This template lets the brand repost the content on its own channels for six months and allows paid ads only for an extra fee, agreed in writing.",
      },
    ],
    document: contract({
      kind: "service",
      templateId: "minimal-burgundy",
      title: "Influencer Collaboration Agreement",
      you: party("Ananya Bose", "22/4 Lake Gardens, Kolkata, West Bengal 700045", "collabs@ananyabose.in"),
      other: party(
        "Mishti Mood Foods Pvt Ltd",
        "5th Floor, Infinity Tower, Salt Lake Sector V, Kolkata, West Bengal 700091",
        "brand@mishtimood.in",
        "Sourav Chatterjee",
        "Brand Manager",
      ),
      scope:
        "Create and publish branded content on Instagram and YouTube featuring the Client's new range of baked snacks\nTag the Client's accounts and use the platforms' paid partnership label\nShare reach and engagement insights for each post 7 days after it goes live",
      deliverables: [
        deliverable("Draft reel (45-60 seconds) shared for approval", "1 November 2026"),
        deliverable("Instagram reel published as a collab post", "10 November 2026"),
        deliverable("3 Instagram stories with a link sticker", "10 November 2026"),
        deliverable("Reel cross-posted as a YouTube Short", "12 November 2026"),
      ],
      payment: {
        currency: "INR",
        structure: "milestones",
        amount: 0,
        hoursCap: 0,
        milestones: [
          milestone("On signing this Agreement", 30000),
          milestone("On the reel and stories going live", 45000),
        ],
        dueDays: 7,
        lateFeePercent: 0,
      },
      revisions: 1,
      ipOwnership: "licence",
      confidentialityYears: 2,
      noticeDays: 7,
      customClauses: [
        {
          id: id(),
          title: "Usage rights",
          text: "This clause limits the licence in the Intellectual property clause. The Client may repost or share the published content, with credit to the Service Provider, on the Client's own social media accounts and website for 6 months from the date it goes live.\n\nThe Client may not use the content in paid advertising, edit it, or use the Service Provider's name or likeness in other materials without the Service Provider's written consent and an additional fee agreed in writing.",
        },
        {
          id: id(),
          title: "Disclosure, posting and exclusivity",
          text: "The Service Provider will clearly disclose the paid partnership on every post and story, as required by applicable advertising guidelines. The Client will provide accurate product information and is responsible for any product claims it asks the Service Provider to make.\n\nThe Service Provider will keep the reel live on its accounts for at least 3 months, and will not publish paid content for another brand of packaged snacks for 30 days after the reel goes live.",
        },
      ],
      jurisdiction: "Kolkata, West Bengal",
    }),
  },
];

/** The freelance contract doubles as sample data for thumbnails and tests. */
export const SAMPLE_CONTRACT = CONTRACT_EXAMPLES[0].document;
