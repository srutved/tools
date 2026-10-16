import type { ToolContent } from "@/components/tool/tool-content";

export const RD_CALCULATOR_CONTENT: ToolContent = {
  metaTitle: "RD Calculator - Bank & Post Office RD Maturity",
  metaDescription:
    "Free RD calculator for India. See the maturity amount and interest on a recurring deposit with quarterly compounding, as banks and the post office do.",
  heading: "Free RD Calculator",
  intro:
    "Enter how much you'll deposit each month, the interest rate and the tenure in months to see what your recurring deposit will be worth at maturity. Interest is compounded every quarter, the way banks and the post office work it out.",
  howItWorks: [
    {
      title: "Enter your monthly deposit",
      text: "The fixed amount you'll put in every month.",
    },
    {
      title: "Add the rate and tenure",
      text: "The yearly rate your bank or post office offers, and the term in months.",
    },
    {
      title: "See the maturity amount",
      text: "Total deposits, interest earned and the maturity value, with a year-by-year table.",
    },
  ],
  features: [
    {
      title: "Quarterly compounding",
      text: "Each instalment earns interest compounded every quarter for the months it stays in, as banks calculate it.",
    },
    {
      title: "Any tenure",
      text: "From 6 months to 10 years, including the 5-year post office RD.",
    },
    {
      title: "Deposits vs interest",
      text: "See how much of the maturity amount is your money and how much is interest.",
    },
    {
      title: "Year by year",
      text: "What you'll have deposited and what the RD is worth at the end of every year.",
    },
    {
      title: "Instant results",
      text: "Everything updates as you type, so it's easy to try different amounts and tenures.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Nothing you type is sent anywhere.",
    },
  ],
  guide: [
    {
      heading: "How RD interest is calculated",
      paragraphs: [
        "In a recurring deposit you pay the same amount every month for a fixed term. Each instalment earns interest from the month it's paid, and banks and the post office compound that interest every quarter. So the first instalment earns interest for the whole term and the last one for just a month.",
        "The calculator adds up every instalment's value at maturity: P × (1 + r/4)^(4 × months left ÷ 12), where P is the monthly deposit and r the yearly rate ÷ 100. For example, ₹5,000 a month for 12 months at 7% gives about ₹62,311: ₹60,000 of deposits and about ₹2,311 of interest. Over 5 years, the same RD comes to about ₹3,59,664 from ₹3 lakh deposited.",
        "Banks round interest at each quarterly credit, so their figure can differ from this one by a few rupees.",
      ],
    },
    {
      heading: "Things to know before you open an RD",
      paragraphs: [
        "A recurring deposit is a simple way to build a habit of saving. A few things to keep in mind:",
      ],
      bullets: [
        "Tenures usually run from 6 months to 10 years, in multiples of 3 months. A post office RD runs for 5 years.",
        "Missing an instalment can mean a small penalty, and missing several can lead the bank to close the RD.",
        "Breaking an RD early usually means a lower rate than you were promised.",
        "RD interest is taxable at your slab rate, and banks deduct TDS on it in the same way as on fixed deposits.",
        "Senior citizens often get a slightly higher rate. Rates change often, so check the current rate with your bank or post office.",
      ],
    },
    {
      heading: "RD, FD or SIP?",
      paragraphs: [
        "An RD and an FD pay similar rates; the difference is how you put money in. An FD takes a lump sum at the start, while an RD takes a fixed amount every month, so an RD suits saving from your salary and an FD suits money you already have. The FD calculator shows what a lump sum would earn.",
        "If your goal is several years away and you can accept ups and downs, some people compare an RD with a monthly SIP in a mutual fund. A SIP may earn more over long periods but has no guaranteed return, while an RD's interest is fixed when you open it.",
      ],
    },
  ],
  faqs: [
    {
      question: "How is RD maturity calculated?",
      answer:
        "Each monthly instalment is compounded quarterly for the months it stays in the RD, and the results are added up. ₹5,000 a month for 12 months at 7% matures at about ₹62,311.",
    },
    {
      question: "Is RD interest compounded monthly or quarterly?",
      answer: "Quarterly at most Indian banks and at the post office, even though you deposit every month.",
    },
    {
      question: "What tenures can I choose for an RD?",
      answer:
        "Banks usually offer 6 months to 10 years, in steps of 3 months. The post office RD has a fixed 5-year term. Check which tenures your bank allows.",
    },
    {
      question: "Is TDS deducted on RD interest?",
      answer:
        "Yes. Banks treat RD interest like FD interest: it's taxable at your slab rate, and TDS is deducted once your total deposit interest from the bank crosses the yearly threshold.",
    },
    {
      question: "Why is my bank's maturity amount slightly different?",
      answer:
        "Banks round interest at each quarterly credit and may count days rather than months, so their figure can differ by a few rupees. The calculator uses the standard quarterly compounding formula.",
    },
  ],
};
