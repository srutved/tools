import type { ToolContent } from "@/components/tool/tool-content";

export const SALARY_CALCULATOR_CONTENT: ToolContent = {
  metaTitle: "Salary Calculator: CTC to In-Hand - FY 2026-27",
  metaDescription:
    "Free CTC to in-hand salary calculator. See your take-home pay after PF, professional tax and income tax for FY 2026-27, and which tax regime saves more.",
  heading: "Free Salary Calculator: CTC to In-Hand",
  intro:
    "Enter your CTC and see what actually lands in your bank account each month, after provident fund, professional tax and income tax. Compare the new and old tax regimes, then turn the figures into a salary slip in one click.",
  howItWorks: [
    {
      title: "Enter your CTC",
      text: "The yearly cost to company from your offer letter, and how much of it is basic salary and HRA.",
    },
    {
      title: "Set PF and tax",
      text: "Choose how PF is worked out, your professional tax and your tax regime. Defaults suit most people.",
    },
    {
      title: "See your in-hand pay",
      text: "Monthly and yearly take-home pay, with every deduction and the salary structure laid out.",
    },
  ],
  features: [
    {
      title: "FY 2026-27 tax rules",
      text: "New regime slabs, the ₹12 lakh rebate with marginal relief, surcharge and 4% cess.",
    },
    {
      title: "New vs old regime",
      text: "Works out the tax both ways and tells you which one leaves you with more.",
    },
    {
      title: "PF your way",
      text: "12% of basic, 12% capped at ₹1,800 a month, or no PF at all, with gratuity if your CTC includes it.",
    },
    {
      title: "HRA exemption built in",
      text: "In the old regime, your rent and city are used to work out the tax-free part of your HRA.",
    },
    {
      title: "Straight to a payslip",
      text: "Open our salary slip generator with basic, HRA, special allowance, PF, professional tax and TDS filled in.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Your salary is never sent anywhere.",
    },
  ],
  guide: [
    {
      heading: "CTC, gross salary and in-hand salary",
      paragraphs: [
        "Your CTC (cost to company) is everything your employer spends on you in a year. Part of it never reaches your bank account each month: the employer's share of provident fund goes to your PF account, and gratuity, if it's included, is only paid when you leave after five or more years.",
        "Take those out and you have your gross salary: basic salary, house rent allowance (HRA) and a special allowance that makes up the rest. Your in-hand (take-home) salary is the gross minus your own PF contribution, professional tax and income tax deducted at source (TDS).",
      ],
    },
    {
      heading: "What's deducted from your salary",
      paragraphs: ["Three deductions turn your gross salary into what you take home:"],
      bullets: [
        "Employee's provident fund: 12% of basic salary, matched by your employer. Many employers cap it at ₹1,800 a month, which is 12% of the ₹15,000 wage ceiling.",
        "Professional tax: a small tax charged by some states, at most ₹2,500 a year. Some states, such as Delhi, don't charge it.",
        "Income tax (TDS): your employer estimates your tax for the year and deducts it in equal monthly amounts.",
      ],
    },
    {
      heading: "New or old tax regime?",
      paragraphs: [
        "The new regime is the default. For tax year 2026-27 its slabs run from nil up to ₹4 lakh, rising by 5% for every ₹4 lakh up to 30% above ₹24 lakh, with a ₹75,000 standard deduction. Thanks to the rebate, there's no tax at all if your taxable income is ₹12 lakh or less, which means a salary of up to ₹12.75 lakh.",
        "The old regime has higher rates (5% from ₹2.5 lakh, 20% from ₹5 lakh and 30% above ₹10 lakh) and a ₹50,000 standard deduction, but lets you claim the HRA exemption, professional tax and deductions for investments such as PF, PPF, ELSS and life insurance (up to ₹1,50,000 a year), health insurance and more. It usually only wins if you pay high rent and make full use of the deductions.",
        "You tell your employer which regime you want at the start of the year. This calculator works out both, so you can see the difference before you choose.",
      ],
    },
    {
      heading: "Why basic salary is usually 40-50% of CTC",
      paragraphs: [
        "Basic salary drives several other figures: PF is 12% of it, gratuity is 4.81% of it, and HRA is usually set as a share of it. A higher basic means more retirement savings but less in hand each month.",
        "Under the labour codes in force from November 2025, if allowances make up more than half of total pay, the excess is treated as wages for PF and gratuity. So most employers now set basic at around 50% of pay, and 40% to 50% of CTC is a sensible figure to use here if you don't know yours.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I calculate my in-hand salary from CTC?",
      answer:
        "Take the employer's PF and any gratuity out of your CTC to get your gross salary. Then subtract your own PF, professional tax and income tax. Divide by 12 for the monthly figure. The calculator does all of this as you type.",
    },
    {
      question: "How much in-hand salary will I get on a ₹12 lakh CTC?",
      answer:
        "With basic at 50% of CTC, PF capped at ₹1,800 a month and ₹200 a month professional tax, about ₹96,200 a month under the new regime. Your taxable income comes to about ₹11 lakh, so the rebate means no income tax at all.",
    },
    {
      question: "Is there no income tax up to ₹12 lakh?",
      answer:
        "Under the new regime, yes: if your taxable income is ₹12 lakh or less, a rebate cancels the tax. With the ₹75,000 standard deduction, that covers a salary of up to ₹12.75 lakh. Just above that, marginal relief means you never pay more in tax than the income above ₹12 lakh.",
    },
    {
      question: "Which is better for me, the new or old regime?",
      answer:
        "For most people, the new regime. The old regime can come out ahead if you pay high rent in a metro and claim large deductions, such as the full ₹1,50,000 for investments plus health insurance. Choose Old in the calculator and enter your rent and deductions to compare.",
    },
    {
      question: "Why is my employer's PF part of my CTC?",
      answer:
        "Because it's a cost your employer pays for you. It goes into your PF account rather than your bank account, so it's in your CTC but not your in-hand salary. You can withdraw it later, under the PF rules.",
    },
    {
      question: "Is the income tax figure exact?",
      answer:
        "It's an estimate for a resident under 60 whose only income is this salary. Your actual tax depends on other income, the exact deductions you claim and when in the year you join. Your employer's TDS may differ slightly.",
    },
  ],
};
