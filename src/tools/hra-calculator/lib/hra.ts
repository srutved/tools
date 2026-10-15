import { roundTo } from "@/lib/utils";

/** Tax years the calculator knows the HRA rules for, newest first. */
export const HRA_TAX_YEARS = [
  { id: "2026-27", label: "FY 2026-27" },
  { id: "2025-26", label: "FY 2025-26" },
] as const;

export type HraTaxYear = (typeof HRA_TAX_YEARS)[number]["id"];
export const DEFAULT_HRA_TAX_YEAR: HraTaxYear = "2026-27";

export const HRA_CITIES = [
  { id: "delhi", label: "Delhi" },
  { id: "mumbai", label: "Mumbai" },
  { id: "kolkata", label: "Kolkata" },
  { id: "chennai", label: "Chennai" },
  { id: "bengaluru", label: "Bengaluru" },
  { id: "hyderabad", label: "Hyderabad" },
  { id: "pune", label: "Pune" },
  { id: "ahmedabad", label: "Ahmedabad" },
  { id: "other", label: "Other city" },
] as const;

export type HraCity = (typeof HRA_CITIES)[number]["id"];

/** The four metros that have always qualified for the 50% limit. */
const ORIGINAL_METROS: readonly HraCity[] = ["delhi", "mumbai", "kolkata", "chennai"];
/**
 * Added by the Income-tax Rules, 2026, from 1 April 2026 (FY 2026-27). Only the cities themselves:
 * satellite cities such as Gurugram, Noida, Navi Mumbai and Thane are not included.
 */
const NEW_METROS: readonly HraCity[] = ["bengaluru", "hyderabad", "pune", "ahmedabad"];

/** The cities that count as metros for HRA in a tax year. */
export function metroCities(taxYear: HraTaxYear): readonly HraCity[] {
  return taxYear === "2025-26" ? ORIGINAL_METROS : [...ORIGINAL_METROS, ...NEW_METROS];
}

/** Whether the 50% limit applies. An unchosen city ("") is treated as a non-metro. */
export function isMetro(city: HraCity | "", taxYear: HraTaxYear): boolean {
  return city !== "" && metroCities(taxYear).includes(city);
}

/** True for Bengaluru, Hyderabad, Pune and Ahmedabad: metros from FY 2026-27 but not before. */
export const becameMetroIn2026 = (city: HraCity | "") => city !== "" && NEW_METROS.includes(city);

export const cityLabel = (city: HraCity | "") => HRA_CITIES.find((option) => option.id === city)?.label ?? "";

export interface HraInput {
  /** Basic salary plus dearness allowance (DA) that counts for retirement benefits. */
  basic: number;
  /** House rent allowance paid by the employer. */
  hraReceived: number;
  rentPaid: number;
  city: HraCity | "";
  taxYear: HraTaxYear;
}

export type HraLimit = "actualHra" | "rentOverTenPercent" | "percentOfBasic";

export interface HraResult {
  metro: boolean;
  /** 50 in a metro, otherwise 40. */
  basicPercent: 50 | 40;
  /** The three amounts the exemption is the least of. */
  limits: Record<HraLimit, number>;
  /** Which of the three is the lowest (the first one listed, if two are equal). */
  least: HraLimit;
  /** Tax-free HRA. */
  exempt: number;
  /** The rest of the HRA, added to taxable salary. */
  taxable: number;
}

const positive = (value: number) => (Number.isFinite(value) ? Math.max(value, 0) : 0);

/**
 * The tax-free part of HRA under the old regime: the least of
 * (a) the HRA actually received,
 * (b) rent paid minus 10% of basic + DA (never below 0), and
 * (c) 50% of basic + DA in a metro city, or 40% elsewhere.
 * Amounts can be for any period (a month or a year), as long as they're all for the same one.
 */
export function calculateHraExemption(input: HraInput): HraResult {
  const basic = positive(input.basic);
  const hraReceived = positive(input.hraReceived);
  const rentPaid = positive(input.rentPaid);
  const metro = isMetro(input.city, input.taxYear);
  const basicPercent = metro ? 50 : 40;

  const limits: Record<HraLimit, number> = {
    actualHra: roundTo(hraReceived, 2),
    rentOverTenPercent: roundTo(Math.max(rentPaid - basic * 0.1, 0), 2),
    percentOfBasic: roundTo((basic * basicPercent) / 100, 2),
  };
  const order: HraLimit[] = ["actualHra", "rentOverTenPercent", "percentOfBasic"];
  const least = order.reduce((lowest, key) => (limits[key] < limits[lowest] ? key : lowest), order[0]);
  const exempt = limits[least];
  return {
    metro,
    basicPercent,
    limits,
    least,
    exempt,
    taxable: roundTo(Math.max(limits.actualHra - exempt, 0), 2),
  };
}
