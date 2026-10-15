import { clampInput } from "@/lib/finance";
import { roundTo } from "@/lib/utils";

/** The least you must deposit in a financial year to keep a PPF account active. */
export const PPF_MIN_DEPOSIT = 500;
/** The most that can go into PPF in a financial year (and earn interest). */
export const PPF_MAX_DEPOSIT = 150000;
/**
 * The rate for October-December 2026. The government reviews it every quarter; it has stayed at
 * 7.1% for many quarters in a row.
 */
export const PPF_DEFAULT_RATE = 7.1;
/** The account matures after 15 full financial years. */
export const PPF_TERM_YEARS = 15;
/** After maturity, the account can be extended in blocks of 5 years. */
export const PPF_EXTENSION_YEARS = 5;
/** Tenures offered: 15 years, then extended 5 years at a time. */
export const PPF_TENURES = [15, 20, 25, 30, 35, 40] as const;

export interface PpfInput {
  /** Deposited each financial year. */
  yearlyDeposit: number;
  /** Interest rate as a percentage, e.g. 7.1. */
  annualRate: number;
  years: number;
}

export interface PpfYear {
  year: number;
  deposit: number;
  interest: number;
  /** Balance at the end of the year, after interest. */
  closing: number;
  /** All deposits so far. */
  totalDeposits: number;
}

export interface PpfResult {
  /** The deposit used in the maths, after applying the yearly maximum. */
  yearlyDeposit: number;
  /** True when the deposit entered was over the yearly maximum and has been capped. */
  capped: boolean;
  /** True when a deposit was entered but is under the yearly minimum. */
  belowMinimum: boolean;
  annualRate: number;
  years: number;
  invested: number;
  interest: number;
  maturity: number;
  yearly: PpfYear[];
}

/**
 * PPF maturity, assuming the same deposit is made at the start of each financial year (by 5 April,
 * so it earns interest for the whole year) and interest is credited once a year at the end of it:
 * closing balance = (opening balance + deposit) × (1 + rate). Deposits above the yearly maximum
 * earn no interest, so they're capped.
 */
export function calculatePpf(input: PpfInput): PpfResult {
  const entered = clampInput(input.yearlyDeposit);
  const yearlyDeposit = Math.min(entered, PPF_MAX_DEPOSIT);
  const annualRate = clampInput(input.annualRate, 100);
  const years = yearlyDeposit > 0 ? Math.round(clampInput(input.years, 50)) : 0;
  const rate = annualRate / 100;

  const yearly: PpfYear[] = [];
  let balance = 0;
  for (let year = 1; year <= years; year++) {
    const interest = (balance + yearlyDeposit) * rate;
    balance += yearlyDeposit + interest;
    yearly.push({
      year,
      deposit: yearlyDeposit,
      interest: roundTo(interest, 2),
      closing: roundTo(balance, 2),
      totalDeposits: yearlyDeposit * year,
    });
  }

  const invested = yearlyDeposit * years;
  return {
    yearlyDeposit,
    capped: entered > PPF_MAX_DEPOSIT,
    belowMinimum: entered > 0 && entered < PPF_MIN_DEPOSIT,
    annualRate,
    years,
    invested,
    interest: roundTo(balance - invested, 2),
    maturity: roundTo(balance, 2),
    yearly,
  };
}
