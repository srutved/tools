import { clampInput } from "@/lib/finance";
import { roundTo } from "@/lib/utils";

/** Longest deposit the calculator works out: 30 years (most banks offer up to 10). */
export const MAX_FD_MONTHS = 360;

export type Compounding = "monthly" | "quarterly" | "half-yearly" | "yearly";

/** How many times a year interest is added to the deposit. */
export const COMPOUNDINGS_PER_YEAR: Record<Compounding, number> = {
  monthly: 12,
  quarterly: 4,
  "half-yearly": 2,
  yearly: 1,
};

/** "cumulative": interest is added to the deposit and paid at maturity. Otherwise it's paid out regularly. */
export type FdPayout = "cumulative" | "monthly" | "quarterly";

const PAYOUTS_PER_YEAR: Record<Exclude<FdPayout, "cumulative">, number> = { monthly: 12, quarterly: 4 };

export interface FdInput {
  principal: number;
  /** Yearly interest rate as a percentage, e.g. 7. */
  annualRate: number;
  /** Tenure in months, e.g. 30 for 2 years 6 months. */
  months: number;
  compounding: Compounding;
  payout: FdPayout;
}

export interface FdYear {
  year: number;
  /** Months of this year inside the term: 12, except perhaps the last. */
  months: number;
  /** Interest earned (or paid out) during this year. */
  interest: number;
  /** All interest so far. */
  totalInterest: number;
  /** Deposit plus interest so far (cumulative); just the deposit for a payout FD. */
  balance: number;
}

export interface FdResult {
  principal: number;
  annualRate: number;
  months: number;
  payout: FdPayout;
  /** Interest over the whole term. */
  totalInterest: number;
  /** What you get back at the end: deposit plus interest (cumulative), or the deposit (payout). */
  maturity: number;
  /** Interest paid each month or quarter for a payout FD; 0 for a cumulative one. */
  periodicPayout: number;
  yearly: FdYear[];
}

/** A = P × (1 + r/n)^(n × t): the value of a cumulative deposit after t years, compounded n times a year. */
export function fdValue(
  principal: number,
  annualRate: number,
  years: number,
  compounding: Compounding,
): number {
  const n = COMPOUNDINGS_PER_YEAR[compounding];
  return principal * (1 + annualRate / 100 / n) ** (n * years);
}

/**
 * A fixed deposit's interest and maturity.
 * Cumulative: interest is compounded into the deposit and paid at maturity, A = P(1 + r/n)^(n·t);
 * a term that isn't a whole number of compounding periods uses the same formula with a fractional
 * power. Payout: interest is simple, P × r ÷ 12 a month or P × r ÷ 4 a quarter, and the deposit
 * itself is returned at maturity.
 */
export function calculateFd(input: FdInput): FdResult {
  const principal = clampInput(input.principal);
  const annualRate = clampInput(input.annualRate, 100);
  const months = Math.round(clampInput(input.months, MAX_FD_MONTHS));
  const rate = annualRate / 100;
  const payout = input.payout;

  const balanceAfter = (elapsedMonths: number) =>
    payout === "cumulative"
      ? fdValue(principal, annualRate, elapsedMonths / 12, input.compounding)
      : principal;
  const interestAfter = (elapsedMonths: number) =>
    payout === "cumulative"
      ? balanceAfter(elapsedMonths) - principal
      : (principal * rate * elapsedMonths) / 12;

  const yearly: FdYear[] = [];
  if (principal > 0) {
    for (let year = 1; (year - 1) * 12 < months; year++) {
      const end = Math.min(year * 12, months);
      const start = (year - 1) * 12;
      yearly.push({
        year,
        months: end - start,
        interest: roundTo(interestAfter(end) - interestAfter(start), 2),
        totalInterest: roundTo(interestAfter(end), 2),
        balance: roundTo(balanceAfter(end), 2),
      });
    }
  }

  const totalInterest = principal > 0 ? roundTo(interestAfter(months), 2) : 0;
  return {
    principal,
    annualRate,
    months,
    payout,
    totalInterest,
    maturity: payout === "cumulative" ? roundTo(principal + totalInterest, 2) : principal,
    periodicPayout: payout === "cumulative" ? 0 : roundTo((principal * rate) / PAYOUTS_PER_YEAR[payout], 2),
    yearly,
  };
}
