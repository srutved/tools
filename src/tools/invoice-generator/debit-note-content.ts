import type { ToolContent } from "@/components/tool/tool-content";

/** Page copy for the debit note generator, which runs on the invoice engine. */
export const DEBIT_NOTE_GENERATOR_CONTENT: ToolContent = {
  metaTitle: "Free Debit Note Generator - GST, PDF Download",
  metaDescription:
    "Create GST debit notes free when an invoice undercharged or extra charges apply. Link the original invoice, add GST or VAT and download a PDF. No sign-up.",
  heading: "Free Debit Note Generator",
  intro:
    "Bill the difference when an invoice came out too low. Reference the original invoice, explain the reason, add the extra amount with tax and download a professional debit note in any of 15 templates - free, with no sign-up and no watermark.",
  howItWorks: [
    {
      title: "Link the invoice",
      text: "Enter the original invoice number and date, and your client's details. They're saved on your device for next time.",
    },
    {
      title: "Add the extra amount",
      text: "Choose the reason and list what was undercharged or added, with quantities, rates and tax.",
    },
    {
      title: "Download and send",
      text: "Download the PDF debit note for your client and keep a copy for your GST return.",
    },
  ],
  features: [
    {
      title: "Original invoice reference",
      text: "The original invoice number and date are printed on the debit note, so the client can match it.",
    },
    {
      title: "Reason for the debit",
      text: "Undercharged price, short-billed quantity, extra freight or any other reason, stated clearly.",
    },
    {
      title: "GST ready",
      text: "CGST + SGST or IGST with HSN/SAC codes, matching the original invoice. VAT and no-tax options too.",
    },
    {
      title: "15 professional templates",
      text: "The same designs as our invoices and credit notes, so all your documents match.",
    },
    {
      title: "Every currency",
      text: "Debit notes in USD, EUR, GBP, AED or any ISO currency, with the amount in words.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser and is saved on your device. Nothing touches a server.",
    },
  ],
  guide: [
    {
      heading: "When should you issue a debit note?",
      paragraphs: [
        "A supplier issues a debit note when the value or tax on an invoice turns out to be lower than it should be, and the client owes more. Common reasons:",
      ],
      bullets: [
        "The price on the invoice was lower than agreed, or a price increase applies",
        "More goods were delivered than were invoiced",
        "Freight, packing or other charges were left off the invoice",
        "Tax was charged at a lower rate than applies",
      ],
    },
    {
      heading: "How GST treats a debit note",
      paragraphs: [
        "Under GST, a debit note must reference the original tax invoice and show your GSTIN, the recipient's details, the additional taxable value and the tax on it. It is reported in GSTR-1 for the period in which it's issued, and the extra tax is added to your output tax for that period. The recipient can generally claim input tax credit on it, like an invoice.",
        "GST law treats a supplementary invoice as a kind of debit note, so you don't need both. If you've been told to raise a 'supplementary invoice' for an undercharge, a debit note does the same job.",
      ],
    },
    {
      heading: "Debit notes in accounting vs under GST",
      paragraphs: [
        "In everyday accounting, buyers sometimes send their supplier a 'debit note' when they return goods, meaning 'we've debited your account'. That's a perfectly normal internal document, but it isn't a GST debit note. Under GST, a debit note is issued by the supplier to increase an invoice. For returned goods, the GST document is the supplier's credit note.",
        "So if a customer sends you a debit note for a return, issue them a credit note against the original invoice to adjust the GST.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is this debit note generator free?",
      answer:
        "Yes. Every template and PDF is free, with no sign-up, no watermark and no limits. It's open source and made by Srutved.",
    },
    {
      question: "Who issues a debit note under GST?",
      answer:
        "The supplier, when the taxable value or tax on an invoice was too low. The buyer's 'debit notes' for returned goods are an accounting practice, not GST documents.",
    },
    {
      question: "Is a debit note the same as a supplementary invoice?",
      answer:
        "Under GST, yes in effect: a debit note covers what used to be called a supplementary invoice. Either way, it increases the amount and tax on an earlier invoice.",
    },
    {
      question: "Do I report a debit note in my GST return?",
      answer:
        "Yes. Debit notes are reported in GSTR-1 for the period in which they're issued, and the extra tax is paid with that period's return.",
    },
    {
      question: "What's the difference between a debit note and a credit note?",
      answer:
        "A debit note increases what the client owes on an invoice. A credit note reduces it, for example for returned goods or an overcharge. Both reference the original invoice.",
    },
    {
      question: "Where are my debit notes stored?",
      answer:
        "Only in your own browser, on your device. Nothing is uploaded to a server. Clearing your browser data removes them, so keep the PDFs you send.",
    },
  ],
};
