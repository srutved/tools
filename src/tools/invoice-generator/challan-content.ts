import type { ToolContent } from "@/components/tool/tool-content";

/** Page copy for the delivery challan generator, which runs on the invoice engine. */
export const DELIVERY_CHALLAN_GENERATOR_CONTENT: ToolContent = {
  metaTitle: "Free Delivery Challan Generator - GST Challan for Job Work (PDF)",
  metaDescription:
    "Create GST delivery challans free for job work, goods on approval and stock transfers. Add consignee, vehicle and transporter. 15 templates, free PDF.",
  heading: "Free Delivery Challan Generator",
  intro:
    "Move goods with the right paperwork when there's no sale yet. Create a delivery challan for job work, goods on approval, exhibitions or stock transfers, with the consignee, delivery address, vehicle and transporter details - in any of 15 templates, as a free PDF.",
  howItWorks: [
    {
      title: "Add the consignee",
      text: "Enter your details, the consignee and the 'Deliver to' address. They're saved on your device for next time.",
    },
    {
      title: "List the goods",
      text: "Add each item with HSN code, quantity and value, then the purpose, vehicle number and transporter.",
    },
    {
      title: "Print and dispatch",
      text: "Download the PDF and print copies for the consignee, the transporter and your own records.",
    },
  ],
  features: [
    {
      title: "Transport details",
      text: "Vehicle number, transporter and a separate 'Deliver to' address, printed where the checkpost can see them.",
    },
    {
      title: "Purpose of movement",
      text: "Job work, supply on approval, branch transfer, exhibition or any other reason, stated on the challan.",
    },
    {
      title: "Item values and HSN codes",
      text: "Each line shows the HSN code, quantity and value, with GST where it applies, for the e-way bill and your records.",
    },
    {
      title: "15 professional templates",
      text: "The same designs as our invoices, so your challans and invoices match.",
    },
    {
      title: "Any currency, GST or VAT",
      text: "Value goods in any ISO currency, with CGST + SGST, IGST, VAT or no tax.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser and is saved on your device. Nothing touches a server.",
    },
  ],
  guide: [
    {
      heading: "When to use a delivery challan instead of an invoice",
      paragraphs: [
        "GST rules (Rule 55 of the CGST Rules) let you move goods under a delivery challan, instead of a tax invoice, when the movement isn't a sale yet or the invoice can't be raised at dispatch. Typical cases:",
      ],
      bullets: [
        "Sending goods to a job worker for processing, and receiving them back",
        "Supply on approval or sale-or-return, where the buyer may not keep the goods",
        "Moving stock to another godown or branch under the same GSTIN",
        "Taking goods to an exhibition, trade fair or for testing and repair",
        "Goods whose exact quantity isn't known at dispatch, such as liquid gas",
        "Machinery shipped in parts or batches, with the invoice raised before the first lot",
      ],
    },
    {
      heading: "What a GST delivery challan must contain",
      paragraphs: [
        "A delivery challan needs a serial number and date, the name, address and GSTIN of the consignor and consignee, the HSN code, description, quantity and taxable value of the goods, the tax rate and amount where the goods are going to a buyer, the place of supply for inter-state movement, and a signature.",
        "It's issued in triplicate: the original for the consignee, the duplicate for the transporter and the triplicate for the consignor. An e-way bill is generally needed when the consignment value exceeds ₹50,000, and for some movements (such as inter-state job work) regardless of value, so check the e-way bill rules before dispatch.",
        "A branch in another state, or with its own GSTIN, counts as a separate person under GST, so a transfer to it is usually a taxable supply that needs a tax invoice rather than a challan.",
      ],
    },
    {
      heading: "Delivery challan vs invoice",
      paragraphs: [
        "An invoice records a sale and asks for payment, and it's the document that carries the GST liability. A delivery challan only records that goods have moved, and why. If goods sent on approval are accepted, or goods are sold after being sent under a challan, raise a tax invoice for them - generally when the sale happens, and for goods on approval no later than six months from when they were sent.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is this delivery challan generator free?",
      answer:
        "Yes. Every template and PDF is free, with no sign-up, no watermark and no limits. It's open source and made by Srutved.",
    },
    {
      question: "When is a delivery challan used under GST?",
      answer:
        "When goods move without a sale or before an invoice can be raised: job work, supply on approval, transfers within the same GSTIN, exhibitions, or goods whose quantity isn't known at dispatch. Rule 55 of the CGST Rules sets out the cases.",
    },
    {
      question: "How many copies of a delivery challan are needed?",
      answer:
        "Three. The original goes to the consignee, the duplicate to the transporter and the triplicate stays with you. Print the PDF three times and mark each copy.",
    },
    {
      question: "Do I need an e-way bill with a delivery challan?",
      answer:
        "Generally yes, when the consignment value exceeds ₹50,000, and in some cases such as inter-state job work regardless of value. The challan's item values and HSN codes give you what you need to generate it.",
    },
    {
      question: "Should a delivery challan show GST?",
      answer:
        "Show the value of the goods in every case. Where the goods are going to a buyer, show the tax rate and amount as well. For job work or stock transfers within the same GSTIN, the value is usually enough.",
    },
    {
      question: "Where are my delivery challans stored?",
      answer:
        "Only in your own browser, on your device. Nothing is uploaded to a server. Clearing your browser data removes them, so keep the PDFs you print.",
    },
  ],
};
