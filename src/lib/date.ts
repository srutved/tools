/**
 * Calendar dates are stored as "YYYY-MM-DD" strings and handled in UTC, so a date never shifts by
 * a day because of the viewer's time zone.
 */

function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Today's date in the user's time zone, as "YYYY-MM-DD". */
export function todayIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function addDaysIso(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  if (!date) return iso;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** "2026-10-13" → "13 Oct 2026" (day-month order is unambiguous worldwide). */
export function formatDate(iso: string): string {
  const date = parseIsoDate(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** "2026-10-13" → "13 October 2026", for letters. */
export function formatLongDate(iso: string): string {
  const date = parseIsoDate(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Whole days from one "YYYY-MM-DD" date to another (negative if `to` is earlier). */
export function daysBetween(from: string, to: string): number {
  const start = parseIsoDate(from);
  const end = parseIsoDate(to);
  if (!start || !end) return 0;
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

/* ---------------------------------------------------------------- Months ("YYYY-MM") */

const MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

export function isMonth(value: string): boolean {
  const match = MONTH_PATTERN.exec(value);
  return Boolean(match && Number(match[2]) >= 1 && Number(match[2]) <= 12);
}

/** "2026-11" + 3 → "2027-02". */
export function addMonths(month: string, count: number): string {
  const match = MONTH_PATTERN.exec(month);
  if (!match) return month;
  const index = Number(match[1]) * 12 + (Number(match[2]) - 1) + count;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
}

/** Every month from `from` to `to` inclusive; empty if the range is backwards or invalid. */
export function monthRange(from: string, to: string, limit = 60): string[] {
  if (!isMonth(from) || !isMonth(to)) return [];
  const months: string[] = [];
  for (let month = from; month <= to && months.length < limit; month = addMonths(month, 1)) {
    months.push(month);
  }
  return months;
}

/** "2026-04" → "April 2026". */
export function formatMonth(month: string): string {
  const match = MONTH_PATTERN.exec(month);
  if (!match) return month;
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1)),
  );
}

/** "2026-04" + 5 → "2026-04-05", clamped to the month's last day. */
export function dayOfMonth(month: string, day: number): string {
  const match = MONTH_PATTERN.exec(month);
  if (!match) return "";
  const last = new Date(Date.UTC(Number(match[1]), Number(match[2]), 0)).getUTCDate();
  return `${month}-${String(Math.min(Math.max(1, day), last)).padStart(2, "0")}`;
}

/** The current month as "YYYY-MM", in the user's time zone. */
export const currentMonth = () => todayIso().slice(0, 7);

/** India's financial year (April to March) containing the given month. */
export function financialYear(month: string = currentMonth()): { from: string; to: string } {
  const year = Number(month.slice(0, 4));
  const start = Number(month.slice(5, 7)) >= 4 ? year : year - 1;
  return { from: `${start}-04`, to: `${start + 1}-03` };
}
