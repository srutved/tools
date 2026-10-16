import type { ToolContent } from "@/components/tool/tool-content";

export const EMI_CALCULATOR_CONTENT: ToolContent = {
  metaTitle: "EMI Calculator - Home, Car & Personal Loan EMI",
  metaDescription:
    "Free EMI calculator for India. Work out the monthly EMI, total interest and total payment for a home, car or personal loan, with an amortisation schedule.",
  heading: "Free EMI Calculator",
  intro:
    "Enter the loan amount, interest rate and tenure to see your monthly EMI, the total interest you'll pay and how each EMI splits between principal and interest. Works for home, car, personal and education loans, with the full repayment schedule year by year or month by month.",
  howItWorks: [
    {
      title: "Enter the loan",
      text: "The amount you want to borrow, the yearly interest rate and the tenure in years or months. Or start from a typical example.",
    },
    {
      title: "See the EMI",
      text: "Your monthly EMI, the total interest and the total you'll repay, updated as you type.",
    },
    {
      title: "Check the schedule",
      text: "See how much of each year's (or month's) EMIs goes to interest and principal, and what's left to repay.",
    },
  ],
  features: [
    {
      title: "Any loan",
      text: "Home, car, personal, education or business loans: anything repaid in equal monthly instalments.",
    },
    {
      title: "Total interest at a glance",
      text: "See the principal and the interest side by side, so you know the real cost of the loan.",
    },
    {
      title: "Amortisation schedule",
      text: "Principal, interest and balance for every year of the loan, or switch to month by month.",
    },
    {
      title: "Years or months",
      text: "Enter the tenure either way. Switching converts what you've typed, so nothing is lost.",
    },
    {
      title: "Typical examples",
      text: "One click fills in a typical rate and tenure for a home, car, personal or education loan to get you started.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Nothing you type is sent anywhere.",
    },
  ],
  guide: [
    {
      heading: "How EMI is calculated",
      paragraphs: [
        "An EMI (equated monthly instalment) is the fixed amount you pay every month until a loan is repaid. Banks in India work it out on a reducing balance: each month you pay interest only on the loan that's still outstanding, and the rest of the EMI repays principal.",
        "The formula is EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate (the yearly rate ÷ 12 ÷ 100) and n is the number of monthly instalments. For example, a home loan of ₹50 lakh at 8.5% a year for 20 years (240 months) has an EMI of about ₹43,391. Over the 20 years you'd repay about ₹1.04 crore, of which around ₹54 lakh is interest.",
        "At the start of a long loan most of each EMI is interest, because the outstanding balance is large. In the first year of that ₹50 lakh loan, about ₹4.2 lakh of the ₹5.2 lakh you pay is interest and only about ₹1 lakh reduces the loan. As the balance falls, the split slowly reverses, which you can see in the repayment schedule.",
      ],
    },
    {
      heading: "What changes your EMI and total interest",
      paragraphs: [
        "Three things decide the EMI: the amount, the rate and the tenure. A longer tenure lowers the EMI but raises the total interest, often by a lot. Stretching the same ₹50 lakh loan at 8.5% from 20 to 25 years lowers the EMI by about ₹3,100 a month, but adds around ₹16.6 lakh of interest.",
        "Even a small change in rate matters on a big loan. At 9% instead of 8.5%, the ₹50 lakh loan over 20 years costs about ₹1,600 more a month and nearly ₹4 lakh more in interest. Some other ways to bring the cost down:",
      ],
      bullets: [
        "Make a bigger down payment, so you borrow less.",
        "Prepay part of the loan when you can. Early prepayments save the most interest, because they cut the balance that interest is charged on. Many lenders allow free part-prepayment on floating-rate loans, but check your loan terms.",
        "Compare offers, including the processing fee and other charges, not just the headline rate.",
        "If your income rises, consider a shorter tenure or a higher EMI rather than leaving the loan to run its full term.",
      ],
    },
    {
      heading: "Fixed and floating rates",
      paragraphs: [
        "Most home loans in India have a floating rate linked to an external benchmark, such as the RBI repo rate. When the benchmark changes, your rate changes too, and the lender usually adjusts the tenure first and the EMI only if needed. Car and personal loans more often have a fixed rate for the whole term.",
        "This calculator assumes the rate stays the same for the whole loan. With a floating rate, treat the result as a guide and rerun it when your rate changes. The loan examples here are typical figures to get started, not offers: the rate you're offered depends on the lender, your credit score and the loan itself.",
        "Borrowing isn't the only way to use this maths. If you're saving towards a goal instead, the FD, RD and SIP calculators show the other side: interest working for you rather than against you.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I calculate the EMI on a loan?",
      answer:
        "Use EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), with P the loan amount, r the yearly rate ÷ 12 ÷ 100 and n the number of months. For ₹10 lakh at 10% for 7 years (84 months), the EMI is about ₹16,601. The calculator does this for you and shows the schedule too.",
    },
    {
      question: "How much interest will I pay on my loan?",
      answer:
        "Total interest is the EMI × the number of months, minus the loan amount. A ₹5 lakh personal loan at 12% for 3 years has an EMI of about ₹16,607, so you repay about ₹5.98 lakh in all, of which roughly ₹98,000 is interest.",
    },
    {
      question: "Is a longer tenure better?",
      answer:
        "It lowers the EMI, which can make a loan easier to manage, but you pay interest for longer, so the total cost rises. Choose the shortest tenure whose EMI you can comfortably afford, and prepay when you can.",
    },
    {
      question: "Why is so much of my early EMI interest?",
      answer:
        "Interest is charged on the outstanding balance, which is highest at the start. So early EMIs are mostly interest and later ones mostly principal. The year-by-year schedule shows exactly how the split changes.",
    },
    {
      question: "Will my bank's EMI match this calculator?",
      answer:
        "It should be very close. Lenders may round the EMI to the rupee, and the first EMI can differ if the loan is paid out part-way through a month (the extra days' interest is called pre-EMI or broken-period interest). Fees and insurance aren't included.",
    },
    {
      question: "Are the loan examples real offers?",
      answer:
        "No. They're typical rates and tenures to get you started. Rates change over time and depend on the lender and on you, so check the actual rate and charges with your bank or lender.",
    },
  ],
};
