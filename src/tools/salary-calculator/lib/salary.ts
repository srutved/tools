import { roundTo } from "@/lib/utils";
import { calculateHraExemption, type HraCity } from "@/tools/hra-calculator/lib/hra";
import { incomeTax, STANDARD_DEDUCTION, type IncomeTax, type TaxRegime } from "./income-tax";

/** "full": 12% of basic. "capped": 12% of basic up to the ₹15,000 wage ceiling (₹1,800 a month). */
export type PfOption = "full" | "capped" | "none";

export const PF_RATE = 12;
export const PF_MONTHLY_CAP = 1800;
/** Gratuity is 15 days' basic for each year of service: 15 ÷ 26 ÷ 12 ≈ 4.81% of basic. */
export const GRATUITY_RATE = 4.81;
/** Professional tax can't be more than ₹2,500 a year in any state. */
export const PROFESSIONAL_TAX_ANNUAL_CAP = 2500;
/** The yearly limit for PF, PPF, ELSS, life insurance and the like in the old regime. */
export const INVESTMENT_DEDUCTION_CAP = 150000;
/** HRA is worked out under the rules for this tax year. */
const TAX_YEAR = "2026-27";

export interface SalaryInput {
  /** Cost to company, a year. */
  ctc: number;
  /** Basic salary as a percentage of CTC. */
  basicPercent: number;
  /** HRA as a percentage of basic. */
  hraPercent: number;
  pf: PfOption;
  gratuityIncluded: boolean;
  /** Professional tax, a month. */
  professionalTax: number;
  regime: TaxRegime;
  /** Old regime only: rent paid a month, and the city, for the HRA exemption. */
  rent: number;
  city: HraCity | "";
  /** Old regime only: other deductions for the year (investments, health insurance...). */
  otherDeductions: number;
}

export interface RegimeTax extends IncomeTax {
  regime: TaxRegime;
  grossSalary: number;
  standardDeduction: number;
  /** Old regime only; 0 in the new regime. */
  hraExemption: number;
  professionalTax: number;
  /** Employee PF counted towards the ₹1,50,000 investment limit, plus other deductions. */
  otherDeductions: number;
}

export interface SalaryBreakdown {
  ctc: number;
  employerPf: number;
  gratuity: number;
  /** CTC minus employer PF and gratuity: what's paid as salary before deductions. */
  gross: number;
  /** Yearly salary components; they add up to the gross. */
  basic: number;
  hra: number;
  special: number;
  /** The HRA asked for didn't fit in the gross, so it was lowered. */
  hraReduced: boolean;
  /** Basic was more than the gross (with very high basic percentages), so it was lowered. */
  basicReduced: boolean;
  employeePf: number;
  /** Yearly, after the ₹2,500 cap. */
  professionalTax: number;
  /** The tax in each regime, so they can be compared. */
  taxes: Record<TaxRegime, RegimeTax>;
  /** The tax in the chosen regime. */
  tax: RegimeTax;
  /** Take-home pay for the year and for a month. */
  inHand: number;
  monthlyInHand: number;
}

const positive = (value: number) => (Number.isFinite(value) ? Math.max(value, 0) : 0);
const percent = (value: number) => Math.min(positive(value), 100);

/** Employee PF for a month; the employer pays the same amount as part of the CTC. */
export function monthlyPf(monthlyBasic: number, option: PfOption): number {
  if (option === "none") return 0;
  const full = (positive(monthlyBasic) * PF_RATE) / 100;
  return option === "capped" ? Math.min(full, PF_MONTHLY_CAP) : full;
}

