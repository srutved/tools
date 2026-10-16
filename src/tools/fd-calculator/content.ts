import type { ToolContent } from "@/components/tool/tool-content";

export const FD_CALCULATOR_CONTENT: ToolContent = {
  metaTitle: "FD Calculator - Fixed Deposit Maturity & Interest",
  metaDescription:
    "Free FD calculator for India. Work out fixed deposit maturity and interest with quarterly, monthly or yearly compounding or interest payouts, year by year.",
  heading: "Free FD Calculator",
  intro:
    "Enter your deposit, the bank's interest rate and the tenure to see the maturity amount and the interest you'll earn. Choose a cumulative FD, where interest is reinvested, or a monthly or quarterly payout, and see how the deposit grows year by year.",
  howItWorks: [
    {
      title: "Enter the deposit",
      text: "The amount, the yearly rate your bank offers and the tenure in years and months.",
    },
    {
      title: "Choose the payout",
      text: "Cumulative (interest reinvested and paid at maturity), or interest paid out every month or quarter.",
    },
    {
      title: "See what you'll get",
      text: "The maturity amount or the regular payout, total interest and a year-by-year table.",
    },
  ],
  features: [
    {
      title: "Compounded the way banks do",
      text: "Quarterly by default, as at most Indian banks, or monthly, half-yearly or yearly.",
    },
    {
      title: "Cumulative or payout",
      text: "See the maturity amount, or the interest paid to you each month or quarter.",
    },
    {
      title: "Years and months",
      text: "Enter any tenure, such as 2 years 6 months, not just whole years.",
    },
    {
      title: "Year by year",
      text: "Interest earned each year and the balance as it grows, with a simple chart.",
    },
    {
      title: "Deposit vs interest",
      text: "A clear split of what you put in and what the bank pays you.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Nothing you type is sent anywhere.",
    },
  ],
  guide: [
    {
      heading: "How FD interest is calculated",
      paragraphs: [
        "In a cumulative fixed deposit, interest is added to the deposit at regular intervals and then earns interest itself. Most Indian banks compound FD interest every quarter. The maturity amount is A = P × (1 + r/n)^(n × t), where P is the deposit, r the yearly rate ÷ 100, n the number of times interest is compounded a year (4 for quarterly) and t the tenure in years.",
        "For example, ₹1 lakh at 7% for 5 years, compounded quarterly, matures at about ₹1,41,478, so you earn about ₹41,478 in interest. Compounded yearly, it would be about ₹1,40,255: the more often interest is added, the more you earn, though the difference is small.",
        "With a monthly or quarterly payout FD, interest is paid into your account instead of being reinvested, so the deposit doesn't grow. A ₹5 lakh FD at 7% pays about ₹2,917 a month or ₹8,750 a quarter. Some banks pay slightly less for monthly payouts, because they discount the quarterly interest for paying it early. Payout FDs suit people who want a regular income, such as retirees.",
      ],
    },
    {
      heading: "Tax, TDS and senior citizen rates",
      paragraphs: [
        "FD interest is fully taxable and is added to your income at your slab rate, whether you take it as a payout or at maturity. Banks deduct TDS once the interest you earn from them in a year crosses a threshold (the threshold is higher for senior citizens). If your total income is below the taxable limit, you can give the bank a self-declaration so it doesn't deduct TDS. Any TDS deducted counts towards your tax when you file your return.",
        "Senior citizens usually get around 0.25% to 0.5% more than the standard rate. Tax-saver FDs, with a 5-year lock-in, can qualify for a deduction under the old tax regime. Rates vary by bank and tenure and change often, so check the current rate with your bank before you invest.",
      ],
    },
    {
      heading: "FD or RD?",
      paragraphs: [
        "An FD suits a lump sum you already have. If you'd rather save a fixed amount every month, a recurring deposit (RD) works the same way but with monthly instalments, and our RD calculator shows what it adds up to. For long-term goals where you can accept market ups and downs, some people also compare FDs with a PPF account or a mutual fund SIP.",
        "Bank deposits are insured by DICGC up to ₹5 lakh per depositor in each bank, including interest. Breaking an FD early usually means a lower rate than you were promised, so pick a tenure you're comfortable with.",
      ],
    },
  ],
  faqs: [
    {
      question: "How is FD maturity calculated?",
      answer:
        "Maturity = deposit × (1 + rate ÷ n)^(n × years), where n is how often interest is compounded each year: 4 for quarterly. ₹1 lakh at 7% for 5 years with quarterly compounding gives about ₹1,41,478.",
    },
    {
      question: "Do banks compound FD interest quarterly?",
      answer:
        "Most Indian banks do, for cumulative deposits. Some deposits, such as short FDs of under six months, pay simple interest at maturity. Check your bank's terms for the exact method.",
    },
    {
      question: "What's the difference between cumulative and payout FDs?",
      answer:
        "In a cumulative FD, interest is reinvested and paid with the deposit at maturity, so it compounds. In a payout FD, interest is paid to you every month or quarter and the deposit stays the same, so you earn a little less overall but get a regular income.",
    },
    {
      question: "Is TDS deducted on FD interest?",
      answer:
        "Yes, once your interest from a bank in a year crosses the TDS threshold, which is higher for senior citizens. If your income is below the taxable limit, you can submit a self-declaration to the bank to avoid TDS.",
    },
    {
      question: "Do senior citizens get a higher FD rate?",
      answer:
        "Usually yes, around 0.25% to 0.5% more than the regular rate, depending on the bank and tenure. Enter the senior citizen rate in the interest rate field to see the difference.",
    },
    {
      question: "Will my bank's figure match exactly?",
      answer:
        "It should be very close. Banks may round interest at each credit, count days differently or pay simple interest for part periods, so the final rupee or two can differ.",
    },
  ],
};
