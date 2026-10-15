import type { ToolContent } from "@/components/tool/tool-content";

/** Page copy for the payment receipt generator, which runs on the invoice engine. */
export const RECEIPT_GENERATOR_CONTENT: ToolContent = {
  metaTitle: "Free Receipt Generator - Payment Receipts for Cash, UPI & Bank (PDF)",
  metaDescription:
    "Create payment receipts free for cash, UPI, bank transfer, cheque or card. 15 templates, any currency, GST or VAT and instant PDF. No sign-up, no watermark.",
  heading: "Free Receipt Generator",
  intro:
    "Give customers a clear receipt the moment they pay. Record who paid, how much, by which mode and against which invoice, pick from 15 templates and download a PDF - or create the receipt from a saved invoice in one click.",
  howItWorks: [
    {
      title: "Add your details",
      text: "Enter your business and the payer's details once. They're saved on your device for next time.",
    },
    {
      title: "Record the payment",
      text: "Add the amount received, the payment mode, the transaction or cheque reference and the invoice it settles.",
    },
    {
      title: "Download and share",
      text: "Download the PDF receipt to email or WhatsApp to your customer, and keep a copy for your books.",
    },
  ],
  features: [
    {
      title: "Receipt from an invoice in one click",
      text: "In the invoice generator, open the invoice and use 'Record payment' to create a receipt for its total, linked to the invoice.",
    },
    {
      title: "Every payment mode",
      text: "Cash, UPI, bank transfer, cheque or card, with the UTR, transaction ID or cheque number printed.",
    },
    {
      title: "Linked to the invoice",
      text: "Show the invoice number the payment settles, so both sides can match it in their accounts.",
    },
    {
      title: "15 professional templates",
      text: "The same designs as our invoices, so your receipts, invoices and quotations all match.",
    },
    {
      title: "Any currency, GST or VAT",
      text: "Receipts in any ISO currency with the amount in words, and GST or VAT details when you need them.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser and is saved on your device. Payment details never touch a server.",
    },
  ],
  guide: [
    {
      heading: "What should a payment receipt include?",
      paragraphs: ["A receipt is proof that money changed hands. A good one includes:"],
      bullets: [
        "Your business name, address and contact details, plus your GSTIN or VAT number if registered",
        "A unique receipt number and the date the payment was received",
        "Who paid: the customer's name, and address if you have it",
        "The amount received, in figures and in words",
        "How it was paid - cash, UPI, bank transfer, cheque or card - with the transaction ID or cheque number",
        "The invoice or order the payment is against, and any balance still due",
        "A signature or stamp, if your customer or your own process needs one",
      ],
    },
    {
      heading: "Receipt vs invoice",
      paragraphs: [
        "An invoice asks for payment: it tells the customer what they owe and by when. A receipt confirms that payment has been made. You usually send the invoice first and the receipt once the money arrives. For a shop counter sale paid on the spot, the bill and the receipt are often the same document.",
        "If a customer pays an invoice in parts, issue a receipt for each payment and show the balance still due.",
      ],
    },
    {
      heading: "Receipts, advances and cash payments in India",
      paragraphs: [
        "Under GST, when a registered business receives an advance before supplying goods or services, it issues a receipt voucher for the advance rather than a tax invoice. The tax invoice follows when the supply is made. Whether GST is payable on the advance depends on what you supply, so check with your accountant.",
        "Income tax rules prohibit accepting ₹2 lakh or more in cash from one person in a day, for a single transaction, or for transactions relating to one event, and the penalty can equal the amount received. For larger payments, ask for UPI, a bank transfer or a cheque and record the reference on the receipt.",
        "Some businesses still fix a ₹1 revenue stamp to signed receipts for cash above ₹5,000, as stamp duty rules require for certain receipts. The rules vary by state and many receipts are exempt, so follow what your accountant advises.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is this receipt generator free?",
      answer:
        "Yes. Every template and PDF is free, with no sign-up, no watermark and no limits. It's open source and made by Srutved.",
    },
    {
      question: "Can I create a receipt from an invoice?",
      answer:
        "Yes. Open a saved invoice and click 'Record payment'. A receipt is created with the same customer and amount, linked to that invoice number. Add the payment mode and reference, and download it.",
    },
    {
      question: "Which payment modes can I record?",
      answer:
        "Cash, UPI, bank transfer (NEFT, RTGS or IMPS), cheque and card. Add the UPI transaction ID, UTR or cheque number so the payment can be traced.",
    },
    {
      question: "Can I make a receipt for a part payment?",
      answer:
        "Yes. Enter the amount actually received as the receipt's amount, and add the invoice number under 'Invoice paid'. Issue another receipt for each later instalment.",
    },
    {
      question: "Is a receipt the same as a GST receipt voucher?",
      answer:
        "Not quite. A receipt voucher is the GST document for an advance received before the supply. A payment receipt confirms any payment, including payment of an invoice already issued. You can use this tool for both - just title and describe it clearly.",
    },
    {
      question: "Where are my receipts stored?",
      answer:
        "Only in your own browser, on your device. Nothing is uploaded to a server. Clearing your browser data removes them, so keep the PDFs you send.",
    },
  ],
};
