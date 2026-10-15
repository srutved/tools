import { roundTo } from "@/lib/utils";

/**
 * GST rates offered as one-click chips. Since GST 2.0 (22 September 2025) the main slabs are 5% and
 * 18%, with 40% for luxury and sin goods; 0.25% (rough diamonds) and 3% (gold, silver, jewellery)
 * remain. Any other rate, such as an old 12% or 28% invoice, goes in the custom field.
 */
export const GST_RATES = [0.25, 3, 5, 18, 40] as const;
export const DEFAULT_GST_RATE = 18;

/** "add": the amount excludes GST. "remove": the amount already includes GST. */
export type GstMode = "add" | "remove";
/** "intra": within the state, split into CGST and SGST. "inter": to another state, charged as IGST. */
export type GstSupply = "intra" | "inter";

export interface GstInput {
  amount: number;
  /** Percentage, e.g. 18. */
  rate: number;
  mode: GstMode;
  supply: GstSupply;
}

export interface GstResult {
  /** The taxable value, before GST. */
  base: number;
  gst: number;
  /** Base plus GST. */
  total: number;
  /** Half of the GST each within the state; 0 for a supply to another state. */
  cgst: number;
  sgst: number;
  /** All of the GST for a supply to another state; 0 within the state. */
  igst: number;
  /** The rate actually used, after clamping to 0-100%. */
  rate: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * Adds GST to an amount, or takes it out of a GST-inclusive amount, rounded to paise.
 * Add: GST = amount × rate ÷ 100. Remove: base = amount × 100 ÷ (100 + rate), GST = amount − base.
 * CGST and SGST are half each; any odd paisa goes to SGST so the two always add up to the GST.
 */
export function calculateGst({ amount, rate, mode, supply }: GstInput): GstResult {
  const value = Math.max(Number.isFinite(amount) ? amount : 0, 0);
  const safeRate = clamp(Number.isFinite(rate) ? rate : 0, 0, 100);

  let base: number;
  let gst: number;
  let total: number;
  if (mode === "add") {
    base = roundTo(value, 2);
    gst = roundTo((value * safeRate) / 100, 2);
    total = roundTo(base + gst, 2);
  } else {
    total = roundTo(value, 2);
    base = roundTo((value * 100) / (100 + safeRate), 2);
    gst = roundTo(total - base, 2);
  }

  const paise = Math.round(gst * 100);
  const cgst = supply === "intra" ? Math.floor(paise / 2) / 100 : 0;
  const sgst = supply === "intra" ? (paise - Math.floor(paise / 2)) / 100 : 0;
  const igst = supply === "inter" ? gst : 0;
  return { base, gst, total, cgst, sgst, igst, rate: safeRate };
}

/** A rate for display, e.g. 18 → "18%", 0.25 → "0.25%", 0.125 → "0.125%". */
export function formatRate(rate: number): string {
  return `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 3 }).format(rate)}%`;
}
