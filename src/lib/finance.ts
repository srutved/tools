/** Small helpers shared by the loan and savings calculators (EMI, SIP, FD, RD, PPF, compound interest). */

/** A typed-in number made safe for the maths: NaN, Infinity and negatives become 0, and it's capped at `max`. */
export function clampInput(value: number, max = Number.POSITIVE_INFINITY): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.min(value, max);
}

/** A rate for display, e.g. 7.1 → "7.1%", 8.25 → "8.25%", 12 → "12%". */
export function formatPercent(rate: number): string {
  return `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(rate)}%`;
}

/** A length of time in months as words, e.g. 30 → "2 years 6 months", 12 → "1 year", 5 → "5 months". */
export function formatTenure(months: number): string {
  const whole = Math.round(months);
  const years = Math.floor(whole / 12);
  const rest = whole % 12;
  const parts = [
    years > 0 && `${years} ${years === 1 ? "year" : "years"}`,
    (rest > 0 || years === 0) && `${rest} ${rest === 1 ? "month" : "months"}`,
  ].filter(Boolean);
  return parts.join(" ");
}

/**
 * Label for one row of a year-by-year table that may end part-way through a year: "Year 3", or
 * "Year 3 (6 months)" when the term ends 6 months into year 3.
 */
export function yearRowLabel(year: number, totalMonths: number): string {
  const monthsInYear = Math.min(totalMonths - (year - 1) * 12, 12);
  return monthsInYear < 12 ? `Year ${year} (${formatTenure(monthsInYear)})` : `Year ${year}`;
}