function regimeTax(
  regime: TaxRegime,
  {
    gross,
    basic,
    hra,
    employeePf,
    professionalTax,
    input,
  }: {
    gross: number;
    basic: number;
    hra: number;
    employeePf: number;
    professionalTax: number;
    input: SalaryInput;
  },
): RegimeTax {
  const standardDeduction = Math.min(STANDARD_DEDUCTION[regime], gross);
  if (regime === "new") {
    const tax = incomeTax(gross - standardDeduction, "new");
    return {
      ...tax,
      regime,
      grossSalary: gross,
      standardDeduction,
      hraExemption: 0,
      professionalTax: 0,
      otherDeductions: 0,
    };
  }
  const hraExemption = calculateHraExemption({
    basic: basic / 12,
    hraReceived: hra / 12,
    rentPaid: positive(input.rent),
    city: input.city,
    taxYear: TAX_YEAR,
  }).exempt;
  const otherDeductions = Math.min(employeePf, INVESTMENT_DEDUCTION_CAP) + positive(input.otherDeductions);
  const taxable = gross - standardDeduction - hraExemption * 12 - professionalTax - otherDeductions;
  const tax = incomeTax(taxable, "old");
  return {
    ...tax,
    regime,
    grossSalary: gross,
    standardDeduction,
    hraExemption: roundTo(hraExemption * 12, 2),
    professionalTax,
    otherDeductions: roundTo(otherDeductions, 2),
  };
}

/**
 * CTC to in-hand salary. Employer PF and (optionally) gratuity come out of the CTC to give the
 * gross; basic and HRA are set as percentages and the special allowance is whatever is left.
 * Employee PF, professional tax and income tax then come out of the gross to give the in-hand pay.
 */
export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  const ctc = positive(input.ctc);
  const requestedBasic = (ctc * percent(input.basicPercent)) / 100;
  const employeePf = monthlyPf(requestedBasic / 12, input.pf) * 12;
  const employerPf = employeePf;
  const gratuity = input.gratuityIncluded ? (requestedBasic * GRATUITY_RATE) / 100 : 0;
  const gross = Math.max(ctc - employerPf - gratuity, 0);

  const basic = Math.min(requestedBasic, gross);
  const requestedHra = (basic * percent(input.hraPercent)) / 100;
  const hra = Math.min(requestedHra, gross - basic);
  const special = Math.max(gross - basic - hra, 0);

  const professionalTax = Math.min(positive(input.professionalTax) * 12, PROFESSIONAL_TAX_ANNUAL_CAP);
  const context = { gross, basic, hra, employeePf, professionalTax, input };
  const taxes = { new: regimeTax("new", context), old: regimeTax("old", context) };
  const tax = taxes[input.regime];
  const inHand = Math.max(gross - employeePf - professionalTax - tax.total, 0);

  return {
    ctc: roundTo(ctc, 2),
    employerPf: roundTo(employerPf, 2),
    gratuity: roundTo(gratuity, 2),
    gross: roundTo(gross, 2),
    basic: roundTo(basic, 2),
    hra: roundTo(hra, 2),
    special: roundTo(special, 2),
    hraReduced: requestedHra - hra > 0.005,
    basicReduced: requestedBasic - basic > 0.005,
    employeePf: roundTo(employeePf, 2),
    professionalTax: roundTo(professionalTax, 2),
    taxes,
    tax,
    inHand: roundTo(inHand, 2),
    monthlyInHand: roundTo(inHand / 12, 2),
  };
}

/** Which regime costs less in tax, and by how much a year. */
export function compareRegimes(taxes: Record<TaxRegime, RegimeTax>): {
  cheaper: TaxRegime | null;
  saving: number;
} {
  const difference = taxes.old.total - taxes.new.total;
  if (difference === 0) return { cheaper: null, saving: 0 };
  return { cheaper: difference > 0 ? "new" : "old", saving: Math.abs(difference) };
}

/** Monthly figures, rounded to rupees, for opening a salary slip with this salary. */
export function salarySlipQuery(breakdown: SalaryBreakdown): string {
  const monthly = (value: number) => String(Math.round(value / 12));
  return new URLSearchParams({
    basic: monthly(breakdown.basic),
    hra: monthly(breakdown.hra),
    special: monthly(breakdown.special),
    pf: monthly(breakdown.employeePf),
    pt: monthly(breakdown.professionalTax),
    tds: monthly(breakdown.tax.total),
  }).toString();
}
