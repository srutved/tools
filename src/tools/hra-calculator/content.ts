import type { ToolContent } from "@/components/tool/tool-content";

export const HRA_CALCULATOR_CONTENT: ToolContent = {
  metaTitle: "HRA Calculator - New 8 Metro Rules (FY 2026-27)",
  metaDescription:
    "Free HRA exemption calculator. Enter basic pay, HRA and rent to see tax-free HRA, with Bengaluru, Hyderabad, Pune and Ahmedabad as metros from FY 2026-27.",
  heading: "Free HRA Calculator",
  intro:
    "Find out how much of your house rent allowance is tax-free. Enter your basic salary, the HRA you receive and the rent you pay, and see all three limits side by side, under the latest rules that make eight cities metros from FY 2026-27.",
  howItWorks: [
    {
      title: "Enter your salary",
      text: "Your basic salary (plus DA, if any) and the HRA on your payslip, monthly or yearly.",
    },
    {
      title: "Add your rent and city",
      text: "The rent you pay and the city you live in. Metros get a higher limit.",
    },
    {
      title: "See your exemption",
      text: "The tax-free and taxable parts of your HRA, with the limit that decides it highlighted.",
    },
  ],
  features: [
    {
      title: "Latest metro rules",
      text: "Bengaluru, Hyderabad, Pune and Ahmedabad count as metros from FY 2026-27, alongside the original four.",
    },
    {
      title: "All three limits shown",
      text: "See the HRA received, rent minus 10% of basic, and 50% or 40% of basic, with the lowest picked out.",
    },
    {
      title: "Monthly or yearly",
      text: "Enter figures either way; results are shown for both a month and the full year.",
    },
    {
      title: "Compare tax years",
      text: "Switch between FY 2026-27 and FY 2025-26 to see how the new metro list changes your exemption.",
    },
    {
      title: "Rent receipts in one click",
      text: "Carry your rent straight into our free rent receipt generator.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Your salary details never leave your device.",
    },
  ],
  guide: [
    {
      heading: "How the HRA exemption works",
      paragraphs: [
        "If your salary includes house rent allowance (HRA) and you live in a rented home, part of the HRA can be tax-free under the old tax regime. The tax-free amount is the lowest of three figures:",
      ],
      bullets: [
        "The HRA you actually receive from your employer",
        "The rent you pay, minus 10% of your basic salary plus DA",
        "50% of your basic salary plus DA if you live in a metro city, or 40% anywhere else",
      ],
    },
    {
      heading: "Eight metro cities from FY 2026-27",
      paragraphs: [
        "Until FY 2025-26, only Delhi, Mumbai, Kolkata and Chennai counted as metros for HRA. The Income-tax Rules, 2026 add Bengaluru, Hyderabad, Pune and Ahmedabad from 1 April 2026, so salaried people living there can now claim up to 50% of basic salary instead of 40%.",
        "Only the cities themselves are included. Satellite cities such as Gurugram, Noida, Navi Mumbai and Thane still use the 40% limit. For someone in Bengaluru with a basic salary of ₹60,000 a month, the higher limit can add up to ₹6,000 a month (₹72,000 a year) to the tax-free HRA, if the rent and HRA are high enough.",
      ],
    },
    {
      heading: "Paying rent to your parents",
      paragraphs: [
        "You can claim HRA on rent paid to your parents if they own the home and you genuinely pay them rent, ideally by bank transfer, with a rent agreement and receipts. Your parents must show the rent as income in their own tax return. You can't claim HRA on rent paid to your spouse, or for a home you own and live in.",
      ],
    },
    {
      heading: "Paying rent without HRA",
      paragraphs: [
        "If your salary doesn't include HRA, for example because you're self-employed or your employer doesn't offer it, there's a separate deduction for rent paid under the old regime. It has its own, lower limits and needs a declaration form. Ask your tax adviser whether it applies to you.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is HRA exempt under the new tax regime?",
      answer:
        "No. The HRA exemption is only available under the old tax regime. If you choose the new regime, all of your HRA is taxed as part of your salary, though the new regime's lower rates and higher rebate often make up for it.",
    },
    {
      question: "Which cities count as metros for HRA?",
      answer:
        "From FY 2026-27: Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune and Ahmedabad. Up to FY 2025-26, only the first four. Satellite cities such as Gurugram, Noida, Navi Mumbai and Thane are not included.",
    },
    {
      question: "Does DA count when working out HRA?",
      answer:
        "Only dearness allowance that forms part of your salary for retirement benefits counts. Most private-sector salaries don't include DA, so you can usually enter just your basic salary.",
    },
    {
      question: "Do I need my landlord's PAN to claim HRA?",
      answer:
        "Yes, if the rent you pay is more than ₹1,00,000 a year (about ₹8,333 a month). If your landlord doesn't have a PAN, they can give you a signed declaration saying so instead.",
    },
    {
      question: "What proof does my employer need for HRA?",
      answer:
        "Usually rent receipts for each month, and often the rent agreement. Our free rent receipt generator makes a full year of receipts in one PDF.",
    },
    {
      question: "What if I didn't pay rent for the whole year?",
      answer:
        "The exemption is worked out only for the months you paid rent and received HRA. Enter monthly figures here and multiply the monthly exemption by the number of months you rented.",
    },
  ],
};
