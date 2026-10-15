import { roundTo } from "@/lib/utils";

/**
 * Gratuity under the Code on Social Security, 2020 (in force from 21 November 2025), which
 * replaced the Payment of Gratuity Act, 1972 with the same formula and adds fixed-term employees.
 */

/** Permanent staff need five years of continuous service; fixed-term staff need one, and are paid pro rata. */
export type EmploymentType = "permanent" | "fixed-term";

export const MINIMUM_YEARS: Record<EmploymentType, number> = { permanent: 5, "fixed-term": 1 };

/** The most an employer has to pay by law, and the most that's tax-free for a private-sector employee. */
export const GRATUITY_CAP = 2000000;

/** 15 days' wages for each year of service. */
export const DAYS_PER_YEAR = 15;
/** Covered employers: a month's wages ÷ 26 working days. Others, by convention: ÷ 30 calendar days. */
export const COVERED_DIVISOR = 26;
export const NOT_COVERED_DIVISOR = 30;

export interface Service {
  years: number;
  months: number;
  days: number;
}

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseDate(iso: string): { year: number; month: number; day: number } | null {
  const match = DATE_PATTERN.exec(iso);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  // Rejects impossible dates such as 2026-02-30, which Date would roll into March.
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null;
  }
  return { year, month, day };
}

const daysInMonth = (year: number, month: number) => new Date(Date.UTC(year, month, 0)).getUTCDate();

/**
 * Completed years, months and days from the date of joining to the last working day. Both days
 * count as service, so 1 April 2021 to 31 March 2026 is exactly five years. Null if either date is
 * missing or invalid, or the last day is before the first.
 */
export function serviceBetween(joining: string, leaving: string): Service | null {
  const start = parseDate(joining);
  const last = parseDate(leaving);
  if (!start || !last) return null;
  if (Date.UTC(last.year, last.month - 1, last.day) < Date.UTC(start.year, start.month - 1, start.day)) {
    return null;
  }
  // Count up to the day after the last working day, so the last day itself is included.
  const endDate = new Date(Date.UTC(last.year, last.month - 1, last.day + 1));
  const end = { year: endDate.getUTCFullYear(), month: endDate.getUTCMonth() + 1, day: endDate.getUTCDate() };

  let years = end.year - start.year;
  let months = end.month - start.month;
  let days = end.day - start.day;
  if (days < 0) {
    months -= 1;
    // Borrow the length of the month before the end month.
    const borrowYear = end.month === 1 ? end.year - 1 : end.year;
    const borrowMonth = end.month === 1 ? 12 : end.month - 1;
    days += daysInMonth(borrowYear, borrowMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

/**
 * Years of service the gratuity is paid for. With a covered employer, a final part-year of more
 * than six months counts as a full year (7 years 7 months → 8; 7 years 5 months → 7; exactly
 * 7 years 6 months → 7). Otherwise only completed years count.
 */
export function yearsCounted(service: Service, covered: boolean): number {
  const moreThanSixMonths = service.months > 6 || (service.months === 6 && service.days > 0);
  return covered && moreThanSixMonths ? service.years + 1 : service.years;
}

/**
 * The monthly wages gratuity is worked out on. Under the labour codes, wages are basic + DA (and
 * any retaining allowance), but if the other allowances come to more than half of total pay, the
 * excess counts as wages too. In effect, wages are at least half of total pay.
 */
export function gratuityWages(basicDa: number, totalPay: number): { wages: number; raised: boolean } {
  const basic = positive(basicDa);
  const half = positive(totalPay) / 2;
  return half > basic ? { wages: half, raised: true } : { wages: basic, raised: false };
}

export interface GratuityInput {
  /** "YYYY-MM-DD". */
  joiningDate: string;
  /** Last working day, "YYYY-MM-DD". */
  leavingDate: string;
  /** Last drawn monthly basic salary plus dearness allowance. */
  basicDa: number;
  /** Optional: total monthly pay (gross, before deductions); 0 if not given. */
  totalPay: number;
  employmentType: EmploymentType;
  /** Whether the employer is covered by the gratuity law (10 or more employees). */
  covered: boolean;
}

export interface GratuityResult {
  /** Null until both dates are entered and in the right order. */
  service: Service | null;
  /** Why there's no service yet: a date is missing, or leaving is before joining. */
  datesProblem: "missing" | "order" | null;
  yearsCounted: number;
  /** The part-year of more than six months was counted as a full year. */
  roundedUp: boolean;
  /** Monthly wages used in the formula. */
  wages: number;
  /** Wages were raised to half of total pay. */
  wagesRaised: boolean;
  divisor: typeof COVERED_DIVISOR | typeof NOT_COVERED_DIVISOR;
  /** The gratuity worked out by the formula, whether or not it's payable yet. */
  gratuity: number;
  eligible: boolean;
  minimumYears: number;
  /** Tax-free and taxable parts, for a private-sector employee. */
  taxFree: number;
  taxable: number;
  /** More than the ₹20 lakh an employer has to pay by law. */
  aboveCap: boolean;
}

const positive = (value: number) => (Number.isFinite(value) ? Math.max(value, 0) : 0);

/**
 * Gratuity = 15 × monthly wages × years of service ÷ 26 for employers covered by the law, or
 * ÷ 30 (half a month's wages for each completed year) for those that aren't.
 */
export function calculateGratuity(input: GratuityInput): GratuityResult {
  const service = serviceBetween(input.joiningDate, input.leavingDate);
  const datesProblem =
    service !== null
      ? null
      : parseDate(input.joiningDate) && parseDate(input.leavingDate)
        ? "order"
        : "missing";
  const counted = service ? yearsCounted(service, input.covered) : 0;
  const { wages, raised } = gratuityWages(input.basicDa, input.totalPay);
  const divisor = input.covered ? COVERED_DIVISOR : NOT_COVERED_DIVISOR;
  const gratuity = roundTo((wages * DAYS_PER_YEAR * counted) / divisor, 2);
  const minimumYears = MINIMUM_YEARS[input.employmentType];
  const taxFree = Math.min(gratuity, GRATUITY_CAP);

  return {
    service,
    datesProblem,
    yearsCounted: counted,
    roundedUp: service !== null && counted > service.years,
    wages: roundTo(wages, 2),
    wagesRaised: raised,
    divisor,
    gratuity,
    eligible: service !== null && service.years >= minimumYears,
    minimumYears,
    taxFree,
    taxable: roundTo(gratuity - taxFree, 2),
    aboveCap: gratuity > GRATUITY_CAP,
  };
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/** "7 years 7 months", "1 year", "6 months 10 days", "0 days". */
export function formatService(service: Service): string {
  const parts = [
    service.years > 0 && plural(service.years, "year"),
    service.months > 0 && plural(service.months, "month"),
    service.days > 0 && plural(service.days, "day"),
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "0 days";
}

export const formatYears = (years: number) => plural(years, "year");
