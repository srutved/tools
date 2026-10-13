import type { ToolContent } from "@/components/tool/tool-content";

export const INVOICE_GENERATOR_CONTENT: ToolContent = {
  metaTitle: "Free Invoice Generator - GST, VAT & Any Currency, PDF Download",
  metaDescription:
    "Create professional invoices free in seconds. 15 templates, any currency, India GST (CGST/SGST/IGST), VAT, UPI QR codes and instant PDF download. No sign-up, no watermark.",
  heading: "Free Invoice Generator",
  intro:
    "Create a professional invoice in under a minute. Pick from 15 templates, bill in any currency with GST, VAT or sales tax, and download a clean PDF - free, with no sign-up and no watermark.",
  howItWorks: [
    {
      title: "Add your details",
      text: "Enter your business and client details once. They're saved on your device for next time.",
    },
    {
      title: "Add items and tax",
      text: "List your work, choose a currency and tax type. Totals and amount in words update instantly.",
    },
    {
      title: "Download or print",
      text: "Pick a template you like and download a print-ready PDF to email or share.",
    },
  ],
  features: [
    {
      title: "15 professional templates",
      text: "Classic, modern, minimal, sidebar and bold designs - switch any time without retyping.",
    },
    {
      title: "Every currency",
      text: "All ISO currencies with correct symbols, decimals and digit grouping, plus the amount in words.",
    },
    {
      title: "India GST built in",
      text: "Automatic CGST + SGST or IGST from the place of supply, HSN/SAC codes and 'Tax Invoice' titling.",
    },
    {
      title: "Export invoices under LUT",
      text: "Zero-rated export invoices with the LUT declaration printed for you.",
    },
    {
      title: "UPI QR codes",
      text: "Rupee invoices get a scan-to-pay QR code with the exact amount filled in.",
    },
    {
      title: "VAT and sales tax",
      text: "Use any tax name and rate, with mixed rates per line and a clean tax summary.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Your invoices and client details never touch a server.",
    },
    {
      title: "Your invoice history",
      text: "Every invoice is saved on your device. Reopen, duplicate or delete them any time.",
    },
  ],
  guide: [
    {
      heading: "What should an invoice include?",
      paragraphs: [
        "A clear invoice gets paid faster. Whatever your country, a professional invoice should include:",
      ],
      bullets: [
        "Your business name, address and contact details, plus your tax ID (GSTIN, VAT number) if you're registered",
        "Your client's name and address, and their tax ID for business-to-business invoices",
        "A unique invoice number, the invoice date and the payment due date",
        "Each product or service with quantity, rate and amount",
        "Subtotal, any discount, tax broken down by rate, and the total due",
        "How to pay: bank details, UPI ID or a payment link",
      ],
    },
    {
      heading: "GST invoice format in India",
      paragraphs: [
        "A GST-registered business must title the document 'Tax Invoice' and show its GSTIN, the client's GSTIN (for B2B supplies), the place of supply, and the HSN or SAC code for each item.",
        "Tax depends on where the supply happens. If you and your client are in the same state, the invoice charges CGST and SGST, each at half the GST rate. If you're in different states, it charges IGST at the full rate. This generator works it out automatically from your state and the place of supply.",
      ],
    },
    {
      heading: "How to invoice international clients",
      paragraphs: [
        "Bill in your client's currency - USD, EUR, GBP, AED or any other - so they see exactly what they owe. Include your bank's SWIFT code or a payment link such as PayPal, Stripe or Wise.",
        "Indian freelancers and businesses exporting services can supply them without charging GST under a Letter of Undertaking (LUT). Choose 'India export under LUT' and add your LUT reference, and the required declaration is printed on the invoice.",
      ],
    },
    {
      heading: "Invoice, quote and receipt: what's the difference?",
      paragraphs: [
        "A quote (or estimate) is sent before the work, to agree on a price. An invoice is sent after delivering the work, to request payment. A receipt confirms that payment has been received. Use this tool to create the invoice, and keep a copy of every PDF you send for your records.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is this invoice generator really free?",
      answer:
        "Yes. Every template and every PDF download is free, with no sign-up, no watermark and no limits. The tool is open source and maintained by Srutved.",
    },
    {
      question: "Where is my invoice data stored?",
      answer:
        "Only in your own browser, on your device. Nothing is uploaded to a server. If you clear your browser data, saved invoices are removed, so keep the PDFs you send.",
    },
    {
      question: "Can I create a GST invoice?",
      answer:
        "Yes. Choose India GST as the tax type and add your GSTIN. CGST and SGST are applied when you and your client are in the same state, and IGST when you're in different states. HSN/SAC codes and the place of supply are printed on the invoice.",
    },
    {
      question: "How do I invoice an international client from India?",
      answer:
        "Choose 'India export under LUT', pick the client's currency and add your LUT reference number. The invoice is zero-rated and includes the required declaration.",
    },
    {
      question: "Which currencies are supported?",
      answer:
        "All ISO 4217 currencies your browser knows - over 150, including USD, EUR, GBP, INR, AED, SGD, AUD, CAD and JPY - with the right symbol, decimal places and amount in words.",
    },
    {
      question: "How does the UPI QR code work?",
      answer:
        "Add your UPI ID to a rupee invoice and a QR code appears with the exact amount and invoice number. Your client scans it with any UPI app (GPay, PhonePe, Paytm and others) to pay instantly.",
    },
    {
      question: "Can I add my logo?",
      answer:
        "Yes. Upload a PNG, JPG, SVG or WebP logo. It's resized on your device and appears on every template.",
    },
  ],
};
