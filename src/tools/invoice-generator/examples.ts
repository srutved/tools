import type { UseCase, UseCaseCollection } from "@/components/tool/use-case";
import { EMPTY_PAYMENT_DETAILS, type Party, type PaymentDetails } from "@/shared/business-profile";
import type { DocumentKind } from "./lib/document-kind";
import type { Invoice, LineItem, TaxMode } from "./schema";

/*
 * Invoice and quotation formats: one landing page per profession or business
 * (/invoice-generator/formats/<slug>, /quotation-generator/formats/<slug>), each with a complete
 * example that opens in the generator with "Use this example".
 */

export const INVOICE_FORMATS_COLLECTION: UseCaseCollection = {
  toolSlug: "invoice-generator",
  segment: "formats",
  title: "Invoice Formats",
  noun: "invoice",
  metaTitle: "Invoice Formats by Profession - Free Examples to Edit & Download",
  metaDescription:
    "Free invoice formats for freelancers, consultants, photographers, web designers, exporters and UK VAT. Open an example, edit it and download a PDF in any currency.",
  intro:
    "Ready-made invoice examples for different kinds of work, with the right tax and payment details for each. Open one in the free invoice generator, add your details and download a PDF.",
};

export const QUOTATION_FORMATS_COLLECTION: UseCaseCollection = {
  toolSlug: "quotation-generator",
  segment: "formats",
  title: "Quotation Formats",
  noun: "quotation",
  metaTitle: "Quotation Formats by Business - Free Examples to Edit & Download",
  metaDescription:
    "Free quotation formats for website design, mobile app development, interior design and catering. Open an example, edit it and download a PDF quote.",
  intro:
    "Ready-made quotation examples for common projects, broken into clear line items. Open one in the free quotation generator, adjust the prices and download a PDF.",
};

let counter = 0;
const id = () => `format-${++counter}`;

const party = (
  name: string,
  address: string,
  { taxId = "", email = "", phone = "", stateCode = "" } = {},
): Party => ({ name, address, taxId, email, phone, stateCode });

const item = (
  description: string,
  quantity: number,
  unitPrice: number,
  taxRate = 0,
  code = "",
): LineItem => ({
  id: id(),
  description,
  code,
  quantity,
  unitPrice,
  taxRate,
});

interface ExampleDocument {
  kind?: DocumentKind;
  templateId: string;
  number: string;
  currency: string;
  taxMode: TaxMode;
  taxLabel?: string;
  placeOfSupply?: string;
  lutNumber?: string;
  discount?: number;
  from: Party;
  to: Party;
  payment?: Partial<PaymentDetails>;
  items: LineItem[];
  notes: string;
  terms: string;
}

function document({ kind = "invoice", payment, ...rest }: ExampleDocument): Invoice {
  return {
    kind,
    issueDate: "2026-10-01",
    dueDate: kind === "quote" ? "2026-10-31" : "2026-10-15",
    taxLabel: "Tax",
    placeOfSupply: "",
    lutNumber: "",
    discount: 0,
    logo: "",
    ...rest,
    payment: { ...EMPTY_PAYMENT_DETAILS, ...payment },
  };
}

const INDIAN_BANK = {
  bankName: "HDFC Bank",
  accountNumber: "50200012345678",
  bankCode: "HDFC0001234",
};

