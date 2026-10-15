import type { ToolContent } from "@/components/tool/tool-content";

/** Page copy for the credit note generator, which runs on the invoice engine. */
export const CREDIT_NOTE_GENERATOR_CONTENT: ToolContent = {
  metaTitle: "Free Credit Note Generator - GST Credit Notes for Returns (PDF)",
  metaDescription:
    "Create GST credit notes free for returned goods, overcharges and discounts. Link the original invoice, add CGST, SGST or IGST and download a PDF. No sign-up.",
  heading: "Free Credit Note Generator",
  intro:
    "Reduce what a client owes on an invoice the right way. Reference the original invoice, give the reason, adjust the items and tax, and download a professional credit note in any of 15 templates - or create it from a saved invoice in one click.",
  howItWorks: [
    {
      title: "Link the invoice",
      text: "Enter the original invoice number and date, or start from a saved invoice so the client and items are filled in.",
    },
    {
      title: "Adjust the amount",
      text: "Choose the reason and list the items, quantities or amounts being credited. Tax is reversed at the same rates.",
    },
    {
      title: "Download and send",
      text: "Download the PDF credit note for your client and keep a copy for your GST return.",
    },
  ],
  features: [
    {
      title: "Credit note from an invoice in one click",
      text: "Start from a saved invoice and the client, items and tax are copied across, with the invoice reference filled in.",
    },
    {
      title: "Original invoice reference",
      text: "The original invoice number and date are printed on every credit note, as GST requires.",
    },
    {
      title: "Reason for the credit",
      text: "Goods returned, excess charged, a post-sale discount or deficiency in service, stated clearly.",
    },
    {
      title: "GST ready",
      text: "CGST + SGST or IGST with HSN/SAC codes, matching the original invoice. VAT and no-tax options too.",
    },
    {
      title: "15 templates, any currency",
      text: "The same designs as our invoices, in any ISO currency with the amount in words.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser and is saved on your device. Nothing touches a server.",
    },
  ],
  guide: [
    {
      heading: "When is a GST credit note issued?",
      paragraphs: [
        "A supplier issues a credit note when the value or tax on an invoice turns out to be higher than it should be. Common reasons:",
      ],
      bullets: [
        "The customer returned some or all of the goods",
        "The invoice charged a higher price or rate of tax than agreed",
        "Fewer goods were delivered than were invoiced",
        "Goods or services were found deficient and the price was reduced",
        "A discount was given after the sale",
      ],
    },
    {
      heading: "Rules and time limits for GST credit notes",
      paragraphs: [
        "A GST credit note must reference the original tax invoice (or invoices) it relates to, and show your GSTIN, the recipient's details, the taxable value and the tax being reduced. It is reported in GSTR-1 for the period in which it's issued, and it reduces your output tax. The recipient reverses the matching input tax credit.",
        "There's a deadline. A credit note for a supply must be declared by 30 November following the end of the financial year in which the original supply was made, or the date you file the annual return for that year, if earlier. After that, you can still settle the amount commercially, but you can't reduce the GST already paid.",
        "Post-sale discounts need care: GST can generally be reduced only if the discount was agreed before or at the time of supply and can be linked to specific invoices. Other discounts are often given through a commercial credit note that doesn't change the GST. Check with your accountant.",
      ],
    },
    {
      heading: "Credit note vs refund",
      paragraphs: [
        "A credit note reduces what the client owes. If the invoice hasn't been paid yet, the client pays the reduced amount. If it has been paid, the credit can be adjusted against future invoices or paid back as a refund - the credit note is the document that records why. A refund is the money going back; the credit note is the paperwork that justifies it in both sets of accounts.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is this credit note generator free?",
      answer:
        "Yes. Every template and PDF is free, with no sign-up, no watermark and no limits. It's open source and made by Srutved.",
    },
    {
      question: "Can I create a credit note from an existing invoice?",
      answer:
        "Yes. Open a saved invoice and create a credit note from it in one click. The client, items and tax are copied and the original invoice number and date are filled in. Remove or change the lines that aren't being credited.",
    },
    {
      question: "Does a credit note need to reference the original invoice?",
      answer:
        "Yes. Under GST a credit note must refer to the tax invoice it relates to. Outside India it's still good practice, so both sides can match it in their accounts.",
    },
    {
      question: "What is the time limit for issuing a GST credit note?",
      answer:
        "It must be declared by 30 November following the end of the financial year of the original supply, or the date of filing the annual return for that year, whichever is earlier.",
    },
    {
      question: "What's the difference between a credit note and a debit note?",
      answer:
        "A credit note reduces what the client owes on an invoice. A debit note increases it, for example when the invoice undercharged. Both reference the original invoice.",
    },
    {
      question: "Where are my credit notes stored?",
      answer:
        "Only in your own browser, on your device. Nothing is uploaded to a server. Clearing your browser data removes them, so keep the PDFs you send.",
    },
  ],
};
