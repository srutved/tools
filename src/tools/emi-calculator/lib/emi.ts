import { clampInput } from "@/lib/finance";
import { roundTo } from "@/lib/utils";

/** Longest loan the calculator works out: 50 years. */
export const MAX_LOAN_MONTHS = 600;

export type LoanTypeId = "home" | "car" | "personal" | "education";

/**
 * Quick-fill examples for common loans. Typical figures only, to get started: actual rates depend on
 * the lender, the borrower's credit score and the loan, and change over time.
 */
export const LOAN_PRESETS: readonly { id: LoanTypeId; label: string; rate: number; years: number }[] = [
  { id: "home", label: "Home loan", rate: 8.5, years: 20 },
  { id: "car", label: "Car loan", rate: 9, years: 5 },
  { id: "personal", label: "Personal loan", rate: 12, years: 3 },
  { id: "education", label: "Education loan", rate: 10, years: 7 },
];

export interface EmiInput {
  /** The amount borrowed. */
  principal: number;
  /** Yearly interest rate as a percentage, e.g. 8.5. */
  annualRate: number;
  /** Loan tenure in months. */
  months: number;
}

export interface EmiMonth {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  /** Outstanding loan after this month's EMI. */
  balance: number;
}

export interface EmiYear {
  /** Loan year, counted from the first EMI (not the financial year). */
  year: number;
  /** Number of EMIs in this year: 12, except perhaps the last. */
  months: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface EmiResult {
  principal: number;
  annualRate: number;
  months: number;
  /** The monthly instalment, in rupees and paise. */
  emi: number;
  totalInterest: number;
  totalPayment: number;
  schedule: EmiMonth[];
  yearly: EmiYear[];
}

/**
 * The standard reducing-balance EMI: P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where r is the monthly
 * rate (annual rate ÷ 12 ÷ 100) and n the number of months. At 0% it's simply P ÷ n.
 */
export function emiFormula(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  const growth = (1 + r) ** months;
  return (principal * r * growth) / (growth - 1);
}

/**
 * EMI, totals and the amortisation schedule. Each month's interest is the monthly rate on the
 * balance still owed; the rest of the EMI repays principal. Figures are kept unrounded while
 * working, then rounded to paise; the last month absorbs any leftover so the balance ends at 0.
 */
export function calculateEmi(input: EmiInput): EmiResult {
  const principal = clampInput(input.principal);
  const annualRate = clampInput(input.annualRate, 100);
  const months = Math.round(clampInput(input.months, MAX_LOAN_MONTHS));
  const emi = emiFormula(principal, annualRate, months);
  const r = annualRate / 12 / 100;

  const schedule: EmiMonth[] = [];
  let balance = principal;
  for (let month = 1; month <= months && principal > 0; month++) {
    const interest = balance * r;
    const repaid = month === months ? balance : emi - interest;
    balance = month === months ? 0 : balance - repaid;
    schedule.push({
      month,
      emi: roundTo(repaid + interest, 2),
      principal: roundTo(repaid, 2),
      interest: roundTo(interest, 2),
      balance: roundTo(Math.max(balance, 0), 2),
    });
  }

  const yearly: EmiYear[] = [];
  for (const row of schedule) {
    const year = Math.ceil(row.month / 12);
    let current = yearly[year - 1];
    if (!current) {
      current = { year, months: 0, principal: 0, interest: 0, balance: 0 };
      yearly.push(current);
    }
    current.months += 1;
    current.principal = roundTo(current.principal + row.principal, 2);
    current.interest = roundTo(current.interest + row.interest, 2);
    current.balance = row.balance;
  }

  const totalPayment = roundTo(emi * months, 2);
  return {
    principal,
    annualRate,
    months,
    emi: roundTo(emi, 2),
    totalInterest: roundTo(Math.max(totalPayment - principal, 0), 2),
    totalPayment,
    schedule,
    yearly,
  };
}