export const INVOICE_FORMATS: UseCase<Invoice>[] = [
  {
    slug: "freelancer",
    name: "Freelancer (no GST)",
    summary: "For freelancers who aren't registered for GST.",
    metaTitle: "Invoice Format for Freelancers in India (Without GST) - Free Example",
    metaDescription:
      "A freelancer invoice format for India without GST: your details, the client's, services, totals and UPI payment. Edit it free and download a PDF.",
    heading: "Invoice Format for Freelancers (Without GST)",
    intro:
      "Most freelancers in India don't need to register for GST until their turnover crosses ₹20 lakh. This invoice format is for exactly that: a clean bill of supply with no tax lines and a UPI QR code to get paid fast.",
    highlights: {
      title: "What this invoice includes",
      items: [
        "Your name, address, PAN (optional) and contact details",
        "The client's name and address",
        "A unique invoice number, date and due date",
        "Each service with quantity, rate and amount",
        "Total in figures and words",
        "UPI ID and bank details, with a scan-to-pay QR code",
      ],
    },
    guide: [
      {
        heading: "Do freelancers need to charge GST?",
        paragraphs: [
          "GST registration is mandatory for service providers whose annual turnover crosses ₹20 lakh (₹10 lakh in some special-category states), and for anyone exporting services who wants to claim refunds. Below that, you invoice without GST - and you must not show GST on the invoice.",
          "If you work with clients abroad or expect to cross the threshold soon, read our GST and export formats below instead.",
        ],
      },
      {
        heading: "Get paid faster",
        paragraphs: [
          "Set a clear due date (7 to 15 days is common), add your UPI ID so the invoice shows a QR code, and send the PDF the day the work is delivered. Invoices sent promptly are paid noticeably faster than ones sent at the end of the month.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I mention my PAN on a freelance invoice?",
        answer:
          "Yes. Clients often deduct TDS under section 194J and need your PAN. Put it in the Tax ID field of your business details.",
      },
      {
        question: "What should the invoice be called if I'm not registered for GST?",
        answer:
          "Simply 'Invoice' (sometimes called a bill of supply). Only GST-registered businesses issue a 'Tax Invoice'.",
      },
    ],
    document: document({
      templateId: "modern-teal",
      number: "INV-2026-014",
      currency: "INR",
      taxMode: "none",
      from: party("Riya Sharma", "Flat 302, Green Park Apartments\nPune, Maharashtra 411045", {
        taxId: "ABCPS1234D",
        email: "riya@riyadesigns.in",
        phone: "+91 98220 11223",
      }),
      to: party("Brightside Cafe", "14 FC Road, Shivajinagar\nPune, Maharashtra 411004", {
        email: "accounts@brightside.cafe",
      }),
      payment: { upiId: "riya@okhdfcbank", accountName: "Riya Sharma", ...INDIAN_BANK },
      items: [
        item("Logo design (3 concepts, 2 revisions)", 1, 15000),
        item("Menu card design", 1, 6000),
        item("Instagram post templates", 10, 800),
      ],
      notes: "Thank you for working with me!",
      terms: "Payment due within 14 days by UPI or bank transfer.",
    }),
  },
  {
    slug: "gst-consultant",
    name: "Consultant with GST",
    summary: "GST tax invoice with CGST and SGST.",
    metaTitle: "GST Invoice Format for Consultants - Free Tax Invoice Example",
    metaDescription:
      "A GST tax invoice format for consultants and professional services: GSTIN, SAC codes, CGST and SGST, place of supply. Edit it free and download a PDF.",
    heading: "GST Invoice Format for Consultants",
    intro:
      "A complete GST tax invoice for consulting and professional services. When you and your client are in the same state, it charges CGST and SGST at 9% each - worked out automatically.",
    highlights: {
      title: "What a GST tax invoice must show",
      items: [
        "The title 'Tax Invoice' and a unique serial number",
        "Your GSTIN, name and address",
        "The client's GSTIN for business clients",
        "Place of supply (state name and code)",
        "SAC code for each service (998311 for management consulting)",
        "Taxable value, GST rate and CGST + SGST or IGST amounts",
      ],
    },
    guide: [
      {
        heading: "CGST and SGST or IGST?",
        paragraphs: [
          "It depends on the place of supply. If it's in the same state as you, charge CGST and SGST, each at half the rate (9% + 9% for most services). If it's in another state, charge IGST at the full 18%. The generator picks the right one from your state and the client's.",
        ],
      },
      {
        heading: "SAC codes for common services",
        paragraphs: ["Services use six-digit SAC codes. A few common ones:"],
        bullets: [
          "998311 - Management consulting",
          "998221 - Financial consulting",
          "998313 - IT consulting",
          "998314 - IT design and development",
          "998361 - Advertising services",
        ],
      },
    ],
    faqs: [
      {
        question: "Is the client's GSTIN mandatory?",
        answer:
          "For B2B supplies, yes - the client needs it on your invoice to claim input tax credit. For individual consumers it's not required.",
      },
      {
        question: "What is the GST rate on consulting services?",
        answer: "Most professional and consulting services are taxed at 18% GST.",
      },
    ],
    document: document({
      templateId: "classic-navy",
      number: "TI/2026-27/031",
      currency: "INR",
      taxMode: "gst",
      placeOfSupply: "29",
      from: party("Kavya Rao Consulting", "21, 3rd Cross, Jayanagar\nBengaluru, Karnataka 560011", {
        taxId: "29AKXPR4321M1Z8",
        email: "kavya@kavyarao.co",
        phone: "+91 98450 66778",
        stateCode: "29",
      }),
      to: party("Nimbus Software Pvt Ltd", "Embassy Golf Links, Domlur\nBengaluru, Karnataka 560071", {
        taxId: "29AAECN5678P1Z3",
        stateCode: "29",
      }),
      payment: { accountName: "Kavya Rao Consulting", ...INDIAN_BANK },
      items: [
        item("Go-to-market strategy workshop (2 days)", 2, 40000, 18, "998311"),
        item("Market research report", 1, 60000, 18, "998311"),
        item("Weekly advisory calls (October)", 4, 7500, 18, "998311"),
      ],
      notes: "Thank you for your business.",
      terms: "Payment due within 15 days. Interest at 1.5% per month applies to late payments.",
    }),
  },
  {
    slug: "photographer",
    name: "Photographer",
    summary: "Wedding, event and product photography.",
    metaTitle: "Photography Invoice Format - Free Template for Photographers",
    metaDescription:
      "A photography invoice format with shoot fees, editing, travel and advance received. Edit it free in the invoice generator and download a PDF.",
    heading: "Photography Invoice Format",
    intro:
      "Wedding, event and product shoots have lots of moving parts. This invoice lays them out clearly - coverage, editing, albums and travel - and accounts for the advance already paid.",
    highlights: {
      title: "What to list on a photography invoice",
      items: [
        "Event name and date in the description",
        "Coverage hours or days, and number of photographers",
        "Editing, albums, prints and video as separate lines",
        "Travel and accommodation, if billed",
        "Advance already received as a discount line",
        "Delivery timeline and usage rights in the terms",
      ],
    },
    guide: [
      {
        heading: "Handling advances",
        paragraphs: [
          "Photographers usually take a booking advance. Invoice the full amount and enter the advance in the discount field, so the total shows the balance due - and note the advance date in the notes for clarity.",
        ],
      },
      {
        heading: "Protect your work in the terms",
        paragraphs: [
          "State when photos will be delivered, how many revisions are included and who can use the images. A line such as 'Photographer retains copyright; client may use images for personal purposes' prevents disputes later.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should photographers charge GST?",
        answer:
          "Only if registered. Photography services attract 18% GST once your turnover crosses the registration threshold.",
      },
      {
        question: "How do I show a booking advance on the invoice?",
        answer:
          "Add the full services, then enter the advance in the Discount field. The total becomes the balance payable.",
      },
    ],
    document: document({
      templateId: "minimal-sand",
      number: "PH-0218",
      currency: "INR",
      taxMode: "none",
      discount: 50000,
      from: party("Frames by Vikram", "B-12 Vasant Kunj\nNew Delhi 110070", {
        email: "hello@framesbyvikram.com",
        phone: "+91 99100 22334",
      }),
      to: party("Aditi & Sameer", "C-4 Safdarjung Enclave\nNew Delhi 110029"),
      payment: { upiId: "framesbyvikram@icici", accountName: "Vikram Singh", ...INDIAN_BANK },
      items: [
        item("Wedding coverage - 2 days, 2 photographers", 2, 45000),
        item("Edited photos (400) and online gallery", 1, 15000),
        item("Premium photo album (40 pages)", 1, 22000),
        item("Travel and stay (Jaipur)", 1, 18000),
      ],
      notes: "Advance of ₹50,000 received on 5 Aug 2026 has been deducted.",
      terms:
        "Balance due within 7 days. Edited photos delivered within 30 days. Photographer retains copyright; images may be used for personal purposes.",
    }),
  },
  {
    slug: "web-designer-usd",
    name: "Web Designer (USD client)",
    summary: "Billing an international client in US dollars.",
    metaTitle: "Invoice Format for International Clients (USD) - Free Example",
    metaDescription:
      "An invoice format for billing international clients in US dollars: hourly work, fixed-price items and a PayPal or Wise payment link. Edit it free and download a PDF.",
    heading: "Invoice Format for International Clients (USD)",
    intro:
      "Billing a client in the US, UK or Europe? Invoice in their currency, list the work clearly and add a payment link - so paying you is as easy as paying a local supplier.",
    highlights: {
      title: "What international clients expect",
      items: [
        "The amount in their currency (USD, EUR, GBP...)",
        "Clear line items: hours, rate and fixed-price deliverables",
        "Your full address and their company details",
        "A payment link (PayPal, Wise, Stripe) and SWIFT details",
        "Payment terms such as Net 15 or Net 30",
      ],
    },
    guide: [
      {
        heading: "Choosing how to get paid",
        paragraphs: [
          "Wise and Payoneer usually cost far less than PayPal for receiving foreign payments into an Indian bank account. Whichever you use, add the link to the invoice so clients can pay in a couple of clicks, and include SWIFT details for direct transfers.",
        ],
      },
      {
        heading: "GST on exports of services",
        paragraphs: [
          "If you're GST-registered, services to foreign clients are 'zero-rated' exports. You can supply them without charging GST by filing a Letter of Undertaking (LUT) - see our export invoice format. If you aren't registered, invoice without GST, as in this example.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I invoice in dollars from India?",
        answer:
          "Yes. Invoice in the client's currency; the payment is converted when it reaches your bank. Keep the bank's foreign inward remittance certificate (FIRC) for your records.",
      },
      {
        question: "What does Net 30 mean?",
        answer: "That payment is due 30 days after the invoice date. Net 15 is 15 days.",
      },
    ],
    document: document({
      templateId: "modern-indigo",
      number: "INV-1042",
      currency: "USD",
      taxMode: "none",
      from: party("Siddharth Verma", "45 Hill Road, Bandra West\nMumbai 400050, India", {
        email: "sid@siddesigns.dev",
        phone: "+91 98190 55443",
      }),
      to: party("Lighthouse Labs Inc.", "500 Howard Street\nSan Francisco, CA 94105, USA", {
        email: "ap@lighthouselabs.com",
      }),
      payment: {
        paymentLink: "https://wise.com/pay/me/siddharthv",
        bankName: "ICICI Bank",
        accountName: "Siddharth Verma",
        accountNumber: "000401234567",
        bankCode: "ICICINBBCTS",
      },
      items: [
        item("Website redesign - UX and UI (fixed price)", 1, 2400),
        item("Webflow development (hours)", 32, 45),
        item("Monthly maintenance retainer", 1, 300),
      ],
      notes: "Thanks for the great collaboration!",
      terms: "Net 15. Please pay via Wise or international bank transfer (SWIFT).",
    }),
  },
  {
    slug: "export-of-services-lut",
    name: "Export under LUT",
    summary: "Zero-rated GST invoice for foreign clients.",
    metaTitle: "Export Invoice Format Under LUT (Without IGST) - Free Example",
    metaDescription:
      "An export of services invoice format under LUT: zero-rated, no IGST, with the LUT declaration and ARN. Edit it free and download a PDF in any currency.",
    heading: "Export Invoice Format Under LUT",
    intro:
      "GST-registered and working with clients abroad? Under a Letter of Undertaking (LUT) you export services without paying IGST. This invoice shows the zero-rated supply and the mandatory declaration.",
    highlights: {
      title: "What an export invoice under LUT shows",
      items: [
        "Title 'Tax Invoice' with your GSTIN",
        "The foreign client's name and address",
        "Invoice currency (USD, EUR...) with SAC codes",
        "IGST at 0% - zero-rated supply",
        "Declaration: 'Supply meant for export under LUT without payment of IGST'",
        "Your LUT ARN (application reference number)",
      ],
    },
    guide: [
      {
        heading: "What is an LUT?",
        paragraphs: [
          "A Letter of Undertaking is a declaration filed online on the GST portal (form GST RFD-11) each financial year. It lets you export services without paying IGST up front and then claiming a refund. It's free and usually approved instantly.",
        ],
      },
      {
        heading: "When is a service an export?",
        paragraphs: ["Under GST, a supply of services is an export when:"],
        bullets: [
          "You are located in India and the client is located outside India",
          "The place of supply is outside India",
          "You receive payment in convertible foreign currency (or INR where RBI permits)",
          "You and the client aren't merely establishments of the same company",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need to show IGST on an export invoice under LUT?",
        answer:
          "Show the supply as zero-rated with the LUT declaration. The generator's 'India export under LUT' tax mode prints it for you.",
      },
      {
        question: "Is the LUT valid forever?",
        answer: "No. It's valid for one financial year, so file a new one every April.",
      },
    ],
    document: document({
      templateId: "sidebar-charcoal",
      number: "EXP/2026-27/007",
      currency: "USD",
      taxMode: "gst-export",
      lutNumber: "AD2903260012345",
      from: party(
        "Pixelcraft Studios LLP",
        "4th Floor, Cyber Towers, HITEC City\nHyderabad, Telangana 500081",
        {
          taxId: "36AAQFP1234K1Z9",
          email: "billing@pixelcraft.studio",
          stateCode: "36",
        },
      ),
      to: party("Northwind Media GmbH", "Friedrichstraße 68\n10117 Berlin, Germany", {
        taxId: "DE312345678",
      }),
      payment: {
        bankName: "HDFC Bank",
        accountName: "Pixelcraft Studios LLP",
        accountNumber: "50200098765432",
        bankCode: "HDFCINBBXXX",
      },
      items: [
        item("Mobile app UI design - sprint 3", 1, 6500, 0, "998314"),
        item("Frontend development (hours)", 60, 35, 0, "998314"),
      ],
      notes: "Thank you for your business.",
      terms: "Payment due within 30 days by SWIFT transfer.",
    }),
  },
  {
    slug: "uk-vat",
    name: "UK VAT invoice",
    summary: "VAT invoice in pounds for UK businesses.",
    metaTitle: "UK VAT Invoice Template - Free Example in GBP",
    metaDescription:
      "A UK VAT invoice template with VAT number, VAT at 20% and totals in pounds. Edit it free in the invoice generator and download a PDF.",
    heading: "UK VAT Invoice Template",
    intro:
      "A full VAT invoice for VAT-registered UK businesses and freelancers, charging VAT at 20% and showing everything HMRC requires.",
    highlights: {
      title: "What HMRC requires on a VAT invoice",
      items: [
        "A unique, sequential invoice number",
        "Your name, address and VAT registration number",
        "The invoice date (and time of supply if different)",
        "The customer's name and address",
        "A description of each item, with quantity and price",
        "The VAT rate, the VAT charged and the total including VAT",
      ],
    },
    guide: [
      {
        heading: "VAT rates",
        paragraphs: [
          "Most goods and services are standard-rated at 20%. Some are reduced-rated at 5% (for example domestic energy) or zero-rated (most food and children's clothing). You can set a different rate on each line in the generator.",
        ],
      },
      {
        heading: "Not VAT registered?",
        paragraphs: [
          "If your taxable turnover is below the VAT threshold and you aren't registered, choose 'No tax' and don't show VAT on your invoices.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I issue a simplified VAT invoice?",
        answer:
          "Yes, for retail supplies of £250 or less including VAT. For anything else - or if your customer asks - issue a full VAT invoice like this one.",
      },
      {
        question: "How long must I keep VAT invoices?",
        answer: "HMRC requires VAT records to be kept for at least 6 years.",
      },
    ],
    document: document({
      templateId: "bold-royal",
      number: "INV-0457",
      currency: "GBP",
      taxMode: "custom",
      taxLabel: "VAT",
      from: party("Oakleaf Copywriting Ltd", "12 Albion Street\nLeeds LS1 6HX, United Kingdom", {
        taxId: "GB 123 4567 89",
        email: "hello@oakleafcopy.co.uk",
      }),
      to: party("Harbour & Co. Ltd", "8 Quayside\nNewcastle NE1 3DX, United Kingdom", {
        taxId: "GB 987 6543 21",
      }),
      payment: {
        bankName: "Barclays",
        accountName: "Oakleaf Copywriting Ltd",
        accountNumber: "GB29 BARC 2003 1531 2345 67",
        bankCode: "20-03-15",
      },
      items: [
        item("Website copy - 6 pages", 6, 250, 20),
        item("Email newsletter series (4 emails)", 4, 120, 20),
        item("Brand tone-of-voice guide", 1, 600, 20),
      ],
      notes: "Thank you for your business.",
      terms: "Payment due within 30 days of the invoice date.",
    }),
  },
];

export const QUOTATION_FORMATS: UseCase<Invoice>[] = [
  {
    slug: "website-design",
    name: "Website Design",
    summary: "Design, development and hosting for a business website.",
    metaTitle: "Website Design Quotation Format - Free Example (PDF)",
    metaDescription:
      "A website design quotation format with pages, design, development, hosting and maintenance as clear line items. Edit it free and download a PDF quote.",
    heading: "Website Design Quotation Format",
    intro:
      "A website quotation that clients can approve quickly: every part of the project as its own line, a validity date and payment milestones in the terms.",
    highlights: {
      title: "What to include in a website quote",
      items: [
        "Number of pages and what's on them",
        "Design, development and content as separate lines",
        "Domain, hosting and SSL - one-time or yearly",
        "Revisions included",
        "Maintenance or support after launch",
        "Timeline and payment milestones",
      ],
    },
    guide: [
      {
        heading: "Break the project into parts",
        paragraphs: [
          "A single 'Website - ₹60,000' invites haggling. Splitting it into design, development, content and hosting shows the client what they're paying for and lets them drop optional items instead of asking for a discount on everything.",
        ],
      },
      {
        heading: "Use milestones",
        paragraphs: [
          "For projects over a few weeks, ask for 40-50% on acceptance, 30% on design approval and the rest at launch. Put the schedule in the terms so it's agreed before work starts.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much does a business website cost in India?",
        answer:
          "In 2026, a simple 5-8 page business website typically costs ₹25,000-60,000. E-commerce and custom web apps cost more, depending on features.",
      },
      {
        question: "Should hosting be on the quotation?",
        answer:
          "Yes, as a separate line, and say whether it's yearly. Clients appreciate knowing the running cost before they commit.",
      },
    ],
    document: document({
      kind: "quote",
      templateId: "modern-teal",
      number: "QT-2026-031",
      currency: "INR",
      taxMode: "gst",
      placeOfSupply: "27",
      from: party("Bluefin Web Studio", "Office 7, Baner Road\nPune, Maharashtra 411045", {
        taxId: "27AAKFB1234C1Z2",
        email: "hello@bluefin.studio",
        stateCode: "27",
      }),
      to: party("Green Leaf Clinics", "22 Koregaon Park\nPune, Maharashtra 411001", { stateCode: "27" }),
      items: [
        item("Website design - 6 pages, mobile-friendly", 1, 18000, 18, "998314"),
        item("Development with contact and booking forms", 1, 15000, 18, "998314"),
        item("Basic SEO setup and Google Business Profile", 1, 5000, 18, "998314"),
        item("Domain, hosting and SSL (1 year)", 1, 6000, 18, "998315"),
      ],
      notes: "Thank you for considering Bluefin Web Studio. We look forward to building your website.",
      terms:
        "Valid for 30 days. 50% on acceptance, 50% at launch. Includes 2 rounds of design revisions. Delivery in 3 weeks.",
    }),
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    summary: "An MVP app for Android and iOS.",
    metaTitle: "App Development Quotation Format - Free MVP Quote Example",
    metaDescription:
      "A mobile app development quotation format for an MVP: design, Android and iOS development, backend, testing and launch. Edit it free and download a PDF.",
    heading: "App Development Quotation Format",
    intro:
      "Quoting an app? This example prices a focused MVP for Android and iOS phase by phase - design, development, backend, testing and launch - so the client sees exactly where the money goes.",
    highlights: {
      title: "What an app quotation should cover",
      items: [
        "Discovery and UX/UI design",
        "Cross-platform development (Android and iOS)",
        "Backend, database and admin panel",
        "Third-party integrations: payments, maps, notifications",
        "Testing and app store submission",
        "Post-launch support and maintenance",
      ],
    },
    guide: [
      {
        heading: "Quote an MVP, not a wish list",
        paragraphs: [
          "Scope the first version around one core workflow. It's cheaper, faster to launch and gives the client real feedback before they spend more. List later features as a separate phase so they're on record without inflating the first quote.",
        ],
      },
      {
        heading: "What does an app cost?",
        paragraphs: [
          "Thanks to cross-platform frameworks and AI-assisted development, a focused MVP now often costs ₹25,000-60,000 and can launch in weeks. Complex apps with many roles and integrations cost more.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should app store fees be on the quotation?",
        answer:
          "Mention them so there are no surprises: Google Play charges a one-time $25 and Apple $99 a year. They're paid by the client's own developer accounts.",
      },
      {
        question: "Fixed price or hourly?",
        answer:
          "Fixed price for a clearly scoped MVP builds trust; hourly or monthly suits ongoing development where scope changes often.",
      },
    ],
    document: document({
      kind: "quote",
      templateId: "bold-black",
      number: "QT-0108",
      currency: "INR",
      taxMode: "gst",
      placeOfSupply: "29",
      from: party(
        "Launchpad App Studio",
        "2nd Floor, 80 Feet Road, Koramangala\nBengaluru, Karnataka 560034",
        {
          email: "hello@launchpadapps.in",
          stateCode: "29",
          taxId: "29AAKFL2345M1Z7",
        },
      ),
      to: party("FreshBasket Grocers", "HSR Layout\nBengaluru, Karnataka 560102", { stateCode: "29" }),
      items: [
        item("Discovery and UX/UI design (12 screens)", 1, 12000, 18, "998314"),
        item("Cross-platform app - Android and iOS (React Native)", 1, 24000, 18, "998314"),
        item("Backend, database and admin panel", 1, 12000, 18, "998314"),
        item("Razorpay payments and push notifications", 1, 6000, 18, "998314"),
        item("Testing and app store submission", 1, 4000, 18, "998314"),
      ],
      notes: "Your MVP can be live in about 15 days from design sign-off.",
      terms:
        "Valid for 30 days. 40% on acceptance, 30% on design approval, 30% at launch. Includes 30 days of free bug fixes after launch.",
    }),
  },
  {
    slug: "interior-design",
    name: "Interior Design",
    summary: "Design fee, materials and execution for a home.",
    metaTitle: "Interior Design Quotation Format - Free Example (PDF)",
    metaDescription:
      "An interior design quotation format with design fees, modular kitchen, wardrobes, false ceiling and painting. Edit it free and download a PDF quote.",
    heading: "Interior Design Quotation Format",
    intro:
      "Interior projects mix design fees, materials and labour. This quotation separates them by room and work type, with units and rates the client can compare.",
    highlights: {
      title: "What to include in an interior quote",
      items: [
        "Design and 3D visualisation fee",
        "Work items with units: running feet, square feet, numbers",
        "Material and brand specifications in the description",
        "Labour and installation",
        "Site supervision and timeline",
        "Payment stages and what's excluded",
      ],
    },
    guide: [
      {
        heading: "Use measurable units",
        paragraphs: [
          "Quote kitchens and wardrobes by running or square feet, false ceilings and painting by square feet, and fittings by number. Measurable units make quotes comparable and make changes easy to price later.",
        ],
      },
      {
        heading: "Specify materials",
        paragraphs: [
          "Mention the board, laminate, hardware and paint brands in each line. 'BWP plywood with Hettich hardware' avoids arguments about what was promised.",
        ],
      },
    ],
    faqs: [
      {
        question: "What GST applies to interior design?",
        answer:
          "Design services attract 18% GST; works contracts can be taxed differently. Ask your accountant how your contract is structured.",
      },
      {
        question: "How long should an interior quote be valid?",
        answer: "15 to 30 days, because material prices change often.",
      },
    ],
    document: document({
      kind: "quote",
      templateId: "minimal-sand",
      number: "QT-INT-042",
      currency: "INR",
      taxMode: "gst",
      placeOfSupply: "36",
      from: party("Studio Aangan Interiors", "Road No. 12, Banjara Hills\nHyderabad, Telangana 500034", {
        taxId: "36ABCFS9876Q1Z4",
        email: "design@studioaangan.in",
        stateCode: "36",
      }),
      to: party("Mr. & Mrs. Reddy", "Flat 1203, My Home Avatar\nHyderabad, Telangana 500032", {
        stateCode: "36",
      }),
      items: [
        item("Design, 3D views and site supervision", 1, 45000, 18, "998391"),
        item("Modular kitchen - BWP plywood, Hettich hardware (running ft)", 14, 6500, 18),
        item("Wardrobes - 3 bedrooms (sq ft)", 150, 1450, 18),
        item("Gypsum false ceiling with lighting (sq ft)", 600, 140, 18),
        item("Painting - Asian Paints Royale (sq ft)", 2400, 28, 18),
      ],
      notes: "Includes 3 design revisions and weekly site visits.",
      terms:
        "Valid for 15 days. 30% advance, 50% at material delivery, 20% at handover. Electrical and civil work excluded.",
    }),
  },
  {
    slug: "catering",
    name: "Catering",
    summary: "Per-plate pricing for events and weddings.",
    metaTitle: "Catering Quotation Format - Free Per-Plate Quote Example",
    metaDescription:
      "A catering quotation format with per-plate menu pricing, live counters, staff and equipment. Edit it free in the quotation generator and download a PDF.",
    heading: "Catering Quotation Format",
    intro:
      "Catering is priced per plate, plus extras. This quote shows the menu, guest count, live counters, service staff and equipment so the client can adjust numbers and see the total update.",
    highlights: {
      title: "What a catering quote needs",
      items: [
        "Event date, venue and guest count",
        "Menu package with per-plate price",
        "Live counters and add-ons",
        "Service staff and equipment",
        "Transport and setup",
        "Minimum guarantee and advance terms",
      ],
    },
    guide: [
      {
        heading: "Price per plate, confirm a minimum",
        paragraphs: [
          "Quote the menu per plate and set a minimum guaranteed count. Clients can then change the number of guests while you're protected against last-minute drops.",
        ],
      },
      {
        heading: "List the extras",
        paragraphs: [
          "Live counters, service staff, crockery, transport and setup are often where disputes start. List them as separate lines, even if some are included at no charge, so expectations are clear.",
        ],
      },
    ],
    faqs: [
      {
        question: "What GST applies to outdoor catering?",
        answer:
          "Outdoor catering is generally taxed at 5% GST without input tax credit, or 18% with credit in some cases. Check with your accountant for your situation.",
      },
      {
        question: "How much advance should a caterer take?",
        answer: "Commonly 30-50% on booking, with the balance before or on the event day.",
      },
    ],
    document: document({
      kind: "quote",
      templateId: "classic-forest",
      number: "QT-CAT-0093",
      currency: "INR",
      taxMode: "gst",
      placeOfSupply: "07",
      from: party("Annapurna Caterers", "A-45 Lajpat Nagar II\nNew Delhi 110024", {
        taxId: "07AAEFA4567R1Z1",
        email: "events@annapurnacaterers.in",
        phone: "+91 98110 44556",
        stateCode: "07",
      }),
      to: party("Sharma Family - Engagement Ceremony", "Hotel Crowne Plaza, Rohini\nNew Delhi 110085", {
        stateCode: "07",
      }),
      items: [
        item("Premium North Indian veg menu (per plate)", 250, 850, 5, "996334"),
        item("Live chaat and dosa counters", 2, 15000, 5, "996334"),
        item("Service staff (8 hours)", 12, 1200, 5, "996334"),
        item("Crockery, buffet setup and transport", 1, 18000, 5, "996334"),
      ],
      notes: "Menu tasting available for up to 4 people before confirmation.",
      terms:
        "Valid for 30 days. Minimum guarantee 225 plates. 40% advance on booking, balance on the event day.",
    }),
  },
];

const ALL_FORMATS = { invoice: INVOICE_FORMATS, quote: QUOTATION_FORMATS } as const;

/** Examples for a document kind, used to open one from a landing page. */
export const formatsFor = (kind: DocumentKind) => ALL_FORMATS[kind];
