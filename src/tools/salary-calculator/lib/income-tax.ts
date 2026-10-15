/**
 * Income tax on salary for tax year 2026-27 (April 2026 to March 2027), for a resident individual
 * under 60. Budget 2026 kept the slabs, rebate and surcharge introduced by Budget 2025.
 */

export type TaxRegime = "new" | "old";

interface Slab {
  /** Upper end of the slab; the last one is open-ended. */
  upTo: number;
  /** Percentage. */
  rate: number;
}

const LAKH = 100000;
const CRORE = 100 * LAKH;

const SLABS: Record<TaxRegime, Slab[]> = {
  new: [
    { upTo: 4 * LAKH, rate: 0 },
    { upTo: 8 * LAKH, rate: 5 },
    { upTo: 12 * LAKH, rate: 10 },
    { upTo: 16 * LAKH, rate: 15 },
    { upTo: 20 * LAKH, rate: 20 },
    { upTo: 24 * LAKH, rate: 25 },
    { upTo: Infinity, rate: 30 },
  ],
  old: [
    { upTo: 2.5 * LAKH, rate: 0 },
    { upTo: 5 * LAKH, rate: 5 },
    { upTo: 10 * LAKH, rate: 20 },
    { upTo: Infinity, rate: 30 },
  ],
};

/** Deducted from salary before tax in each regime. */
export const STANDARD_DEDUCTION: Record<TaxRegime, number> = { new: 75000, old: 50000 };

/** Taxable income up to this pays no tax, thanks to the rebate. */
export const REBATE_LIMIT: Record<TaxRegime, number> = { new: 12 * LAKH, old: 5 * LAKH };

/** Surcharge on the tax above each income level. The new regime stops at 25%. */
const SURCHARGE: Record<TaxRegime, { over: number; rate: number }[]> = {
  new: [
    { over: 50 * LAKH, rate: 10 },
    { over: 1 * CRORE, rate: 15 },
    { over: 2 * CRORE, rate: 25 },
  ],
  old: [
    { over: 50 * LAKH, rate: 10 },
    { over: 1 * CRORE, rate: 15 },
    { over: 2 * CRORE, rate: 25 },
    { over: 5 * CRORE, rate: 37 },
  ],
};

/** Health and education cess, on tax plus surcharge. */
export const CESS_RATE = 4;

/** Tax on the slabs alone, before any rebate, surcharge or cess. */
export function slabTax(income: number, regime: TaxRegime): number {
  let tax = 0;
  let from = 0;
  for (const slab of SLABS[regime]) {
    if (income <= from) break;
    tax += ((Math.min(income, slab.upTo) - from) * slab.rate) / 100;
    from = slab.upTo;
  }
  return tax;
}

/**
 * Slab tax after the rebate. Up to the rebate limit there's no tax. In the new regime, marginal
 * relief means the tax just above ₹12 lakh can't be more than the income above ₹12 lakh.
 */
function taxAfterRebate(income: number, regime: TaxRegime): number {
  const limit = REBATE_LIMIT[regime];
  if (income <= limit) return 0;
  const tax = slabTax(income, regime);
  return regime === "new" ? Math.min(tax, income - limit) : tax;
}

/**
 * Surcharge, with marginal relief: crossing a threshold can't cost more in tax and surcharge than
 * the income above it, so tax + surcharge is capped at (tax + surcharge at the threshold) plus the
 * income above the threshold.
 */
function surchargeOn(income: number, tax: number, regime: TaxRegime): number {
  const brackets = SURCHARGE[regime];
  const index = brackets.findLastIndex((bracket) => income > bracket.over);
  if (index < 0) return 0;
  const { over, rate } = brackets[index];
  const previousRate = index > 0 ? brackets[index - 1].rate : 0;
  const atThreshold = taxAfterRebate(over, regime) * (1 + previousRate / 100);
  const withSurcharge = tax * (1 + rate / 100);
  return Math.max(Math.min(withSurcharge, atThreshold + (income - over)) - tax, 0);
}

export interface IncomeTax {
  taxableIncome: number;
  /** Tax on the slabs. */
  slabTax: number;
  /** Rebate and marginal relief taken off the slab tax. */
  rebate: number;
  surcharge: number;
  cess: number;
  /** What's payable for the year, rounded to the rupee. */
  total: number;
}

/** Income tax on a year's taxable income (after deductions) in one regime. */
export function incomeTax(taxableIncome: number, regime: TaxRegime): IncomeTax {
  const income = Number.isFinite(taxableIncome) ? Math.max(taxableIncome, 0) : 0;
  const onSlabs = slabTax(income, regime);
  const tax = taxAfterRebate(income, regime);
  const surcharge = surchargeOn(income, tax, regime);
  const cess = ((tax + surcharge) * CESS_RATE) / 100;
  return {
    taxableIncome: Math.round(income),
    slabTax: Math.round(onSlabs),
    rebate: Math.round(onSlabs - tax),
    surcharge: Math.round(surcharge),
    cess: Math.round(cess),
    total: Math.round(tax + surcharge + cess),
  };
}
