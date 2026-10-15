/**
 * Reads a number typed into a calculator field. Accepts Indian or international digit grouping
 * ("1,20,000"), a currency sign or spaces, and treats anything else (empty, "abc", a lone ".") as 0.
 */
export function parseAmount(text: string): number {
  const cleaned = text.replace(/[^\d.-]/g, "");
  if (!cleaned) return 0;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
}

/** Keeps only the characters a positive amount can contain, so stray letters never appear in a field. */
export function sanitiseAmountInput(text: string): string {
  return text.replace(/[^\d.,]/g, "");
}

/** A number as plain text for an input, e.g. 12000 → "12000", 1234.5 → "1234.5" (no grouping). */
export function amountToInput(value: number, decimals = 2): string {
  if (!Number.isFinite(value) || value === 0) return "";
  return String(Math.round(value * 10 ** decimals) / 10 ** decimals);
}
