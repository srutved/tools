import { roundTo } from "@/lib/utils";

/**
 * The monthly rent the HRA calculator passes in the URL, e.g. /rent-receipt-generator?rent=25000.
 * ToolGate removes it from the address bar once read, so a reload doesn't add another set.
 */
export const RENT_HANDOFF_PARAM = "rent";

const MAX_RENT = 1e8;

/** The monthly rent in the query, or undefined if there's no usable amount. */
export function rentFromQuery(query: URLSearchParams): number | undefined {
  const raw = query.get(RENT_HANDOFF_PARAM);
  if (!raw) return undefined;
  const rent = Number(raw);
  if (!Number.isFinite(rent) || rent <= 0) return undefined;
  return roundTo(Math.min(rent, MAX_RENT), 2);
}
