import type { ToolContent } from "@/components/tool/tool-content";

export const COMPOUND_INTEREST_CALCULATOR_CONTENT: ToolContent = {
  metaTitle: "Compound Interest Calculator - With Deposits",
  metaDescription:
    "Free compound interest calculator. See how money grows with yearly, quarterly, monthly or daily compounding, regular deposits and a year-by-year table.",
  heading: "Free Compound Interest Calculator",
  intro:
    "Enter an amount, an interest rate and a time period to see how your money grows when interest earns interest. Choose how often it's compounded, add a regular monthly or yearly deposit if you like, and compare the result with simple interest.",
  howItWorks: [
    {
      title: "Enter the amount and rate",
      text: "What you start with, the yearly interest rate and how many years, including part years.",
    },
    {
      title: "Choose the compounding",
      text: "Yearly, half-yearly, quarterly, monthly or daily, and add a regular deposit if you want.",
    },
    {
      title: "See it grow",
      text: "The final balance, interest earned, the simple interest comparison and a year-by-year table.",
    },
  ],
  features: [
    {
      title: "Any compounding frequency",
      text: "Yearly, half-yearly, quarterly, monthly or daily, to match a bank deposit, a loan or a textbook problem.",
    },
    {
      title: "Regular deposits",
      text: "Add the same amount every month or year and see how it builds on top of the lump sum.",
    },
    {
      title: "Simple vs compound",
      text: "See how much more compounding earns than simple interest at the same rate.",
    },
    {
      title: "Year by year",
      text: "What you've put in, the interest so far and the balance at the end of every year.",
    },
    {
      title: "Part years",
      text: "Enter 2.5 years or any other period, not just whole years.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Nothing you type is sent anywhere.",
    },
  ],
  guide: [
    {
      heading: "The compound interest formula",
      paragraphs: [
        "With compound interest, the interest you earn is added to your balance and then earns interest itself. The formula is A = P × (1 + r/n)^(n × t), where A is the final amount, P the principal, r the yearly rate ÷ 100, n how many times a year interest is compounded and t the number of years. The compound interest is A − P.",
        "For example, ₹1 lakh at 8% a year compounded yearly grows to about ₹2,15,892 in 10 years, so you earn about ₹1,15,892 in interest. With simple interest, where interest is paid only on the original ₹1 lakh, you'd earn ₹80,000. Leave it for 20 years and it grows to about ₹4.66 lakh; for 30 years, just over ₹10 lakh. The longer the time, the bigger compounding's lead.",
        "Regular deposits work the same way. The calculator adds each deposit at the end of its month or year, and from then on it grows at the same rate as the rest of your balance.",
      ],
    },
    {
      heading: "How often interest is compounded",
      paragraphs: [
        "The more often interest is compounded, the more you earn, because interest starts earning interest sooner. At 8% on ₹1 lakh for 10 years, yearly compounding gives about ₹2,15,892, quarterly about ₹2,20,804, monthly about ₹2,21,964 and daily about ₹2,22,535. The jump from yearly to quarterly is noticeable; beyond monthly, the extra is small.",
        "In India, bank fixed deposits are usually compounded quarterly, recurring deposits quarterly too, and PPF interest is credited yearly. Our FD, RD and PPF calculators use the right method for each, so use them for those products, and this calculator for anything else.",
      ],
    },
    {
      heading: "The rule of 72",
      paragraphs: [
        "A quick way to estimate how long money takes to double: divide 72 by the yearly rate. At 8%, money doubles in about 9 years; at 6%, about 12 years; at 12%, about 6 years. It's an approximation, but a handy check on any result.",
        "The same maths works against you on debt. A loan or credit card balance that's left to grow compounds in the same way, which is why paying off high-interest debt early often beats saving at a lower rate. The EMI calculator shows how much interest a loan really costs.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I calculate compound interest?",
      answer:
        "Use A = P × (1 + r/n)^(n × t), then subtract P to get the interest. For ₹1 lakh at 8% compounded yearly for 10 years: 1,00,000 × 1.08^10 ≈ ₹2,15,892, so the interest is about ₹1,15,892.",
    },
    {
      question: "What's the difference between simple and compound interest?",
      answer:
        "Simple interest is paid only on the original amount. Compound interest is also paid on the interest already earned. Over 10 years at 8%, ₹1 lakh earns ₹80,000 with simple interest and about ₹1,15,892 with yearly compounding.",
    },
    {
      question: "Is monthly compounding better than yearly?",
      answer:
        "For savings, yes, slightly: interest is added 12 times a year instead of once, so it starts earning sooner. At 8% for 10 years on ₹1 lakh, monthly compounding earns about ₹6,000 more than yearly.",
    },
    {
      question: "How are regular deposits treated?",
      answer:
        "Each deposit is added at the end of its month or year and then compounds at the same rate as the rest of the balance. Choose None to see the lump sum on its own.",
    },
    {
      question: "How long does it take to double my money?",
      answer:
        "Roughly 72 ÷ the yearly rate, in years: about 9 years at 8% or 6 years at 12%. The year-by-year table shows exactly when your balance passes double.",
    },
    {
      question: "Does this include tax?",
      answer:
        "No. Interest on most savings, such as FDs, is taxable, which reduces what you keep. The rate you enter is an example: check the actual rate and tax rules for your investment.",
    },
  ],
};
