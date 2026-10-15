import type { ToolContent } from "@/components/tool/tool-content";

export const PPF_CALCULATOR_CONTENT: ToolContent = {
  metaTitle: "PPF Calculator - Public Provident Fund Maturity at 7.1%, Year by Year",
  metaDescription:
    "Free PPF calculator for India. See your Public Provident Fund maturity value at the current 7.1% rate over 15 years or with 5-year extensions, with a year-by-year table of deposits, interest and balance.",
  heading: "Free PPF Calculator",
  intro:
    "Enter how much you'll put into your Public Provident Fund each year to see what it could grow to over 15 years, or longer with 5-year extensions. The rate starts at the current 7.1%, and you can change it to see other rates.",
  howItWorks: [
    {
      title: "Enter your yearly deposit",
      text: "Anything from ₹500 to ₹1,50,000 each financial year.",
    },
    {
      title: "Check the rate and term",
      text: "7.1% is filled in. Choose 15 years, or extend in blocks of 5 years.",
    },
    {
      title: "See it grow",
      text: "The maturity value, total interest and a year-by-year table of deposits, interest and balance.",
    },
  ],
  features: [
    {
      title: "Current PPF rate",
      text: "Starts at 7.1%, the rate for October to December 2026. Change it to try other rates.",
    },
    {
      title: "Extensions included",
      text: "See 15, 20, 25 years or more, extending the account 5 years at a time.",
    },
    {
      title: "Deposit limits checked",
      text: "Flags a deposit under the ₹500 minimum or over the ₹1,50,000 yearly limit, and explains why.",
    },
    {
      title: "Year by year",
      text: "Each year's deposit, interest and closing balance, the way it appears in your passbook.",
    },
    {
      title: "Deposits vs interest",
      text: "A clear split of how much you put in and how much is tax-free interest.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Nothing you type is sent anywhere.",
    },
  ],
  guide: [
    {
      heading: "How PPF interest is calculated",
      paragraphs: [
        "The Public Provident Fund (PPF) is a government-backed savings scheme you can open at a post office or bank. The government sets the interest rate every quarter. It's 7.1% a year for October to December 2026, the same as for many quarters before, but it can change, so the calculator lets you edit it.",
        "Interest is worked out every month on the lowest balance between the 5th and the end of the month, and credited once a year at the end of March. So a deposit made by 5 April earns interest for the whole financial year. The calculator assumes you deposit the same amount by 5 April every year, which gives: closing balance = (opening balance + deposit) × (1 + rate).",
        "Depositing the full ₹1,50,000 every year for 15 years at 7.1% puts in ₹22.5 lakh and grows to about ₹40.68 lakh, of which about ₹18.18 lakh is interest. Extending for 5 more years with deposits takes it to about ₹66.58 lakh, and 10 more years to just over ₹1 crore: compounding does most of its work in the later years.",
      ],
    },
    {
      heading: "PPF rules in brief",
      paragraphs: [
        "A few rules worth knowing. Check the latest scheme rules with your bank or post office, as they can change:",
      ],
      bullets: [
        "Deposit at least ₹500 and at most ₹1,50,000 each financial year. The limit covers your own account and any account you hold for a minor child together. Amounts above it earn no interest.",
        "The account matures after 15 full financial years. You can then close it, or extend it in blocks of 5 years, with or without fresh deposits.",
        "Partial withdrawals are allowed from the seventh financial year, up to a limit based on your earlier balance.",
        "You can take a loan against your PPF balance from the third to the sixth financial year.",
        "Closing the account early is only allowed after five years, for specific reasons such as serious illness or higher education, and with a small cut in the interest rate.",
        "If you miss the minimum deposit, the account becomes inactive until you pay the missed amount plus a small penalty.",
      ],
    },
    {
      heading: "Tax benefits, and PPF vs SIP or FD",
      paragraphs: [
        "PPF has EEE (exempt, exempt, exempt) status: your deposits can be claimed as a deduction under the old tax regime, and both the interest and the maturity amount are tax-free under either regime. That makes its 7.1% worth more than the same rate on a fixed deposit, whose interest is taxed at your slab rate.",
        "The trade-off is the long lock-in. PPF suits long-term, low-risk goals such as retirement or a child's education. Some people pair it with a mutual fund SIP, which can earn more over long periods but with no guarantee, or keep shorter-term savings in FDs and RDs. Our SIP and FD calculators help you compare.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the current PPF interest rate?",
      answer:
        "7.1% a year for October to December 2026, unchanged for many quarters. The government reviews it every quarter, so check the latest rate with your bank or post office. You can type any rate into the calculator.",
    },
    {
      question: "How much will I get if I invest ₹1.5 lakh a year in PPF for 15 years?",
      answer:
        "At 7.1%, depositing ₹1,50,000 by 5 April every year for 15 years grows to about ₹40.68 lakh: ₹22.5 lakh of deposits and about ₹18.18 lakh of tax-free interest. If the rate changes, the result will too.",
    },
    {
      question: "What are the minimum and maximum PPF deposits?",
      answer:
        "At least ₹500 and at most ₹1,50,000 in each financial year. You can pay in one go or in instalments. Deposits above the limit earn no interest.",
    },
    {
      question: "When should I deposit in PPF to earn the most interest?",
      answer:
        "By 5 April. Interest each month is based on the lowest balance between the 5th and the end of the month, so a deposit made by the 5th of April earns interest for the whole year.",
    },
    {
      question: "Can I withdraw from PPF before 15 years?",
      answer:
        "Partly. Partial withdrawals are allowed from the seventh financial year, and you can take a loan against the balance from the third to the sixth year. Closing the account early is only allowed after five years, for specific reasons, with a small interest penalty.",
    },
    {
      question: "Can I extend my PPF account after 15 years?",
      answer:
        "Yes, in blocks of 5 years, with or without fresh deposits. Choose 20, 25 or more years in the calculator to see what continuing to deposit could add.",
    },
  ],
};
