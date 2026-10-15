import { clampInput } from "@/lib/finance";
import { roundTo } from "@/lib/utils";

/** Longest SIP the calculator projects: 50 years. */
export const MAX_SIP_YEARS = 50;

export interface SipInput {
  /** The monthly instalment in the first year. */
  monthly: number;
  /** Expected yearly return as a percentage, e.g. 12. */
  annualReturn: number;
  years: number;
  /** Optional rise in the instalment every year, as a percentage, e.g. 10. */
  stepUp?: number;
}

export interface SipYear {
  year: number;
  /** The instalment paid each month during this year. */
  monthly: number;
  /** Everything put in up to the end of this year. */
  invested: number;
  /** Estimated value at the end of this year. */
  value: number;
  /** Value minus invested. */
  returns: number;
}

export interface SipResult {
  invested: number;
  returns: number;
  value: number;
  /** Whole months simulated (years × 12, rounded). */
  months: number;
  yearly: SipYear[];
}

/**
 * Closed-form value of a level SIP, the convention most SIP calculators use: each instalment is
 * invested at the start of the month and grows at the monthly rate i = annual ÷ 12 ÷ 100.
 * FV = P × ((1 + i)^n − 1) ÷ i × (1 + i). At 0% it's simply P × n.
 */
export function sipFutureValue(monthly: number, annualReturn: number, months: number): number {
  const i = annualReturn / 12 / 100;
  if (i === 0) return monthly * months;
  return ((monthly * ((1 + i) ** months - 1)) / i) * (1 + i);
}

/**
 * Projects a SIP month by month: each month the instalment is added and the whole balance grows at
 * the monthly rate. With a step-up, the instalment rises by that percentage at the start of every
 * year after the first. Without one, this matches sipFutureValue() exactly.
 */
export function calculateSip(input: SipInput): SipResult {
  const monthly = clampInput(input.monthly);
  const annualReturn = clampInput(input.annualReturn, 100);
  const stepUp = clampInput(input.stepUp ?? 0, 100);
  const months = Math.round(clampInput(input.years, MAX_SIP_YEARS) * 12);
  const i = annualReturn / 12 / 100;

  const yearly: SipYear[] = [];
  let value = 0;
  let invested = 0;
  let instalment = monthly;
  for (let month = 1; month <= months && monthly > 0; month++) {
    if (month > 1 && (month - 1) % 12 === 0) instalment *= 1 + stepUp / 100;
    invested += instalment;
    value = (value + instalment) * (1 + i);
    if (month % 12 === 0 || month === months) {
      yearly.push({
        year: Math.ceil(month / 12),
        monthly: roundTo(instalment, 2),
        invested: roundTo(invested, 2),
        value: roundTo(value, 2),
        returns: roundTo(value - invested, 2),
      });
    }
  }

  return {
    invested: roundTo(invested, 2),
    returns: roundTo(value - invested, 2),
    value: roundTo(value, 2),
    months: monthly > 0 ? months : 0,
    yearly,
  };
}
