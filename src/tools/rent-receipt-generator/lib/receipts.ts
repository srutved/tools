/**
 * Turns the form into the receipts to print: one per month, numbered and dated, with the amount in
 * figures and words. Pure and tolerant of half-filled forms, for the live preview.
 */

import { amountInWords } from "@/lib/amount-in-words";
import { formatMoney } from "@/lib/currency";
import { dayOfMonth, formatDate, formatMonth, monthRange } from "@/lib/date";
import { PAYMENT_MODE_LABELS, type RentReceipt } from "../schema";

/** Receipts for more than this many months are split into separate sets. */
export const MAX_MONTHS = 24;
/** Above this yearly rent, employers need the landlord's PAN to allow the HRA exemption. */
export const PAN_THRESHOLD = 100_000;
/** Cash receipts above this amount need a ₹1 revenue stamp. */
export const REVENUE_STAMP_THRESHOLD = 5_000;

export interface PreparedReceipt {
  number: string;
  /** e.g. "05 Apr 2026". */
  date: string;
  /** e.g. "April 2026". */
  period: string;
}

export interface PreparedRentReceipts {
  tenantName: string;
  landlordName: string;
  landlordPan: string;
  landlordAddress: string;
  propertyAddress: string;
  amount: string;
  amountInWords: string;
  paymentMode: string;
  /** Show a box for a revenue stamp (cash receipts over ₹5,000). */
  revenueStamp: boolean;
  signature: string;
  receipts: PreparedReceipt[];
  /** Total rent for the period, e.g. "₹3,00,000.00". */
  total: string;
  /** Yearly rent is high enough that the landlord's PAN is needed for HRA. */
  panRequired: boolean;
}

const text = (value: string | undefined) => (value ?? "").trim();

export function prepareRentReceipts(data: RentReceipt): PreparedRentReceipts {
  const rent = Number.isFinite(data.monthlyRent) ? Math.max(0, data.monthlyRent) : 0;
  const months = monthRange(data.from ?? "", data.to ?? "", MAX_MONTHS);
  const width = String(months.length).length < 2 ? 2 : String(months.length).length;
  const prefix = text(data.numberPrefix);
  const mode = data.paymentMode ?? "bank-transfer";

  return {
    tenantName: text(data.tenantName),
    landlordName: text(data.landlordName),
    landlordPan: text(data.landlordPan).toUpperCase(),
    landlordAddress: text(data.landlordAddress),
    propertyAddress: text(data.propertyAddress),
    amount: formatMoney(rent, "INR"),
    amountInWords: amountInWords(rent, "INR"),
    paymentMode: PAYMENT_MODE_LABELS[mode],
    revenueStamp: mode === "cash" && rent > REVENUE_STAMP_THRESHOLD,
    signature: data.signature ?? "",
    receipts: months.map((month, index) => ({
      number: `${prefix}${String(index + 1).padStart(width, "0")}`,
      date: formatDate(dayOfMonth(month, data.paymentDay || 1)),
      period: formatMonth(month),
    })),
    total: formatMoney(rent * months.length, "INR"),
    panRequired: rent * 12 > PAN_THRESHOLD,
  };
}
