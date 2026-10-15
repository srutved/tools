import { amountInWords } from "@/lib/amount-in-words";
import { getCurrencyDecimals } from "@/lib/currency";
import { roundTo, toFiniteNumber } from "@/lib/utils";
import type { Invoice, LineItem } from "../schema";
import { kindLabels } from "./document-kind";
import { buildUpiUri, isValidUpiId } from "./upi";

export interface ComputedLine extends LineItem {
  /** quantity × unit price, before discount and tax. */
  amount: number;
}

export interface TaxLine {
  label: string;
  amount: number;
}

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  taxLines: TaxLine[];
  totalTax: number;
  total: number;
}

export interface ComputedInvoice {
  lines: ComputedLine[];
  totals: InvoiceTotals;
  /** Whether line items show a tax rate column. */
  showTaxColumn: boolean;
  /** Whether line items show an HSN/SAC column. */
  showCodeColumn: boolean;
  amountInWords: string;
  /** UPI payment URI for the QR code (INR invoices with a valid UPI ID only). */
  upiUri: string | null;
  /** Statutory lines printed on the invoice, e.g. the LUT declaration for exports. */
  notices: string[];
}

/** Whether a GST invoice is intra-state (CGST + SGST) rather than inter-state (IGST). */
export function isIntraStateSupply(invoice: Pick<Invoice, "from" | "to" | "placeOfSupply">): boolean {
  const supplierState = invoice.from.stateCode;
  const supplyState = invoice.placeOfSupply || invoice.to.stateCode;
  return Boolean(supplierState) && supplierState === supplyState;
}

function formatRate(rate: number): string {
  return `${Number(rate.toFixed(3))}%`;
}

/** Groups tax by rate, so an invoice with mixed rates shows one line per rate. */
function groupTaxByRate(taxable: { rate: number; amount: number }[]) {
  const byRate = new Map<number, number>();
  for (const { rate, amount } of taxable) {
    if (rate > 0) byRate.set(rate, (byRate.get(rate) ?? 0) + amount);
  }
  return [...byRate.entries()].sort(([a], [b]) => a - b);
}

/**
 * Derives everything a template needs to print from the raw form values: line amounts, discount,
 * tax lines and totals, amount in words, payment QR and statutory notices. Pure and tolerant of
 * half-filled forms (blank numbers count as 0), so the preview can update on every keystroke.
 */
export function computeInvoice(invoice: Invoice): ComputedInvoice {
  const decimals = getCurrencyDecimals(invoice.currency);
  const round = (value: number) => roundTo(value, decimals);

  const lines: ComputedLine[] = invoice.items.map((item) => {
    const quantity = toFiniteNumber(item.quantity);
    const unitPrice = toFiniteNumber(item.unitPrice);
    return {
      ...item,
      quantity,
      unitPrice,
      taxRate: toFiniteNumber(item.taxRate),
      amount: round(quantity * unitPrice),
    };
  });

  const subtotal = round(lines.reduce((sum, line) => sum + line.amount, 0));
  const discount = round(Math.min(toFiniteNumber(invoice.discount), subtotal));
  // Spread a flat discount across lines in proportion to their value, so tax is charged on the
  // discounted price of each line even when lines have different rates.
  const discountRatio = subtotal > 0 ? (subtotal - discount) / subtotal : 0;

  const hasLineTax = invoice.taxMode === "gst" || invoice.taxMode === "custom";
  const taxable = hasLineTax
    ? lines.map((line) => ({ rate: line.taxRate, amount: line.amount * discountRatio }))
    : [];

  const taxLines: TaxLine[] = [];
  for (const [rate, base] of groupTaxByRate(taxable)) {
    const tax = (base * rate) / 100;
    if (invoice.taxMode === "custom") {
      taxLines.push({ label: `${invoice.taxLabel.trim() || "Tax"} ${formatRate(rate)}`, amount: round(tax) });
    } else if (isIntraStateSupply(invoice)) {
      const half = round(tax / 2);
      taxLines.push({ label: `CGST ${formatRate(rate / 2)}`, amount: half });
      taxLines.push({ label: `SGST ${formatRate(rate / 2)}`, amount: half });
    } else {
      taxLines.push({ label: `IGST ${formatRate(rate)}`, amount: round(tax) });
    }
  }

  const totalTax = round(taxLines.reduce((sum, line) => sum + line.amount, 0));
  const total = round(subtotal - discount + totalTax);

  const notices: string[] = [];
  if (invoice.taxMode === "gst-export") {
    notices.push("Supply meant for export under LUT without payment of IGST.");
    if (invoice.lutNumber.trim()) notices.push(`LUT ARN: ${invoice.lutNumber.trim()}`);
  }

  const upiId = invoice.payment.upiId.trim();
  const upiUri =
    kindLabels(invoice.kind).showsPayment && invoice.currency === "INR" && total > 0 && isValidUpiId(upiId)
      ? buildUpiUri({
          upiId,
          payeeName: invoice.from.name || upiId,
          amount: total,
          note: invoice.number ? `${kindLabels(invoice.kind).title} ${invoice.number}` : undefined,
        })
      : null;

  return {
    lines,
    totals: { subtotal, discount, taxLines, totalTax, total },
    showTaxColumn: hasLineTax,
    showCodeColumn:
      invoice.taxMode === "gst" || invoice.taxMode === "gst-export" || lines.some((line) => line.code),
    amountInWords: amountInWords(total, invoice.currency),
    upiUri,
    notices,
  };
}
