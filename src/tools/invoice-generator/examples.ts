import type { UseCase, UseCaseCollection } from "@/components/tool/use-case";
import { EMPTY_PAYMENT_DETAILS, type Party, type PaymentDetails } from "@/shared/business-profile";
import type { DocumentKind } from "./lib/document-kind";
import { EMPTY_EXTRA, type Invoice, type LineItem, type TaxMode } from "./schema";

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
  metaTitle: "Invoice Formats by Profession - Free Examples",
  metaDescription:
    "Free invoice formats for freelancers, consultants, photographers, video editors, tutors, exporters and UK VAT. Edit an example and download a PDF.",
  intro:
    "Ready-made invoice examples for different kinds of work, with the right tax and payment details for each. Open one in the free invoice generator, add your details and download a PDF.",
};

export const QUOTATION_FORMATS_COLLECTION: UseCaseCollection = {
  toolSlug: "quotation-generator",
  segment: "formats",
  title: "Quotation Formats",
  noun: "quotation",
  metaTitle: "Quotation Formats by Business - Free Examples",
  metaDescription:
    "Free quotation formats for website design, app development, interior design, catering, marketing and construction. Edit an example and download a PDF.",
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
    extra: EMPTY_EXTRA,
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
    metaTitle: "Invoice Format for Freelancers (India, No GST)",
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
    metaTitle: "GST Invoice Format for Consultants - Free Example",
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
    metaTitle: "Photography Invoice Format - Free Template (PDF)",
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
    metaTitle: "Invoice Format for International Clients (USD)",
    metaDescription:
      "An invoice format for international clients in US dollars: hourly work, fixed-price items and a PayPal or Wise payment link. Edit free and download a PDF.",
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
    metaTitle: "Export Invoice Format Under LUT (Without IGST)",
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
  {
    slug: "consulting-hourly",
    name: "Hourly Consulting (GST)",
    summary: "Billing a client by the hour, with CGST and SGST.",
    metaTitle: "Hourly Consulting Invoice Format With GST - Free",
    metaDescription:
      "An hourly consulting invoice format with GST: hours by activity, hourly rate, SAC code, CGST and SGST and the billing period. Edit free and download a PDF.",
    heading: "Hourly Consulting Invoice Format (With GST)",
    intro:
      "Consultants who bill by the hour need an invoice that shows where the time went. This GST tax invoice lists hours by activity for the month, at one hourly rate, and charges CGST and SGST because the client is in the same state.",
    highlights: {
      title: "What an hourly consulting invoice shows",
      items: [
        "The billing period the hours relate to",
        "Hours for each activity, at your hourly rate",
        "SAC code for the service (998311 for management consulting)",
        "Your GSTIN and the client's, with the place of supply",
        "CGST and SGST at 9% each for a client in your state",
        "A reference to the timesheet or engagement letter",
      ],
    },
    guide: [
      {
        heading: "Show the hours, not just the total",
        paragraphs: [
          "A single line reading '46 hours - ₹1,84,000' prompts questions. Break the hours into the main activities - site visits, analysis, workshops, calls - so the client can match them against what they saw happen, and send your timesheet with the invoice.",
          "Use decimals for part hours (7.5 rather than 7 hours 30 minutes), and invoice on the same day each month so the client's accounts team knows when to expect it.",
        ],
      },
      {
        heading: "GST on consulting for a client in your state",
        paragraphs: [
          "For services to a GST-registered business, the place of supply is generally the client's location. When that's in your own state, you charge CGST and SGST at 9% each; when it's in another state, you charge IGST at 18% instead. The generator works this out from the two state codes.",
        ],
        bullets: [
          "998311 - Management consulting",
          "998312 - Business consulting, including public relations",
          "998313 - IT consulting",
          "998221 - Financial consulting",
        ],
      },
    ],
    faqs: [
      {
        question: "Is TDS deducted on the GST part of my invoice?",
        answer:
          "Not when GST is shown separately, as it is here. The client deducts TDS under section 194J on the fee excluding GST, and you can claim that TDS against your income tax.",
      },
      {
        question: "Should I bill hourly or charge a fixed fee?",
        answer:
          "Hourly suits open-ended advisory work where the effort is hard to predict. For a well-defined deliverable, a fixed fee is often easier for the client to approve. Many consultants agree an hourly rate with a cap on hours each month.",
      },
    ],
    document: document({
      templateId: "classic-slate",
      number: "AM/2026-27/019",
      currency: "INR",
      taxMode: "gst",
      placeOfSupply: "27",
      from: party(
        "Aditya Mehta Advisory",
        "504, Shree Krishna Tower, Andheri East\nMumbai, Maharashtra 400069",
        {
          taxId: "27ABMPM4567K1Z3",
          email: "aditya@adityamehta.in",
          phone: "+91 98201 34455",
          stateCode: "27",
        },
      ),
      to: party("Konkan Fresh Foods Pvt Ltd", "Plot 18, MIDC Wagle Estate\nThane, Maharashtra 400604", {
        taxId: "27AADCK7788F1Z6",
        stateCode: "27",
      }),
      payment: { accountName: "Aditya Mehta", ...INDIAN_BANK },
      items: [
        item("Supply chain review and warehouse visits, Bhiwandi (hours)", 22.5, 4000, 18, "998311"),
        item("Inventory planning model and documentation (hours)", 18, 4000, 18, "998311"),
        item("Weekly review calls with the leadership team (hours)", 5.5, 4000, 18, "998311"),
      ],
      notes: "Hours for 1-30 September 2026. The detailed timesheet is attached.",
      terms: "Payment due within 15 days, as per the engagement letter dated 1 August 2026.",
    }),
  },
  {
    slug: "video-editor",
    name: "Video Editor",
    summary: "Freelance video editing, reels and thumbnails.",
    metaTitle: "Video Editing Invoice Format - Free Template (PDF)",
    metaDescription:
      "A video editing invoice for freelancers: long-form edits, reels, colour grading, thumbnails, extra revisions and UPI payment. Edit free and download a PDF.",
    heading: "Video Editing Invoice Format",
    intro:
      "Freelance video editors juggle long-form edits, reels, thumbnails and extra revision rounds. This invoice puts each on its own line, names the video it relates to and adds a UPI QR code so creators and brands can pay in seconds.",
    highlights: {
      title: "What to list on a video editing invoice",
      items: [
        "The video title or project name in each description",
        "Final runtime and format (long-form, reel, short)",
        "Reels and shorts cut from the same footage as a separate line",
        "Colour grading, sound clean-up and thumbnails",
        "Extra revision rounds beyond those included",
        "UPI ID and bank details for quick payment",
      ],
    },
    guide: [
      {
        heading: "Per video, per minute or per hour?",
        paragraphs: [
          "Most editors quote per finished video for YouTube and social content, because clients find a fixed price easy to approve. Per-minute pricing suits long-form work where runtimes vary, and hourly billing suits open-ended jobs such as sorting through hours of event footage.",
          "Whichever you choose, put the basis in the description - '14-minute final cut' or 'reels, 30-45 seconds each' - so the client sees what they paid for.",
        ],
      },
      {
        heading: "Spell out revisions, music and project files",
        paragraphs: ["Small editing jobs cause disputes over the same few things. Settle them in the terms:"],
        bullets: [
          "How many revision rounds are included, and the price of each extra one",
          "Whether licensed music or stock footage is included or billed at cost",
          "Whether you hand over the project file and raw footage, or only the final export",
          "How long you keep the files after delivery",
        ],
      },
    ],
    faqs: [
      {
        question: "Do freelance video editors need to charge GST?",
        answer:
          "Only once you're registered. Registration is required when your turnover crosses ₹20 lakh (₹10 lakh in some special-category states); after that, editing services are generally taxed at 18%. Until then, invoice without GST, as in this example.",
      },
      {
        question: "Should I charge for extra revisions?",
        answer:
          "Yes, if they go beyond what you agreed. Include two rounds in your price, and bill further rounds as a separate line so the client can see why the total changed.",
      },
    ],
    document: document({
      templateId: "modern-crimson",
      number: "AN-2026-047",
      currency: "INR",
      taxMode: "none",
      from: party("Arjun Nair", "TC 14/220, Kowdiar\nThiruvananthapuram, Kerala 695003", {
        email: "arjun@arjunedits.in",
        phone: "+91 94470 21987",
      }),
      to: party("Monsoon Trails Media", "2nd Floor, Panampilly Nagar\nKochi, Kerala 682036", {
        email: "team@monsoontrails.in",
      }),
      payment: { upiId: "arjunedits@okaxis", accountName: "Arjun Nair", ...INDIAN_BANK },
      items: [
        item("YouTube video edit - 'Hidden Beaches of Gokarna' (14 min)", 1, 9000),
        item("Instagram reels cut from the same footage (30-45 sec)", 6, 1200),
        item("Colour grading and sound clean-up", 1, 3500),
        item("Thumbnail design", 2, 800),
        item("Extra revision round (third round)", 1, 1500),
      ],
      notes: "Final files are in the shared Google Drive folder. Thanks for another great trip to edit!",
      terms:
        "Payment due within 15 days by UPI or bank transfer. Two revision rounds included per video. Project files are kept for 60 days after delivery.",
    }),
  },
  {
    slug: "interior-designer",
    name: "Interior Designer (IGST)",
    summary: "Design fees for a project site in another state.",
    metaTitle: "Interior Design Invoice Format With GST (IGST)",
    metaDescription:
      "An interior design invoice with GST: design fee per sq ft, site supervision, SAC 998391 and IGST for a site in another state. Edit free, download a PDF.",
    heading: "Interior Design Invoice Format (With IGST)",
    intro:
      "An interior design firm billing a stage of work for an office in another state. Because interior design is tied to the property, the place of supply is where the site is - so this tax invoice charges IGST at 18% rather than CGST and SGST.",
    highlights: {
      title: "What this interior design invoice shows",
      items: [
        "The project and site address, and the stage being billed",
        "Design fee per square foot, or as a lump sum",
        "Site supervision visits as a separate line",
        "SAC code 998391 for interior design services",
        "Place of supply: the state where the property is",
        "IGST at 18% when the site is in another state",
      ],
    },
    guide: [
      {
        heading: "Place of supply follows the property",
        paragraphs: [
          "Under the IGST Act, services directly related to immovable property - including those of architects and interior decorators - are supplied where the property is located. That rule applies whether or not the client is GST-registered.",
          "So a Bengaluru firm designing a home in Bengaluru charges CGST and SGST, but the same firm designing an office in Chennai charges IGST, with Tamil Nadu as the place of supply. Set the place of supply to the site's state and the generator picks the right tax.",
        ],
      },
      {
        heading: "Bill in stages",
        paragraphs: [
          "Design projects run for months, so invoice at agreed stages rather than at the end - for example concept, detailed drawings and execution supervision. Name the stage in the description and refer to your agreement in the notes.",
          "Keep the design fee separate from materials, furniture or execution work. Those may be supplies of goods or works contracts, with their own codes and rates, so bill them on their own lines or on a separate invoice.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the GST rate on interior design services?",
        answer:
          "Interior design services are taxed at 18% GST under SAC 998391. Charge CGST and SGST at 9% each when the site is in your state, or IGST at 18% when it's in another state.",
      },
      {
        question: "Can I add furniture to the same invoice?",
        answer:
          "You can, but furniture is a supply of goods with its own HSN code and GST rate, so list it on separate lines with the right code and rate. If you supply and install everything as one contract, ask your accountant whether it counts as a works contract.",
      },
    ],
    document: document({
      templateId: "sidebar-emerald",
      number: "NID/2026-27/022",
      currency: "INR",
      taxMode: "gst",
      placeOfSupply: "33",
      from: party("Neev Interiors LLP", "88, 1st Main, Indiranagar\nBengaluru, Karnataka 560038", {
        taxId: "29AAOFN3344D1Z2",
        email: "studio@neevinteriors.in",
        phone: "+91 80 4123 7788",
        stateCode: "29",
      }),
      to: party(
        "Bayline Workspaces Pvt Ltd",
        "Site: 3rd Floor, Prestige Point, Guindy\nChennai, Tamil Nadu 600032",
        { taxId: "33AAGCB4521H1Z9", stateCode: "33" },
      ),
      payment: { accountName: "Neev Interiors LLP", ...INDIAN_BANK },
      items: [
        item("Stage 2: detailed drawings and 3D views - office fit-out (sq ft)", 4200, 45, 18, "998391"),
        item("Furniture, lighting and finishes schedule", 1, 25000, 18, "998391"),
        item("Site supervision visits to Chennai", 4, 7500, 18, "998391"),
      ],
      notes: "Stage 2 of 3, as per the design agreement dated 12 August 2026.",
      terms: "Payment due within 15 days. Travel and stay for site visits are included in the visit fee.",
    }),
  },
  {
    slug: "tutor",
    name: "Tutor / Coaching Classes",
    summary: "Monthly tuition fees for a student.",
    metaTitle: "Tuition Fee Invoice Format for Tutors - Free PDF",
    metaDescription:
      "A tuition fee invoice format for tutors and coaching classes: monthly fees, extra sessions, study material and UPI payment. Edit free and download a PDF.",
    heading: "Tuition Fee Invoice Format for Tutors and Coaching Classes",
    intro:
      "Parents appreciate a proper fee bill, and it makes your own records far easier. This invoice shows the student, the month, the subjects and any extras such as test series or doubt-clearing sessions, with a UPI QR code for quick payment.",
    highlights: {
      title: "What a tuition fee invoice includes",
      items: [
        "The student's name, class and batch",
        "The month or term the fee covers",
        "Subjects taught and the monthly fee",
        "Extra sessions, study material and test series as separate lines",
        "Your UPI ID with a scan-to-pay QR code",
        "Fee due date and your absence or refund policy",
      ],
    },
    guide: [
      {
        heading: "Do tutors need to charge GST?",
        paragraphs: [
          "The GST exemption for education covers schools and institutions that teach towards a qualification recognised by law. Private tuition and coaching classes aren't covered by it, so they're taxable like other services.",
          "In practice, most individual tutors are below the registration threshold - ₹20 lakh of turnover a year, or ₹10 lakh in some special-category states - and invoice without GST, as in this example. Once registered, coaching services are generally taxed at 18%.",
        ],
      },
      {
        heading: "Fee bills parents understand",
        paragraphs: [
          "Issue one invoice per student per month, on the same date each month. Name the month in the description, list one-off charges such as material or test series separately, and put your rules on missed classes and refunds in the terms so there are no awkward conversations later.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can parents claim coaching fees under section 80C?",
        answer:
          "Generally no. The section 80C deduction covers tuition fees paid to a school, college or university in India for the full-time education of up to two children, and only under the old tax regime. Private coaching and tuition fees don't qualify.",
      },
      {
        question: "Should I give a receipt after the fee is paid?",
        answer:
          "Yes, many parents ask for one. Issue a simple receipt that refers to the invoice number and the date and mode of payment.",
      },
    ],
    document: document({
      templateId: "minimal-sky",
      number: "PM-OCT26-014",
      currency: "INR",
      taxMode: "none",
      from: party("Pooja Mehta Tutorials", "12, Shanti Kunj Society, Satellite\nAhmedabad, Gujarat 380015", {
        email: "pooja@poojamehtatutorials.in",
        phone: "+91 98250 77341",
      }),
      to: party(
        "Mr. Rohan Shah (for Aarav Shah, Class 10)",
        "B-603, Shaligram Heights, Prahlad Nagar\nAhmedabad, Gujarat 380015",
      ),
      payment: { upiId: "poojamehta.tutor@okicici", accountName: "Pooja Mehta" },
      items: [
        item("Class 10 Maths and Science - October 2026 (monthly fee)", 1, 4500),
        item("Extra doubt-clearing sessions before mid-term exams (hours)", 4, 400),
        item("Study material and practice test series", 1, 1200),
      ],
      notes: "Batch: Monday, Wednesday and Friday, 5-7 pm. Thank you!",
      terms:
        "Fees are payable in advance by the 15th of each month. Fees are not refunded for missed classes; missed sessions can be made up in another batch.",
    }),
  },
];

export const QUOTATION_FORMATS: UseCase<Invoice>[] = [
  {
    slug: "website-design",
    name: "Website Design",
    summary: "Design, development and hosting for a business website.",
    metaTitle: "Website Design Quotation Format - Free Example",
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
    metaTitle: "App Development Quotation Format - Free MVP Quote",
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
    metaTitle: "Interior Design Quotation Format - Free Example",
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
        "Valid for 30 days. 30% advance, 50% at material delivery, 20% at handover. Electrical and civil work excluded.",
    }),
  },
  {
    slug: "catering",
    name: "Catering",
    summary: "Per-plate pricing for events and weddings.",
    metaTitle: "Catering Quotation Format - Free Per-Plate Quote",
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
  {
    slug: "digital-marketing",
    name: "Digital Marketing Retainer",
    summary: "Monthly social media, ads and SEO for a local business.",
    metaTitle: "Digital Marketing Quotation Format - Free Example",
    metaDescription:
      "A digital marketing quotation format for a monthly retainer: social media, ads management, SEO and a one-time setup, with GST. Edit free, download a PDF.",
    heading: "Digital Marketing Quotation Format (Monthly Retainer)",
    intro:
      "Digital marketing is usually sold as a monthly retainer. This quotation lists what the client gets each month - posts, reels, ad campaigns, blog articles and reporting - plus a one-time setup fee, so the first month and the running cost are both clear.",
    highlights: {
      title: "What a digital marketing quote should cover",
      items: [
        "Monthly deliverables: posts, reels, blogs and campaigns",
        "Platforms covered (Instagram, Facebook, Google...)",
        "One-time setup fees, separate from the monthly fee",
        "Ad budget paid by the client, not included in your fee",
        "Reporting and review meetings",
        "Minimum term and notice period",
      ],
    },
    guide: [
      {
        heading: "Quote deliverables, not hours",
        paragraphs: [
          "'16 posts and 8 reels a month' is easier to approve - and to check - than '40 hours of social media'. List the monthly output for each channel, and price one-time work such as an account audit or tracking setup on its own line so it doesn't look like part of the monthly fee.",
        ],
      },
      {
        heading: "Keep ad spend out of your fee",
        paragraphs: [
          "Recommend an ad budget in the notes, but have the client pay Google and Meta directly from their own ad accounts. You avoid fronting money, the client keeps ownership of the accounts and data, and your fee stays clearly about management.",
          "Results take time, so many agencies ask for a minimum commitment of three months, followed by a 30-day notice period. Put both in the terms.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much does digital marketing cost for a small business?",
        answer:
          "It depends on the channels and volume of content. Retainers for a local business covering one or two channels commonly start around ₹15,000-50,000 a month, before ad spend; full-service retainers with ads, SEO and content cost more.",
      },
      {
        question: "What GST applies to digital marketing services?",
        answer:
          "Marketing and advertising services are generally taxed at 18% GST. Charge CGST and SGST for a client in your state, or IGST for a client in another state.",
      },
    ],
    document: document({
      kind: "quote",
      templateId: "bold-orange",
      number: "PD-Q-2026-058",
      currency: "INR",
      taxMode: "gst",
      placeOfSupply: "08",
      from: party("Pinwheel Digital", "3rd Floor, Ashok Marg, C-Scheme\nJaipur, Rajasthan 302001", {
        taxId: "08AAPFP6112J1Z4",
        email: "hello@pinwheeldigital.in",
        phone: "+91 98290 61123",
        stateCode: "08",
      }),
      to: party("Marigold Jewellers", "Johari Bazaar\nJaipur, Rajasthan 302003", {
        taxId: "08ACKPG2398L1Z1",
        stateCode: "08",
      }),
      items: [
        item("Social media - Instagram and Facebook, 16 posts and 8 reels (monthly)", 1, 30000, 18, "998361"),
        item("Google and Meta ads campaign management (monthly)", 1, 15000, 18, "998361"),
        item("SEO - on-page optimisation and 4 blog articles (monthly)", 1, 18000, 18, "998361"),
        item("One-time setup: account audit, tracking and catalogue", 1, 12000, 18, "998361"),
      ],
      notes:
        "Recommended ad budget: ₹40,000 a month, paid by Marigold Jewellers directly to Google and Meta. From the second month, the monthly fee is ₹63,000 plus GST.",
      terms:
        "Valid for 30 days. Monthly fee payable in advance. Minimum term of 3 months, then 30 days' notice. Includes a monthly report and review call.",
    }),
  },
  {
    slug: "event-management",
    name: "Event Management",
    summary: "A corporate offsite with production, décor and entertainment.",
    metaTitle: "Event Management Quotation Format - Free Example",
    metaDescription:
      "An event management quotation for a corporate event: planning, stage, sound, décor, entertainment, photography, transfers and GST. Edit free, get a PDF.",
    heading: "Event Management Quotation Format",
    intro:
      "A corporate offsite involves a dozen suppliers, but the client wants one clear number. This quotation groups the event into planning, production, décor, entertainment, photography and transfers, so they can see the total and adjust any part of it.",
    highlights: {
      title: "What an event quotation should include",
      items: [
        "Event name, dates, venue and guest count",
        "Your planning and coordination fee",
        "Production: stage, sound, lighting and LED walls",
        "Décor, entertainment and photography",
        "Logistics such as guest transfers",
        "Advance, payment schedule and cancellation terms",
      ],
    },
    guide: [
      {
        heading: "Show what changes with the guest count",
        paragraphs: [
          "Some costs are fixed - the stage, the band, your coordination fee - and some depend on numbers, like transfers, welcome kits and meals. Price per-guest items with a quantity so the client can see the effect of 20 more or fewer guests, and state the guest count the quote assumes.",
        ],
      },
      {
        heading: "Agree payments and cancellation up front",
        paragraphs: [
          "Event managers commit money to vendors weeks in advance, so the payment schedule matters as much as the total. A common pattern:",
        ],
        bullets: [
          "50% advance to confirm dates and book vendors",
          "40% about a week before the event",
          "The balance on completion, with any agreed extras",
          "Cancellation charges that rise as the event date approaches",
        ],
      },
    ],
    faqs: [
      {
        question: "What GST applies to event management?",
        answer:
          "Event management services are generally taxed at 18% GST (SAC 998596). For a GST-registered business client, the place of supply is usually the client's location, so this Mumbai company charges IGST to a client registered in Karnataka even though the event is in Goa.",
      },
      {
        question: "Should hotel rooms go on the event quotation?",
        answer:
          "Often it's simpler for the client to pay the hotel directly. Accommodation has its own GST rules based on where the hotel is, so if you do include it, ask your accountant how to bill it.",
      },
    ],
    document: document({
      kind: "quote",
      templateId: "sidebar-plum",
      number: "SSE/Q/2026/112",
      currency: "INR",
      taxMode: "gst",
      placeOfSupply: "29",
      from: party(
        "Saffron Sky Events LLP",
        "Unit 12, Laxmi Industrial Estate, Andheri West\nMumbai, Maharashtra 400053",
        {
          taxId: "27ABQFS6655L1Z4",
          email: "events@saffronsky.in",
          phone: "+91 98670 22418",
          stateCode: "27",
        },
      ),
      to: party("Kestrel Analytics Pvt Ltd", "Outer Ring Road, Bellandur\nBengaluru, Karnataka 560103", {
        taxId: "29AAHCK9012N1Z5",
        stateCode: "29",
      }),
      items: [
        item("Event planning, venue liaison and on-ground coordination", 1, 85000, 18, "998596"),
        item("Stage, LED wall, sound and lighting (per evening)", 2, 65000, 18, "998596"),
        item("Theme décor - welcome area and gala dinner", 1, 70000, 18, "998596"),
        item("Emcee and live band for the gala night", 1, 90000, 18, "998596"),
        item("Photography and highlights video", 1, 45000, 18, "998596"),
        item("Airport transfers by coach (per trip)", 6, 9000, 18, "998596"),
      ],
      notes:
        "Annual sales offsite, Goa, 12-14 December 2026, for 120 guests. Hotel rooms are booked by Kestrel directly.",
      terms:
        "Valid for 30 days. 50% advance to confirm, 40% seven days before the event, balance on completion. Cancellation within 30 days of the event: advance not refundable.",
    }),
  },
  {
    slug: "printing",
    name: "Printing",
    summary: "Visiting cards, brochures, flex banners and standees.",
    metaTitle: "Printing Quotation Format - Free Print Shop Quote",
    metaDescription:
      "A printing quotation format for print shops: visiting cards, brochures, flex banners and standees with size, paper and finish. Edit free, download a PDF.",
    heading: "Printing Quotation Format",
    intro:
      "Print jobs are priced on the details: size, paper, colours, finish and quantity. This quotation from a local print shop spells them out for visiting cards, brochures, flex banners and a standee, so the customer knows exactly what they'll get.",
    highlights: {
      title: "What a printing quote should specify",
      items: [
        "Size and paper weight (GSM) for each item",
        "Colours, single or double sided, and finish",
        "Quantity and the price per piece, box or sq ft",
        "Design or artwork charges, if you prepare the files",
        "Proof approval and delivery time",
        "Advance and quote validity",
      ],
    },
    guide: [
      {
        heading: "Describe the job precisely",
        paragraphs: [
          "'1,000 brochures' can mean anything from thin flyers to glossy booklets. Write the size, paper GSM, print colours, sides and finish - for example 'A4 tri-fold, 170 GSM art paper, 4-colour both sides' - so your quote can be compared fairly and the customer can't later expect something better.",
          "Price flex banners and vinyl by the square foot and state the material, and price cards by the box of 100.",
        ],
      },
      {
        heading: "Proofs, files and delivery",
        paragraphs: [
          "Ask the customer to approve a proof before printing, and say in the terms that errors in an approved proof are their responsibility. Mention whether design is included or whether they supply print-ready files, and give a delivery time that starts from proof approval, not from the order.",
        ],
      },
    ],
    faqs: [
      {
        question: "What GST applies to printing?",
        answer:
          "It depends on the job: some printing is treated as a supply of goods and some as a printing service, and rates differ between products such as brochures and flex banners. Check the HSN or SAC code and rate for each item with your accountant. This example is from a shop that isn't GST-registered.",
      },
      {
        question: "Why does the price per piece fall with quantity?",
        answer:
          "Setting up a job - preparing files, plates or the press - costs the same for 100 pieces as for 5,000. Spread over more copies, that cost per piece drops, which is why offset printing suits large runs and digital printing suits small ones.",
      },
    ],
    document: document({
      kind: "quote",
      templateId: "minimal-mono",
      number: "IPH-Q-0386",
      currency: "INR",
      taxMode: "none",
      from: party("Inkwell Print House", "14, Aminabad Market\nLucknow, Uttar Pradesh 226018", {
        email: "orders@inkwellprint.in",
        phone: "+91 94150 33872",
      }),
      to: party("Hearth & Home Bakery", "C-22, Gomti Nagar\nLucknow, Uttar Pradesh 226010", {
        email: "hello@hearthandhome.in",
      }),
      items: [
        item("Visiting cards - 350 GSM, both sides, matt lamination (box of 100)", 5, 450),
        item("A4 tri-fold brochure - 170 GSM art paper, 4-colour both sides", 1000, 9),
        item("Star flex banners with eyelets, 2 x (6 ft x 3 ft) (sq ft)", 36, 22),
        item("Roll-up standee, 2.5 ft x 6 ft, with print", 1, 1800),
        item("Brochure layout design (2 revisions)", 1, 2500),
      ],
      notes: "Prices include cutting and packing. Free delivery within Lucknow city.",
      terms:
        "Valid for 30 days. 50% advance with the order, balance on delivery. Printing starts after proof approval; delivery in 4 working days.",
    }),
  },
  {
    slug: "construction",
    name: "Construction and Renovation",
    summary: "Bathroom and kitchen renovation with materials and labour.",
    metaTitle: "Construction Quotation Format - Free Example",
    metaDescription:
      "A construction and renovation quotation with materials and labour on separate lines, in sq ft, running ft and points, with GST. Edit free, download a PDF.",
    heading: "Construction and Renovation Quotation Format",
    intro:
      "A renovation quote for a homeowner: demolition, waterproofing, tiling, plumbing and a kitchen platform, with materials and labour priced by measurable units. The customer can see what each part costs and how the total changes if the measurements do.",
    highlights: {
      title: "What a renovation quote should include",
      items: [
        "Each work item with units: sq ft, running ft, points or lump sum",
        "Materials and labour shown separately where it helps",
        "Material grades and brands in the description",
        "Demolition and debris removal",
        "What's excluded, and how extra work is priced",
        "Payment stages linked to progress",
      ],
    },
    guide: [
      {
        heading: "Separate materials and labour",
        paragraphs: [
          "Homeowners often compare quotes line by line. Showing tile material and tiling labour separately - each by the square foot - lets them choose a different tile without asking you to re-quote everything, and makes it easy to adjust the bill if the final measurements differ.",
          "Say in the terms that the final bill will follow measurements taken on site after the work, at the quoted rates.",
        ],
      },
      {
        heading: "Avoid surprises once walls are opened",
        paragraphs: ["Renovation uncovers problems. Protect both sides with a few clear terms:"],
        bullets: [
          "Hidden damage such as leaking pipes or weak plaster is quoted separately before it's fixed",
          "Electrical work, painting and fixtures are excluded unless listed",
          "Material prices are held for the validity period only",
          "Payments are linked to stages, such as start, tiling complete and handover",
        ],
      },
    ],
    faqs: [
      {
        question: "What GST applies to renovation work?",
        answer:
          "When a contractor supplies both materials and labour, the job is usually a works contract and taxed as a service - generally at 18% on the full value, not at separate rates for materials and labour. Lower rates apply to some specific projects, so confirm with your accountant.",
      },
      {
        question: "Should a renovation quote include a contingency?",
        answer:
          "Rather than padding every line, state that hidden problems found during the work will be quoted and approved before you fix them. The customer sees a fair price, and you're covered for the unexpected.",
      },
    ],
    document: document({
      kind: "quote",
      templateId: "classic-navy",
      number: "KCW/Q/26-27/041",
      currency: "INR",
      taxMode: "gst",
      placeOfSupply: "33",
      from: party(
        "Kaveri Civil Works",
        "45, Lattice Bridge Road, Thiruvanmiyur\nChennai, Tamil Nadu 600041",
        {
          taxId: "33ABDFK2211C1Z7",
          email: "quotes@kavericivil.in",
          phone: "+91 98410 55602",
          stateCode: "33",
        },
      ),
      to: party(
        "Mrs. Lakshmi Narayanan",
        "Flat 2B, Sea Breeze Apartments, Besant Nagar\nChennai, Tamil Nadu 600090",
        {
          stateCode: "33",
        },
      ),
      items: [
        item("Demolition of old bathroom tiles and debris removal (lump sum)", 1, 12000, 18, "9954"),
        item("Waterproofing - bathroom floor and walls up to 1 ft (sq ft)", 120, 65, 18, "9954"),
        item("Vitrified floor and wall tiles - material (sq ft)", 320, 85, 18, "9954"),
        item("Tiling labour with cement, sand and adhesive (sq ft)", 320, 45, 18, "9954"),
        item("Concealed CPVC plumbing - material and labour (points)", 6, 2500, 18, "9954"),
        item("Kitchen platform with granite top - material and labour (running ft)", 10, 2200, 18, "9954"),
        item("Wall plaster repairs and putty (sq ft)", 200, 40, 18, "9954"),
      ],
      notes: "Final bill as per site measurements at the quoted rates. Work takes about 3 weeks.",
      terms:
        "Valid for 30 days. 30% advance, 40% when tiling is complete, 30% at handover. Electrical work, painting and sanitaryware excluded.",
    }),
  },
];

const ALL_FORMATS: Record<DocumentKind, UseCase<Invoice>[]> = {
  invoice: INVOICE_FORMATS,
  quote: QUOTATION_FORMATS,
  proforma: [],
  receipt: [],
  "credit-note": [],
  "debit-note": [],
  challan: [],
  "purchase-order": [],
};

/** Examples for a document kind, used to open one from a landing page. */
export const formatsFor = (kind: DocumentKind) => ALL_FORMATS[kind];
