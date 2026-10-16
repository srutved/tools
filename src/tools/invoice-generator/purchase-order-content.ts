import type { ToolContent } from "@/components/tool/tool-content";

/** Page copy for the purchase order generator, which runs on the invoice engine. */
export const PURCHASE_ORDER_GENERATOR_CONTENT: ToolContent = {
  metaTitle: "Free Purchase Order Generator - GST, PDF Download",
  metaDescription:
    "Create purchase orders free for your suppliers. 15 templates, any currency, GST or VAT, ship-to address, delivery date and terms. Free PDF with no sign-up.",
  heading: "Free Purchase Order Generator",
  intro:
    "Order from suppliers with a clear, professional purchase order. Set out exactly what you're buying, at what price, where and when it should be delivered and on what terms - in any of 15 templates, in any currency, as a free PDF.",
  howItWorks: [
    {
      title: "Add the vendor",
      text: "Enter your business, the vendor and the 'Ship to' address. They're saved on your device for next time.",
    },
    {
      title: "List what you're buying",
      text: "Add items, quantities, agreed rates and tax, the delivery date and the vendor's quote reference.",
    },
    {
      title: "Send for acceptance",
      text: "Download the PDF and send it to the vendor. Their acceptance confirms the order.",
    },
  ],
  features: [
    {
      title: "Vendor and ship-to address",
      text: "Show who you're buying from and exactly where the goods should arrive, if it's not your billing address.",
    },
    {
      title: "Delivery date and quote reference",
      text: "Print the date you need the goods and the vendor's quotation number, so the order matches what was agreed.",
    },
    {
      title: "Terms and conditions",
      text: "Payment terms, delivery, inspection and warranty, written once and reused on every PO.",
    },
    {
      title: "GST and VAT ready",
      text: "CGST + SGST or IGST with HSN/SAC codes, or any VAT and sales tax rate.",
    },
    {
      title: "15 templates, any currency",
      text: "The same designs as our invoices, in any ISO currency with the amount in words.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser and is saved on your device. Your suppliers and prices never touch a server.",
    },
  ],
  guide: [
    {
      heading: "What is a purchase order?",
      paragraphs: [
        "A purchase order (PO) is a document a buyer sends to a vendor to order goods or services. It sets out what is being bought, the quantity, the agreed price, the delivery date and place, and the terms. It gives both sides a written record of the order and lets your accounts team check the vendor's invoice against what was actually ordered.",
        "A PO is an offer to buy. It becomes binding once the vendor accepts it - by signing or acknowledging it, or by starting to supply on its terms. Until then, you can usually amend or withdraw it.",
      ],
    },
    {
      heading: "Purchase order vs quotation vs invoice",
      paragraphs: [
        "The documents follow each other. The vendor sends a quotation with their price. You, the buyer, send a purchase order to accept that price and place the order - quoting the vendor's quotation number. After delivering, the vendor sends an invoice requesting payment, quoting your PO number.",
        "Many businesses go one step further with three-way matching: before paying, they check that the purchase order, the delivery note or goods received note (GRN), and the vendor's invoice all agree on items, quantities and prices. It catches short deliveries, wrong rates and duplicate bills before money goes out.",
      ],
    },
    {
      heading: "What to include in a purchase order",
      paragraphs: ["A complete purchase order leaves the vendor nothing to guess:"],
      bullets: [
        "Your business name, billing address and GSTIN, and the vendor's details",
        "A unique PO number and date, and the vendor's quotation reference if any",
        "Each item with description, HSN/SAC code, quantity, unit and agreed rate",
        "Taxes, discounts and the total order value",
        "The 'Ship to' address and the required delivery date",
        "Payment terms, delivery terms, and any inspection, warranty or penalty clauses",
        "A request to quote the PO number on the invoice and delivery documents",
      ],
    },
  ],
  faqs: [
    {
      question: "Is this purchase order generator free?",
      answer:
        "Yes. Every template and PDF is free, with no sign-up, no watermark and no limits. It's open source and made by Srutved.",
    },
    {
      question: "When does a purchase order become binding?",
      answer:
        "When the vendor accepts it, by signing or acknowledging it or by starting to supply on its terms. Once accepted, it forms a contract on the terms it sets out.",
    },
    {
      question: "Who issues a purchase order, the buyer or the seller?",
      answer:
        "The buyer. The seller sends a quotation and later an invoice; the buyer sends the purchase order to place the order.",
    },
    {
      question: "Can I add GST to a purchase order?",
      answer:
        "Yes. Choose India GST as the tax type and the PO shows CGST and SGST or IGST, with HSN/SAC codes, so the order value matches the invoice you expect. A PO isn't a tax invoice, so you can't claim input tax credit on it.",
    },
    {
      question: "What is three-way matching?",
      answer:
        "Checking that the purchase order, the delivery note or goods received note, and the vendor's invoice agree before you pay. It's a simple control against paying for goods you didn't order or receive.",
    },
    {
      question: "Where are my purchase orders stored?",
      answer:
        "Only in your own browser, on your device. Nothing is uploaded to a server. Clearing your browser data removes them, so keep the PDFs you send.",
    },
  ],
};
