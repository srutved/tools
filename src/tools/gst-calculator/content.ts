import type { ToolContent } from "@/components/tool/tool-content";

export const GST_CALCULATOR_CONTENT: ToolContent = {
  metaTitle: "GST Calculator - Add or Remove GST (GST 2.0 Rates)",
  metaDescription:
    "Free GST calculator for India. Add or remove GST at 5%, 18%, 40% or any rate, with the CGST and SGST or IGST split and the formula shown.",
  heading: "Free GST Calculator",
  intro:
    "Add GST to a price, or work out how much GST is inside an amount that already includes it. Pick a rate, choose whether the sale is within your state or to another state, and see the CGST, SGST or IGST split as you type.",
  howItWorks: [
    {
      title: "Enter the amount",
      text: "Choose Add GST for a price before tax, or Remove GST for an amount that already includes it.",
    },
    {
      title: "Pick the rate",
      text: "One click for 0.25%, 3%, 5%, 18% or 40%, or type any other rate.",
    },
    {
      title: "Read the split",
      text: "See the amount before GST, the GST and the total, split into CGST and SGST or charged as IGST.",
    },
  ],
  features: [
    {
      title: "Add or remove GST",
      text: "Works both ways: from a price before tax, or back from a GST-inclusive total.",
    },
    {
      title: "GST 2.0 rates",
      text: "The current 5%, 18% and 40% slabs, plus 0.25% and 3%, and a custom rate for anything else.",
    },
    {
      title: "CGST, SGST and IGST",
      text: "Splits the tax half and half within a state, or shows it as IGST for a sale to another state.",
    },
    {
      title: "Formula shown",
      text: "See exactly how each figure was worked out, so you can check it or explain it to a client.",
    },
    {
      title: "Accurate to the paisa",
      text: "Every amount is rounded to two decimals, and CGST and SGST always add up to the GST.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Nothing you type is sent anywhere.",
    },
  ],
  guide: [
    {
      heading: "GST rates after GST 2.0",
      paragraphs: [
        "From 22 September 2025, GST moved to a simpler structure, often called GST 2.0. Most goods and services now fall into two main slabs, 5% and 18%, with a special 40% rate for a short list of luxury and sin goods. The old 12% and 28% slabs were removed: most items that were taxed at 12% moved down to 5%, and most items at 28% moved down to 18%.",
        "A few special rates remain, and many essentials stay exempt at 0%:",
      ],
      bullets: [
        "0.25% on rough and cut diamonds and some precious stones",
        "3% on gold, silver and jewellery",
        "5% on many everyday goods and services",
        "18% as the standard rate for most other goods and services",
        "40% on luxury and sin goods, such as large cars and sugary or caffeinated drinks",
      ],
    },
    {
      heading: "Which rate applies to you?",
      paragraphs: [
        "The exact rate depends on the HSN code (for goods) or SAC code (for services) of what you're selling, and sometimes on its price or how it's supplied. Rates change through notifications, so check the latest rate notifications on the CBIC GST website, or ask your accountant, before you put a rate on an invoice.",
      ],
    },
    {
      heading: "How to add or remove GST",
      paragraphs: [
        "To add GST to a price, multiply the price by the rate and divide by 100: GST = amount × rate ÷ 100. The total is the amount plus the GST. For example, 18% GST on ₹10,000 is ₹1,800, so the total is ₹11,800.",
        "To take GST out of an amount that already includes it, divide by 100 plus the rate and multiply by 100: amount before GST = inclusive amount × 100 ÷ (100 + rate). The GST is the difference. For example, ₹11,800 including 18% GST is ₹10,000 before GST, plus ₹1,800 GST.",
        "A common mistake is to take 18% off the inclusive amount. 18% of ₹11,800 is ₹2,124, which is more than the GST actually in it.",
      ],
    },
    {
      heading: "CGST and SGST, or IGST?",
      paragraphs: [
        "It depends on the place of supply. When you sell within your own state (an intra-state supply), the GST is split equally between the central government (CGST) and the state (SGST, or UTGST in a union territory). At 18%, that's 9% CGST and 9% SGST.",
        "When you sell to a customer in another state (an inter-state supply), or export, the whole amount is charged as IGST. The total tax is the same either way; only the way it's shown on the invoice and in your returns changes.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I calculate 18% GST on an amount?",
      answer:
        "Multiply the amount by 18 and divide by 100. On ₹25,000, the GST is ₹4,500 and the total is ₹29,500. Within your state, that's ₹2,250 CGST and ₹2,250 SGST; to another state, it's ₹4,500 IGST.",
    },
    {
      question: "How do I find the GST in a price that already includes it?",
      answer:
        "Divide the price by (100 + rate) and multiply by 100 to get the amount before GST; the rest is GST. For ₹5,900 at 18%: ₹5,900 × 100 ÷ 118 = ₹5,000, so the GST is ₹900. Choose Remove GST in the calculator to do this for you.",
    },
    {
      question: "Are the 12% and 28% GST rates still used?",
      answer:
        "Not for most goods and services since 22 September 2025, when they were removed and most items moved to 5% or 18%. You may still need them to check an older invoice; use the Custom rate field for that.",
    },
    {
      question: "What is the 40% GST rate?",
      answer:
        "A special rate for a short list of luxury and sin goods, such as large cars, high-end motorcycles and sugary or caffeinated drinks. Check the CBIC notifications for the full list.",
    },
    {
      question: "When do I charge IGST instead of CGST and SGST?",
      answer:
        "When the supplier and the place of supply are in different states, for example when you deliver goods to a customer in another state. Within the same state you charge CGST and SGST, half each.",
    },
  ],
};
