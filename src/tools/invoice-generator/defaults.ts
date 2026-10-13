import { addDaysIso, todayIso } from "@/lib/date";
import { createId } from "@/lib/utils";
import { EMPTY_PARTY, EMPTY_PAYMENT_DETAILS, type BusinessProfile } from "@/shared/business-profile";
import type { Invoice, LineItem, TaxMode } from "./schema";
import { DEFAULT_TEMPLATE_ID } from "./templates/registry";

export const DEFAULT_PAYMENT_TERMS_DAYS = 14;

export function createLineItem(taxRate = 0): LineItem {
  return { id: createId(), description: "", code: "", quantity: 1, unitPrice: 0, taxRate };
}

interface NewInvoiceOptions {
  profile?: BusinessProfile | null;
  currency: string;
  number?: string;
  templateId?: string;
}

/** A blank invoice, pre-filled with the user's saved business details when they have them. */
export function createInvoice({ profile, currency, number, templateId }: NewInvoiceOptions): Invoice {
  const issueDate = todayIso();
  const taxMode: TaxMode = currency === "INR" ? "gst" : "none";
  return {
    templateId: templateId ?? DEFAULT_TEMPLATE_ID,
    number: number ?? "INV-0001",
    issueDate,
    dueDate: addDaysIso(issueDate, DEFAULT_PAYMENT_TERMS_DAYS),
    currency,
    taxMode,
    taxLabel: "Tax",
    placeOfSupply: "",
    lutNumber: "",
    discount: 0,
    logo: profile?.logo ?? "",
    from: profile?.business ?? EMPTY_PARTY,
    to: EMPTY_PARTY,
    payment: profile?.payment ?? EMPTY_PAYMENT_DETAILS,
    items: [createLineItem(taxMode === "gst" ? 18 : 0)],
    notes: "Thank you for your business!",
    terms: `Payment due within ${DEFAULT_PAYMENT_TERMS_DAYS} days.`,
  };
}
