import type { ToolContent } from "@/components/tool/tool-content";

export const PF_CALCULATOR_CONTENT: ToolContent = {
  metaTitle: "PF Calculator - EPF Balance at Retirement (8.25%)",
  metaDescription:
    "Free EPF calculator. See your provident fund balance at retirement with employee and employer contributions, the EPS pension split and 8.25% interest.",
  heading: "Free PF Calculator",
  intro:
    "See how much your Employees' Provident Fund (EPF) could grow to by the time you retire. Enter your age, basic salary and current balance to see your contributions, your employer's, the interest and the balance year by year, at the EPFO rate of 8.25% for FY 2025-26.",
  howItWorks: [
    {
      title: "Enter your age and salary",
      text: "Your age, when you plan to retire, your monthly basic + DA and how fast you expect it to grow.",
    },
    {
      title: "Set up your PF",
      text: "PF on your full basic or the ₹15,000 ceiling, any voluntary PF, and your balance today.",
    },
    {
      title: "See your balance at retirement",
      text: "What you'll have, where it came from, and how the balance builds up each year.",
    },
  ],
  features: [
    {
      title: "Current EPF rate",
      text: "Starts at 8.25%, the rate for FY 2025-26, and you can change it to see other scenarios.",
    },
    {
      title: "Employer share split correctly",
      text: "Takes the pension (EPS) part out of your employer's 12%, so only what reaches your EPF account is counted.",
    },
    {
      title: "Full basic or wage ceiling",
      text: "Works for PF on your whole basic + DA, or on the ₹15,000 ceiling of ₹1,800 a month.",
    },
    {
      title: "Voluntary PF",
      text: "Add VPF on top of the 12% and see how much more you'd have at retirement.",
    },
    {
      title: "Year by year",
      text: "A table of your salary, contributions, interest and balance for every year until you retire.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Your salary and balance never leave your device.",
    },
  ],
  guide: [
    {
      heading: "How EPF works",
      paragraphs: [
        "The Employees' Provident Fund is a retirement savings account run by the Employees' Provident Fund Organisation (EPFO). Every month, 12% of your basic pay plus dearness allowance (DA) is deducted from your salary and paid in, and your employer adds a matching 12%. The money earns interest at a rate the EPFO declares each year, and you can withdraw it when you retire or in certain situations before that.",
        "Many employers work out PF on the full basic + DA. Others use the ₹15,000 wage ceiling, which limits both contributions to ₹1,800 a month. If your basic is more than ₹15,000, your payslip will show which one applies.",
      ],
    },
    {
      heading: "Where your employer's 12% goes",
      paragraphs: ["Your own 12% all goes into your EPF account. Your employer's 12% is split in two:"],
      bullets: [
        "8.33% of your basic + DA, on at most ₹15,000, goes to the Employees' Pension Scheme (EPS). That's at most ₹1,250 a month. It doesn't build a balance you can withdraw: it pays a monthly pension from age 58 once you have 10 years of service.",
        "The rest, 3.67% plus anything above the ₹1,250, goes into your EPF account. On a basic of ₹50,000, that's ₹6,000 − ₹1,250 = ₹4,750 a month.",
        "EPS contributions stop at 58. If you work beyond that, all of your employer's 12% goes to EPF.",
      ],
    },
    {
      heading: "EPF and income tax",
      paragraphs: [
        "In the old tax regime, your own PF contributions count towards the ₹1.5 lakh yearly deduction for investments. There's no such deduction in the new regime.",
        "Interest is tax-free on your own contributions of up to ₹2.5 lakh a year. If you put in more, for example through VPF, the interest on the excess is taxable each year. The limit is ₹5 lakh a year if your employer doesn't contribute. Your employer's contributions to EPF, NPS and superannuation together are tax-free up to ₹7.5 lakh a year.",
        "Withdrawals are tax-free once you've completed five years of continuous service, counting earlier jobs whose PF you transferred. Withdraw before that and the amount can be taxed, with tax deducted at source on larger sums.",
      ],
    },
    {
      heading: "Withdrawals and your UAN",
      paragraphs: [
        "Your Universal Account Number (UAN) is a 12-digit number from the EPFO that stays the same for your whole career. Each new employer links your new PF account to it, so you can transfer your old balance, check your passbook and make claims online on the EPFO member portal or the UMANG app, once your UAN is linked to your Aadhaar, PAN and bank account.",
        "You can withdraw your full balance when you retire, or after a period without a job, and make partial withdrawals for things such as education, marriage, illness or buying a home. These rules have changed recently, so check the current conditions on the member portal before you apply.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the EPF interest rate for 2025-26?",
      answer:
        "8.25% a year, declared by the EPFO and approved by the government in June 2026. The rate is set every year, so the calculator lets you change it. It was also 8.25% for 2024-25 and 2023-24.",
    },
    {
      question: "How is EPF interest calculated?",
      answer:
        "Every month, interest is worked out at a twelfth of the yearly rate on the balance at the start of the month, and the total for the year is credited to your account once the rate is declared. So each month's contribution starts earning from the following month, and interest compounds once a year.",
    },
    {
      question: "Why is my employer's PF share less than mine in my passbook?",
      answer:
        "Because up to ₹1,250 a month of your employer's 12% goes to the pension scheme (EPS) instead. Your passbook shows the EPS amount separately. It gives you a monthly pension later rather than adding to your EPF balance.",
    },
    {
      question: "What is voluntary PF (VPF)?",
      answer:
        "Extra you choose to contribute to EPF on top of the 12%, up to 100% of your basic + DA. It earns the same interest, but your employer doesn't match it. Ask your HR or payroll team to start it. Interest on your contributions above ₹2.5 lakh a year is taxable.",
    },
    {
      question: "I joined after September 2014 with a high salary. Am I in EPS?",
      answer:
        "If you first joined EPF after 1 September 2014 with basic + DA above ₹15,000 a month, you aren't a member of EPS. Your employer's whole 12% then goes to EPF, so your balance will be higher than this calculator shows. Your passbook will show no pension contribution.",
    },
    {
      question: "Is the result exact?",
      answer:
        "No, it's an estimate that assumes steady pay rises, contributions every month and the same interest rate every year, with no withdrawals. It isn't financial advice. For your actual balance, check your passbook on the EPFO member portal or ask your employer.",
    },
  ],
};
