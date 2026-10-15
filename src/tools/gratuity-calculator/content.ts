import type { ToolContent } from "@/components/tool/tool-content";

export const GRATUITY_CALCULATOR_CONTENT: ToolContent = {
  metaTitle: "Gratuity Calculator India - New Labour Code Rules, 50% Wages and Fixed-Term Staff",
  metaDescription:
    "Free gratuity calculator under the Code on Social Security. Enter your dates and salary to see your gratuity, the years counted, the 50% wages rule, the one-year rule for fixed-term staff and how much is tax-free.",
  heading: "Free Gratuity Calculator",
  intro:
    "Work out the gratuity you're owed when you leave a job. Enter your dates of joining and leaving and your last salary, and see the amount, the years of service that count and how much of it is tax-free, under the labour codes in force from 21 November 2025.",
  howItWorks: [
    {
      title: "Enter your dates",
      text: "Your date of joining and last working day. The length of service is worked out for you.",
    },
    {
      title: "Add your salary",
      text: "Your last monthly basic + DA, and your total pay if you'd like the 50% wages rule checked.",
    },
    {
      title: "See your gratuity",
      text: "The amount, the formula with your numbers in it, and the tax-free and taxable parts.",
    },
  ],
  features: [
    {
      title: "New labour code rules",
      text: "Uses the Code on Social Security, 2020, including the rule that wages are at least half of total pay.",
    },
    {
      title: "Fixed-term employees",
      text: "Fixed-term staff qualify after one year instead of five, with gratuity paid pro rata.",
    },
    {
      title: "Service worked out from dates",
      text: "Counts years, months and days, and rounds a final part-year of more than six months up to a full year.",
    },
    {
      title: "Covered or not covered",
      text: "Switch between the 15/26 formula for covered employers and the 15/30 convention for smaller ones.",
    },
    {
      title: "Tax-free part shown",
      text: "See how much falls within the ₹20 lakh tax-free limit and how much would be taxed.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Your salary details never leave your device.",
    },
  ],
  guide: [
    {
      heading: "How gratuity is calculated",
      paragraphs: [
        "Gratuity is a lump sum your employer pays when you leave after long enough service, as a thank-you for the years you put in. For an employer covered by the gratuity law, it's 15 days' wages for every year of service, with a month taken as 26 working days:",
        "Gratuity = monthly wages × 15 × years of service ÷ 26",
        "So someone whose last basic + DA was ₹50,000 a month and who served 7 years 7 months gets ₹50,000 × 15 × 8 ÷ 26 = ₹2,30,769. The 7 months count as a full year because they're more than six months. With 7 years 5 months, only 7 years would count.",
        "Employers not covered by the law don't have to pay gratuity, but many do under their own policy. The usual basis is half a month's wages for each completed year (wages × 15 × years ÷ 30), with part-years left out.",
      ],
    },
    {
      heading: "What changed with the labour codes",
      paragraphs: [
        "The Code on Social Security, 2020 replaced the Payment of Gratuity Act, 1972 from 21 November 2025. The basic formula is the same, but two changes matter to most people:",
      ],
      bullets: [
        "Wages are at least half of your pay. Wages mean basic pay, dearness allowance (DA) and any retaining allowance. If your other allowances come to more than 50% of your total pay, the excess is added back to wages. So a low basic with large allowances no longer shrinks your gratuity.",
        "Fixed-term employees qualify after one year. Someone on a fixed-term contract gets gratuity pro rata once they've served a year, rather than waiting five years like permanent staff.",
        "The five-year condition still applies to permanent employees, except when employment ends because of death or disablement. In those cases gratuity is paid whatever the length of service, to the employee or their nominee.",
      ],
    },
    {
      heading: "Gratuity and income tax",
      paragraphs: [
        "For private-sector employees, gratuity is tax-free up to ₹20 lakh in total over your working life. Anything above that is added to your income for the year and taxed at your slab rate. If you've received tax-free gratuity from an earlier employer, that uses up part of the ₹20 lakh. For central and state government employees, gratuity is fully tax-free.",
        "Separately, the law only requires an employer to pay up to ₹20 lakh in gratuity. Some employers pay more under their own schemes, and that extra is taxable.",
      ],
    },
  ],
  faqs: [
    {
      question: "Who is eligible for gratuity?",
      answer:
        "Permanent employees who leave, retire or resign after at least five years of continuous service with an employer covered by the law. Fixed-term employees qualify after one year. The five-year rule doesn't apply if employment ends because of death or disablement.",
    },
    {
      question: "Does 4 years and 7 months count as 5 years?",
      answer:
        "For working out the amount, a final part-year of more than six months counts as a full year. But to be eligible at all, permanent employees need five years of continuous service. Some courts have treated 4 years and 240 days worked in the fifth year as five years, so if you're just short, ask your employer or an adviser.",
    },
    {
      question: "Which salary is used for gratuity?",
      answer:
        "Your last drawn monthly wages: basic pay plus dearness allowance (DA) and any retaining allowance. Under the labour codes, if your allowances are more than half of your total pay, the excess counts as wages too, so wages are never less than half of your total pay.",
    },
    {
      question: "Is gratuity part of my CTC?",
      answer:
        "Often, yes. Many employers include about 4.81% of basic in the CTC for gratuity (15 ÷ 26 ÷ 12). It isn't paid monthly: you receive it as a lump sum when you leave after becoming eligible.",
    },
    {
      question: "How much gratuity is tax-free?",
      answer:
        "Up to ₹20 lakh in total over your working life for private-sector employees, and all of it for government employees. Anything above ₹20 lakh is taxed as part of your income for the year.",
    },
    {
      question: "When must my employer pay gratuity?",
      answer:
        "Within 30 days of it becoming payable, usually your last working day. If it's paid late, the employer owes simple interest on it. If your employer refuses to pay, you can approach the authority appointed under the labour codes for your area. This calculator is an estimate, not legal advice, so check the exact figure with your employer.",
    },
  ],
};
