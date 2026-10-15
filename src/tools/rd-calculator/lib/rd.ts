import { clampInput } from "@/lib/finance";
import { roundTo } from "@/lib/utils";

/** Longest RD the calculator works out: 10 years, the usual maximum at banks. */
export const MAX_RD_MONTHS = 120;

export interface RdInput {
  /** The amount deposited every month. */
  monthly: number;
  /** Yearly interest rate as a percentage, e.g. 7. */
  annualRate: number;
  /** Tenure in months, e.g. 12. */
  months: number;
}

export interface RdYear {
  year: number;
  /** Months of this year inside the term: 12, except perhaps the last. */
  months: number;
  /** Everything deposited by the end of this year. */
  deposited: number;
  /** Interest earned by the end of this year. */
  interest: number;
  /** Deposits plus interest at the end of this year. */
  value: number;
}

export interface RdResult {
  monthly: number;
  annualRate: number;
  months: number;
  invested: number;
  interest: number;
  maturity: number;
  yearly: RdYear[];
}

/**
 * Value after `elapsed` months of an RD, the way Indian banks and the post office work it out:
 * interest compounds quarterly, and each monthly instalment grows for the months it has been in,
 * so instalment k is worth P × (1 + r/4)^(4 × months it has been in ÷ 12). The first instalment
 * has been in for all `elapsed` months, the latest for one.
 */
function rdValue(monthly: number, annualRate: number, elapsed: number): number {
  const quarterly = 1 + annualRate / 100 / 4;
  let value = 0;
  for (let monthsIn = 1; monthsIn <= elapsed; monthsIn++) {
    value += monthly * quarterly ** ((4 * monthsIn) / 12);
  }
  return value;
}

/** A recurring deposit's maturity, with quarterly compounding, and its value at the end of each year. */
export function calculateRd(input: RdInput): RdResult {
  const monthly = clampInput(input.monthly);
  const annualRate = clampInput(input.annualRate, 100);
  const months = monthly > 0 ? Math.round(clampInput(input.months, MAX_RD_MONTHS)) : 0;

  const yearly: RdYear[] = [];
  for (let year = 1; (year - 1) * 12 < months; year++) {
    const end = Math.min(year * 12, months);
    const value = rdValue(monthly, annualRate, end);
    yearly.push({
      year,
      months: end - (year - 1) * 12,
      deposited: roundTo(monthly * end, 2),
      interest: roundTo(value - monthly * end, 2),
      value: roundTo(value, 2),
    });
  }

  const maturity = rdValue(monthly, annualRate, months);
  const invested = monthly * months;
  return {
    monthly,
    annualRate,
    months,
    invested: roundTo(invested, 2),
    interest: roundTo(maturity - invested, 2),
    maturity: roundTo(maturity, 2),
    yearly,
  };
}
