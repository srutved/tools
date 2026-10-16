import type { ToolContent } from "@/components/tool/tool-content";

/** Page copy for the quotation generator, which runs on the invoice engine. */
export const QUOTATION_GENERATOR_CONTENT: ToolContent = {
  metaTitle: "Free Quotation Generator - Quotes & Estimates PDF",
  metaDescription:
    "Create quotations and estimates free. 15 templates, any currency, GST or VAT and instant PDF. Turn an accepted quote into an invoice in one click.",
  heading: "Free Quotation Generator",
  intro:
    "Send clients a clear, professional quotation in minutes. Pick from 15 templates, price your work in any currency with GST or VAT, download a PDF - and turn it into an invoice in one click when it's accepted.",
  howItWorks: [
    {
      title: "Add your details",
      text: "Enter your business and your client's details once. They're saved on your device for next time.",
    },
    {
      title: "Price the work",
      text: "List items, quantities and rates, add tax and a discount, and set how long the quote is valid.",
    },
    {
      title: "Send, then invoice",
      text: "Download the PDF to send. When the client says yes, convert it into an invoice instantly.",
    },
  ],
  features: [
    {
      title: "Quote to invoice in one click",
      text: "Accepted quotations become invoices with the same client, items and tax - no retyping.",
    },
    {
      title: "15 professional templates",
      text: "The same classic, modern, minimal, sidebar and bold designs as our invoices, so your documents match.",
    },
    {
      title: "Every currency",
      text: "Quote international clients in USD, EUR, GBP, AED or any ISO currency, with the amount in words.",
    },
    {
      title: "GST and VAT ready",
      text: "India GST with CGST + SGST or IGST and HSN/SAC codes, or any VAT and sales tax rate.",
    },
    {
      title: "Validity date",
      text: "Every quotation shows how long the price holds, so there's no confusion later.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Your prices and client details never touch a server.",
    },
  ],
  guide: [
    {
      heading: "What to include in a quotation",
      paragraphs: ["A good quotation answers every question before the client asks it:"],
      bullets: [
        "Your business name, contact details and tax registration (GSTIN or VAT number)",
        "The client's name and address",
        "A quotation number and date, plus how long the quote is valid",
        "Each product or service with quantity, rate and amount",
        "Discounts, taxes broken down by rate, and the total",
        "Terms: what's included, payment schedule and when work can start",
      ],
    },
    {
      heading: "Quotation vs estimate vs invoice",
      paragraphs: [
        "An estimate is an approximate price that may change as the work becomes clearer. A quotation is a fixed price for a defined scope, valid for a set period - once the client accepts it, you're expected to honour it. An invoice comes after the work, requesting payment for what was delivered.",
        "Many businesses use the words interchangeably. Whatever you call it, be clear whether the price is fixed and what it covers.",
      ],
    },
    {
      heading: "Quotation format in India",
      paragraphs: [
        "A quotation is not a tax invoice, so it doesn't need a GST invoice number. It's still good practice to show your GSTIN, the client's GSTIN for business clients, HSN or SAC codes and the GST that will apply, so the client knows the full cost. When the quote is accepted, issue a proper tax invoice - this generator converts it for you.",
      ],
    },
    {
      heading: "Tips for quotes that win work",
      paragraphs: [
        "Break the work into clear line items rather than one lump sum, so the client sees what they're paying for. State what's not included. Set a validity period of 15 to 30 days so old prices don't come back to bite you, and follow up a few days after sending.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is this quotation generator free?",
      answer:
        "Yes. Every template and PDF is free, with no sign-up, no watermark and no limits. It's open source and made by Srutved.",
    },
    {
      question: "Can I turn a quotation into an invoice?",
      answer:
        "Yes. Open the quotation and click 'Convert to invoice'. A new invoice is created with the same client, items, tax and template, a new invoice number and today's date, and opens in the invoice generator.",
    },
    {
      question: "Can I add GST to a quotation?",
      answer:
        "Yes. Choose India GST as the tax type and the quotation shows CGST and SGST or IGST, depending on your state and the client's, with HSN/SAC codes.",
    },
    {
      question: "How long should a quotation be valid?",
      answer:
        "Usually 15 to 30 days. Shorter if your costs change quickly, longer for large projects. Set the date in 'Valid until' - it's printed on the quotation.",
    },
    {
      question: "Where are my quotations stored?",
      answer:
        "Only in your own browser, on your device. Nothing is uploaded to a server. Clearing your browser data removes them, so keep the PDFs you send.",
    },
  ],
};
