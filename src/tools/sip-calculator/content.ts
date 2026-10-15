import type { ToolContent } from "@/components/tool/tool-content";

export const SIP_CALCULATOR_CONTENT: ToolContent = {
  metaTitle: "SIP Calculator - Mutual Fund SIP Returns with Step-Up, Year by Year",
  metaDescription:
    "Free SIP calculator for India. See what a monthly SIP could grow to at an expected return, with an optional yearly step-up, the amount invested versus estimated returns and a year-by-year table.",
  heading: "Free SIP Calculator",
  intro:
    "Enter how much you plan to invest each month, an expected yearly return and for how long, and see what your SIP could be worth. Add a yearly step-up to see the effect of raising your SIP as your income grows. The figures are an illustration, not a promise: mutual fund returns go up and down.",
  howItWorks: [
    {
      title: "Enter your SIP",
      text: "The monthly amount, the yearly return you want to assume and the number of years.",
    },
    {
      title: "Add a step-up",
      text: "Optional: raise the SIP by a percentage every year, for example in line with pay rises.",
    },
    {
      title: "See how it could grow",
      text: "The amount invested, estimated returns and estimated value, with a year-by-year table.",
    },
  ],
  features: [
    {
      title: "Standard SIP maths",
      text: "Uses the same start-of-month convention as most SIP calculators, so you can compare like with like.",
    },
    {
      title: "Step-up SIP",
      text: "See how raising your instalment a little each year changes the final value.",
    },
    {
      title: "Invested vs returns",
      text: "A clear split between what you put in and what it could earn, shown as a bar and in figures.",
    },
    {
      title: "Year by year",
      text: "What you'll have invested and what it could be worth at the end of every year.",
    },
    {
      title: "Honest about risk",
      text: "Results are an illustration at the return you choose. Try a lower return too, to see a cautious case.",
    },
    {
      title: "Private by design",
      text: "Everything runs in your browser. Nothing you type is sent anywhere.",
    },
  ],
  guide: [
    {
      heading: "How the SIP calculator works",
      paragraphs: [
        "A SIP (systematic investment plan) is a way to invest a fixed amount in a mutual fund every month. Each instalment buys units at that day's price, so you buy more units when prices are low and fewer when they're high.",
        "To project a SIP, the calculator assumes a steady yearly return and turns it into a monthly rate (the yearly rate ÷ 12). Each instalment is treated as invested at the start of the month and grows for every month left. Without a step-up this is the standard formula FV = P × ((1 + i)^n − 1) ÷ i × (1 + i), where P is the monthly amount, i the monthly rate and n the number of months.",
        "For example, ₹10,000 a month for 10 years at an assumed 12% a year means ₹12 lakh invested and an estimated value of about ₹23.2 lakh. At an assumed 8%, the same SIP comes to about ₹18.4 lakh. That gap is why it's worth trying more than one return.",
      ],
    },
    {
      heading: "Returns are not guaranteed",
      paragraphs: [
        "Mutual fund investments are subject to market risk. Real returns are never a steady 12% a year: some years are much better, some are negative, and the order they come in affects what you end up with. Equity funds in particular can fall sharply in the short term.",
        "So treat the result as an illustration of how regular investing and compounding work, not a forecast. Read the scheme documents, look at the fund's costs (the expense ratio) and any exit load, and remember that tax on gains isn't included here. If you're unsure which fund suits your goals and risk, speak to a SEBI-registered investment adviser.",
      ],
    },
    {
      heading: "Step-up SIP, and SIP vs PPF, FD or RD",
      paragraphs: [
        "A step-up (or top-up) SIP raises your instalment every year by a set percentage. It's a simple way to keep investing in line with a rising salary. In the example above, raising the ₹10,000 SIP by 10% each year means investing about ₹19.1 lakh over 10 years, and an estimated value of about ₹33.7 lakh at an assumed 12%.",
        "A SIP is different from saving in a PPF account, a fixed deposit or a recurring deposit. Those pay a set or government-declared rate, so you know roughly what you'll get, while a SIP in an equity fund can earn more over long periods but with no guarantee. Many people use both: safe savings for near-term goals and an emergency fund, and SIPs for long-term goals. The PPF and RD calculators help you compare.",
      ],
    },
  ],
  faqs: [
    {
      question: "How is SIP return calculated?",
      answer:
        "The calculator compounds each monthly instalment at the expected return ÷ 12 for every month it stays invested, assuming you invest at the start of each month. Real funds don't grow at a steady rate, so your actual value will differ.",
    },
    {
      question: "What return should I assume?",
      answer:
        "There's no right answer, because future returns are unknown. It's sensible to try a few: a cautious figure, a middle one and a hopeful one. A lower assumed return shows you what happens if markets disappoint.",
    },
    {
      question: "What does ₹10,000 a month in a SIP become in 10 years?",
      answer:
        "At an assumed 12% a year, about ₹23.2 lakh from ₹12 lakh invested. At 8%, about ₹18.4 lakh. These are illustrations, not promises: the real figure depends on how the markets do.",
    },
    {
      question: "What is a step-up SIP?",
      answer:
        "A SIP whose instalment rises every year by a fixed percentage, such as 10%. Many fund houses let you set this up when you start. Enter the percentage in the step-up field to see its effect.",
    },
    {
      question: "Is SIP better than PPF or an FD?",
      answer:
        "They do different jobs. PPF and FDs give predictable returns with little risk; a SIP in an equity fund may earn more over long periods but can also lose value. The right mix depends on your goals, timeline and comfort with risk.",
    },
    {
      question: "Are taxes and charges included?",
      answer:
        "No. The result doesn't include the fund's expense ratio (already reflected in a fund's actual returns), exit loads or tax on gains when you sell. Check the scheme documents and current tax rules.",
    },
  ],
};
