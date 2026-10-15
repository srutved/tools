import type { ToolContent } from "@/components/tool/tool-content";

/** Page copy for the proforma invoice generator, which runs on the invoice engine. */
export const PROFORMA_GENERATOR_CONTENT: ToolContent = {
  metaTitle: "Free Proforma Invoice Generator - GST, Export & Advance Payment (PDF)",
  metaDescription:
    "Create proforma invoices free for advance payments and export orders. 15 templates, any currency, GST or VAT, UPI QR and PDF. Convert to an invoice in one click.",
  heading: "Free Proforma Invoice Generator",
  intro:
    "Send a buyer a proforma invoice before you ship or start work, so they can pay an advance, open a letter of credit or get approvals. Pick from 15 templates, price in any currency with GST or VAT, download a PDF - and convert it into the final invoice once the order is confirmed.",
  howItWorks: [
    {
      title: "Add your details",
      text: "Enter your business and the buyer's details once. They're saved on your device for next time.",
    },
    {
      title: "Price the order",
      text: "List the goods or services, quantities and rates, add tax, set a valid-until date and your payment details.",
    },
    {
      title: "Collect, then invoice",
      text: "Send the PDF to collect the advance. When the order is confirmed, convert it into a tax invoice in one click.",
    },
  ],
  features: [
    {
      title: "Proforma to invoice in one click",
      text: "When the order is confirmed, 'Convert to invoice' creates the final invoice with the same buyer, items and tax.",
    },
    {
      title: "Built for advance payments",
      text: "Add your bank details and UPI ID. Rupee proformas get a scan-to-pay QR code with the exact amount filled in.",
    },
    {
      title: "Valid-until date",
      text: "Show how long your prices and terms hold, so the buyer knows when to pay or reconfirm.",
    },
    {
      title: "Every currency",
      text: "Quote overseas buyers in USD, EUR, GBP, AED or any ISO currency, with the amount in words.",
    },
    {
      title: "15 templates, GST and VAT",
      text: "The same designs as our invoices, with CGST + SGST or IGST and HSN/SAC codes, or any VAT rate.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser and is saved on your device. Your prices and buyers never touch a server.",
    },
  ],
  guide: [
    {
      heading: "What is a proforma invoice?",
      paragraphs: [
        "A proforma invoice is a preliminary bill sent before goods are delivered or services are provided. It sets out what the buyer is ordering, at what price, with what tax and on what terms, so they can arrange payment or approvals in advance. It looks like an invoice, but it's a commitment to sell on those terms rather than a demand for payment for something already supplied.",
        "Businesses use proforma invoices to:",
      ],
      bullets: [
        "Ask for an advance or full payment before dispatching goods or starting work",
        "Confirm the details of an export or import order with an overseas buyer",
        "Let the buyer open a letter of credit or arrange a foreign currency remittance through their bank",
        "Give customs a declared value for samples, or for goods ahead of the commercial invoice",
        "Support a bank loan, subsidy or internal purchase approval that needs a priced document",
      ],
    },
    {
      heading: "Is a proforma invoice a tax invoice under GST?",
      paragraphs: [
        "No. A proforma invoice is not a tax invoice. Issuing one doesn't by itself create a GST liability, it doesn't need to go into your GST returns, and the buyer can't claim input tax credit on it. Showing the GST that will apply is still useful, so the buyer knows the full amount.",
        "GST is due when the actual supply happens and you issue the tax invoice. Advances can change the timing: if you receive an advance for services, GST is generally payable on that advance and you issue a receipt voucher for it. Once the order is confirmed and supplied, raise a proper tax invoice with its own invoice number - this tool converts the proforma for you. Check the specifics with your accountant.",
      ],
    },
    {
      heading: "Proforma invoice vs quotation vs tax invoice",
      paragraphs: [
        "A quotation is an offer: here's what we'd charge, if you'd like to go ahead. A proforma invoice usually comes once the buyer has agreed in principle - it sets out the order exactly as it will be invoiced, often so the buyer can pay in advance. A tax invoice is the final document issued when the supply is made, and it's the one that counts for GST, accounts and input tax credit.",
        "Number your proformas separately from your tax invoices (for example PI-001), so there's no confusion in your records.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is this proforma invoice generator free?",
      answer:
        "Yes. Every template and PDF is free, with no sign-up, no watermark and no limits. It's open source and made by Srutved.",
    },
    {
      question: "Can I claim input tax credit on a proforma invoice?",
      answer:
        "No. Input tax credit can only be claimed on a tax invoice (or other prescribed documents such as a debit note). Ask your supplier for the tax invoice once the goods or services are supplied.",
    },
    {
      question: "How do I convert a proforma into a final invoice?",
      answer:
        "Open the proforma and click 'Convert to invoice'. A new invoice is created with the same buyer, items, tax and template, a new invoice number and today's date, and opens in the invoice generator.",
    },
    {
      question: "Can I make a proforma invoice for an export order?",
      answer:
        "Yes. Choose the buyer's currency, add your bank details including the SWIFT code, and list the goods with their HSN codes. Buyers often use it to open a letter of credit or arrange payment.",
    },
    {
      question: "Can the buyer pay by UPI from the proforma?",
      answer:
        "Yes. Add your UPI ID to a rupee proforma and a QR code is printed with the exact amount. The buyer scans it with any UPI app to pay the advance.",
    },
    {
      question: "Where are my proforma invoices stored?",
      answer:
        "Only in your own browser, on your device. Nothing is uploaded to a server. Clearing your browser data removes them, so keep the PDFs you send.",
    },
  ],
};
