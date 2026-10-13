/**
 * Suggests the next invoice number by incrementing the last run of digits, keeping zero padding:
 *   "INV-0007" → "INV-0008", "2026/099" → "2026/100", "ACME" → "ACME-2"
 */
export function nextInvoiceNumber(previous: string): string {
  const match = previous.match(/^(.*?)(\d+)(\D*)$/);
  if (!match) return previous.trim() ? `${previous.trim()}-2` : "INV-0001";
  const [, prefix, digits, suffix] = match;
  const next = String(Number(digits) + 1).padStart(digits.length, "0");
  return `${prefix}${next}${suffix}`;
}
