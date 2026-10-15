import { clampInput } from "@/lib/finance";
import { roundTo } from "@/lib/utils";

/** Longest period the calculator projects: 100 years. */
export const MAX_CI_YEARS = 100;

export type CompoundFrequency = "yearly" | "half-yearly" | "quarterly" | "monthly" | "daily";

/** How many times a year interest is added. */
export const COMPOUNDS_PER_YEAR: Record<CompoundFrequency, number> = {
  yearly: 1,
  "half-yearly": 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

/** An optional regular top-up, added at the end of each month or year. */
export type DepositFrequency = "none" | "monthly" | "yearly";

const DEPOSITS_PER_YEAR: Record<Exclude<DepositFrequency, "none">, number> = { monthly: 12, yearly: 1 };

export interface CompoundInput {
  principal: number;
  /** Yearly interest rate as a percentage, e.g. 8. */
  annualRate: number;
  /** Can include a part year, e.g. 2.5. */
  years: number;
  compounding: CompoundFrequency;
  depositFrequency: DepositFrequency;
  /** Added each month or year, depending on `depositFrequency`. */
  deposit: number;
}

export interface CompoundPoint {
  /** Whole years, or the final part year. */
  years: number;
  /** Principal plus every deposit made so far. */
  putIn: number;
  /** All interest earned so far. */
  interest: number;
  balance: number;
}

export interface CompoundResult {
  principal: number;
  annualRate: number;
  years: number;
  /** Total of the regular deposits. */
  deposits: number;
  interest: number;
  balance: number;
  /** For comparison: interest at the same rate without compounding. */
  simpleInterest: number;
  /** Balance at the end of each year (and at the end, if that's part-way through a year). */
  yearly: CompoundPoint[];
}

interface Normalised {
  principal: number;
  rate: number;
  perYear: number;
  deposit: number;
  depositsPerYear: number;
}

/**
 * Value at time t (in years). The principal grows as P × (1 + r/n)^(n·t). Each deposit is made at
 * the end of its month or year and then grows at the same rate, so a deposit period's effective
 * rate is (1 + r/n)^(n/m) − 1 for m deposits a year. A deposit due after t isn't counted yet.
 */
function valueAt(input: Normalised, t: number) {
  const { principal, rate, perYear, deposit, depositsPerYear } = input;
  const growth = (years: number) => (1 + rate / perYear) ** (perYear * years);
  const principalValue = principal * growth(t);
  if (depositsPerYear === 0 || deposit === 0) return { value: principalValue, deposited: 0 };

  const count = Math.floor(t * depositsPerYear + 1e-9);
  let depositValue = 0;
  for (let k = 1; k <= count; k++) depositValue += deposit * growth(t - k / depositsPerYear);
  return { value: principalValue + depositValue, deposited: deposit * count };
}

/** Simple interest: the principal and each deposit earn rate × time, with no interest on interest. */
function simpleInterestAt(input: Normalised, t: number): number {
  const { principal, rate, deposit, depositsPerYear } = input;
  let interest = principal * rate * t;
  const count = depositsPerYear > 0 ? Math.floor(t * depositsPerYear + 1e-9) : 0;
  for (let k = 1; k <= count; k++) interest += deposit * rate * (t - k / depositsPerYear);
  return interest;
}

/** Compound interest on a lump sum, with optional regular deposits, year by year. */
export function calculateCompoundInterest(input: CompoundInput): CompoundResult {
  const principal = clampInput(input.principal);
  const annualRate = clampInput(input.annualRate, 100);
  const years = roundTo(clampInput(input.years, MAX_CI_YEARS), 4);
  const deposit = input.depositFrequency === "none" ? 0 : clampInput(input.deposit);
  const normalised: Normalised = {
    principal,
    rate: annualRate / 100,
    perYear: COMPOUNDS_PER_YEAR[input.compounding],
    deposit,
    depositsPerYear: input.depositFrequency === "none" ? 0 : DEPOSITS_PER_YEAR[input.depositFrequency],
  };

  const point = (t: number): CompoundPoint => {
    const { value, deposited } = valueAt(normalised, t);
    return {
      years: t,
      putIn: roundTo(principal + deposited, 2),
      interest: roundTo(value - principal - deposited, 2),
      balance: roundTo(value, 2),
    };
  };

  const hasMoney = principal > 0 || deposit > 0;
  const yearly: CompoundPoint[] = [];
  if (hasMoney) {
    for (let year = 1; year <= Math.floor(years); year++) yearly.push(point(year));
    if (years % 1 > 0) yearly.push(point(years));
  }

  const end = hasMoney ? point(years) : { putIn: 0, interest: 0, balance: 0 };
  return {
    principal,
    annualRate,
    years,
    deposits: roundTo(end.putIn - principal, 2),
    interest: end.interest,
    balance: end.balance,
    simpleInterest: hasMoney ? roundTo(simpleInterestAt(normalised, years), 2) : 0,
    yearly,
  };
}
