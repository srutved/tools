import type { ToolContent } from "@/components/tool/tool-content";

export const SALARY_SLIP_GENERATOR_CONTENT: ToolContent = {
  metaTitle: "Free Salary Slip Generator - Payslip Format in PDF for Small Businesses",
  metaDescription:
    "Create professional salary slips free: earnings, deductions (PF, ESI, professional tax, TDS), net pay in words and your logo. Six payslip designs, instant PDF, no sign-up.",
  heading: "Free Salary Slip Generator",
  intro:
    "Make a clear, professional payslip in minutes: your company and logo, the employee's details, earnings beside deductions and net pay in words, ready to download as a PDF. Save it and next month's slip is one click away.",
  howItWorks: [
    {
      title: "Add company and employee",
      text: "Your company name, address and logo, and the employee's name, role, PAN and bank.",
    },
    {
      title: "Enter the salary",
      text: "Earnings and deductions with suggested components like HRA, PF and professional tax.",
    },
    {
      title: "Download the payslip",
      text: "A one-page PDF with totals and net pay in words. Duplicate it for next month.",
    },
  ],
  features: [
    {
      title: "Earnings beside deductions",
      text: "The standard payslip layout, with gross pay, total deductions and net pay worked out for you.",
    },
    {
      title: "Net pay in words",
      text: "Written out in Indian numbering for rupees, or in the currency you pay in.",
    },
    {
      title: "Loss of pay days",
      text: "Enter working and paid days and the slip shows any loss of pay automatically.",
    },
    {
      title: "Next month in one click",
      text: "Duplicate a slip and it moves to the next month with the same employee and pay.",
    },
    {
      title: "Six designs",
      text: "Classic boxed, modern and minimal payslips, with your logo on every one.",
    },
    {
      title: "Private by design",
      text: "Salary details stay in your browser. Nothing is uploaded to a server.",
    },
  ],
  guide: [
    {
      heading: "What a salary slip should include",
      paragraphs: ["A complete payslip lets the employee check their pay and use it as proof of income:"],
      bullets: [
        "The employer's name and address, and the month the salary is for",
        "The employee's name, ID, designation and, in India, their PAN and UAN",
        "Each earning: basic salary, HRA and other allowances, bonus or overtime",
        "Each deduction: provident fund, ESI, professional tax, income tax (TDS) and any recoveries",
        "Gross earnings, total deductions and net pay, in figures and words",
        "Working days, paid days and any loss of pay",
      ],
    },
    {
      heading: "Common salary components in India",
      paragraphs: [
        "Basic salary is the fixed core of the pay, and many employers keep it at around 40-50% of gross pay because provident fund and gratuity are worked out from it. House rent allowance (HRA) helps with rent and can be partly tax-free for employees under the old tax regime. A special allowance usually makes up the rest of the agreed salary.",
        "On the deductions side, the employee's provident fund contribution is 12% of basic pay (many employers cap it at ₹1,800 a month, 12% of ₹15,000). ESI applies to employees earning up to ₹21,000 a month. Professional tax is set by each state, at no more than ₹2,500 a year, and income tax is deducted at source (TDS) based on the employee's expected tax for the year.",
      ],
    },
    {
      heading: "Gross pay, net pay and CTC",
      paragraphs: [
        "Gross pay is the total of all earnings for the month. Net pay, or take-home pay, is what's left after deductions, and is the amount actually paid into the employee's bank account. Cost to company (CTC) is larger again: it also includes what the employer pays on top, such as their own PF contribution, gratuity and insurance.",
        "Employees use payslips to apply for loans, credit cards and visas, to file their income tax return and to prove their salary when changing jobs, so issue one every month, even to a single employee.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is this salary slip generator free?",
      answer:
        "Yes. Every design and PDF download is free, with no sign-up and no watermark. It's made by Srutved.",
    },
    {
      question: "Does a salary slip need a signature or stamp?",
      answer:
        "Not usually. A computer-generated payslip is accepted without a signature, and the slip says so. If a bank or embassy asks for one, print it and have it signed and stamped by the employer.",
    },
    {
      question: "Can I make payslips for several employees?",
      answer:
        "Yes. Each slip is saved separately on your device. Start a new slip for each employee, and duplicate an existing one to make the following month's.",
    },
    {
      question: "Does it calculate PF, ESI or income tax for me?",
      answer:
        "No. You enter each amount, so the slip matches exactly what your payroll paid. The totals, net pay and net pay in words are calculated for you.",
    },
    {
      question: "Can I use it outside India?",
      answer:
        "Yes. Choose your currency, rename the earnings and deductions to match local payroll, and leave India-specific fields such as PAN and UAN blank.",
    },
    {
      question: "Where are the salary details stored?",
      answer:
        "Only in your own browser, on your device. Nothing is uploaded to a server. Clearing your browser data removes the saved slips, so keep the PDFs.",
    },
  ],
};
