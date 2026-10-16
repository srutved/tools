import type { ToolContent } from "@/components/tool/tool-content";

export const RENT_RECEIPT_GENERATOR_CONTENT: ToolContent = {
  metaTitle: "Free Rent Receipt Generator - HRA Receipts in PDF",
  metaDescription:
    "Make free rent receipts for HRA: one numbered receipt per month, landlord PAN, revenue stamp and signature. Download the whole year as one PDF. No sign-up.",
  heading: "Free Rent Receipt Generator",
  intro:
    "Fill in the tenant, landlord, rent and months once, and get a numbered rent receipt for every month - the whole financial year in a single PDF, ready to sign and hand to your employer for your HRA claim.",
  howItWorks: [
    {
      title: "Enter the tenancy",
      text: "Tenant and landlord names, the property address and the monthly rent.",
    },
    {
      title: "Choose the months",
      text: "One click for this financial year, or pick any range. Each month gets its own receipt.",
    },
    {
      title: "Download and sign",
      text: "All the receipts in one PDF, about three to a page, ready to print and sign.",
    },
  ],
  features: [
    {
      title: "A year in one go",
      text: "Twelve numbered, dated receipts from a single form - no copying and pasting.",
    },
    {
      title: "HRA-ready",
      text: "Landlord's PAN, the rent period, amount in figures and words, and the property address.",
    },
    {
      title: "Revenue stamp box",
      text: "Added automatically to cash receipts over ₹5,000, where a ₹1 stamp is needed.",
    },
    {
      title: "Digital signature",
      text: "Add the landlord's signature once and it appears on every receipt.",
    },
    {
      title: "Six clean designs",
      text: "Classic, modern and minimal layouts that print well in colour or black and white.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Your details never touch a server.",
    },
  ],
  guide: [
    {
      heading: "What a rent receipt must include",
      paragraphs: [
        "Employers check rent receipts before allowing the HRA exemption. Each receipt should show:",
      ],
      bullets: [
        "The tenant's and landlord's names",
        "The rent amount, in figures and in words",
        "The month or period the rent is for, and the date it was paid",
        "The address of the rented property",
        "How the rent was paid: bank transfer, UPI, cheque or cash",
        "The landlord's signature, and their PAN if the yearly rent is over ₹1,00,000",
      ],
    },
    {
      heading: "Rent receipts and your HRA exemption",
      paragraphs: [
        "If your salary includes House Rent Allowance and you live in rented housing, part of the HRA can be tax-free under the old tax regime. The exempt amount is the lowest of: the HRA you actually receive; the rent you pay minus 10% of your basic salary; or 50% of your basic salary in Delhi, Mumbai, Kolkata or Chennai (40% elsewhere).",
        "Your employer will usually ask for rent receipts, and your rental agreement, before the end of the financial year. Keep copies with your tax records in case the Income Tax Department asks for proof later. The HRA exemption isn't available under the new tax regime.",
      ],
    },
    {
      heading: "Landlord's PAN, revenue stamps and TDS",
      paragraphs: [
        "If the rent you pay is more than ₹1,00,000 in a year (about ₹8,333 a month), your employer needs your landlord's PAN to allow the exemption. If the landlord doesn't have a PAN, they can sign a declaration saying so instead.",
        "Receipts for cash payments above ₹5,000 need a ₹1 revenue stamp, signed across by the landlord. Rent paid by bank transfer, UPI or cheque doesn't need one, as the payment itself is the proof.",
        "Individuals who pay more than ₹50,000 a month in rent must also deduct TDS before paying the landlord. Check the current rate and filing rules on the Income Tax Department's website.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is this rent receipt generator free?",
      answer:
        "Yes. Every design and PDF download is free, with no sign-up and no watermark. It's made by Srutved.",
    },
    {
      question: "Can I make receipts for the whole year at once?",
      answer:
        "Yes. Choose the financial year, or any range of up to 24 months, and you get one numbered receipt for each month in a single PDF.",
    },
    {
      question: "Do rent receipts need a revenue stamp?",
      answer:
        "Only when the rent is paid in cash and the amount is more than ₹5,000. The generator adds a stamp box to those receipts; stick a ₹1 revenue stamp there and have the landlord sign across it.",
    },
    {
      question: "Is the landlord's PAN mandatory?",
      answer:
        "Only when your rent is over ₹1,00,000 a year and you're claiming HRA. Below that, it's optional. If the landlord has no PAN, a signed declaration from them is accepted instead.",
    },
    {
      question: "Who should sign the rent receipt?",
      answer:
        "The landlord. You can add a picture of their signature so it appears on every receipt, or print the receipts and have them signed by hand.",
    },
    {
      question: "Where are my receipts stored?",
      answer:
        "Only in your own browser, on your device. Nothing is uploaded to a server. Use “My rent receipts” to reopen a set or duplicate it for next year.",
    },
  ],
};
