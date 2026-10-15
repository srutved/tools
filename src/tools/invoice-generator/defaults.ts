import { addDaysIso, todayIso } from "@/lib/date";
import { createId } from "@/lib/utils";
import { EMPTY_PARTY, EMPTY_PAYMENT_DETAILS, type BusinessProfile } from "@/shared/business-profile";
import type { DocumentKind } from "./lib/document-kind";
import type { Invoice, LineItem, TaxMode } from "./schema";
import { DEFAULT_TEMPLATE_ID } from "./templates/registry";

export const DEFAULT_PAYMENT_TERMS_DAYS = 14;
export const DEFAULT_QUOTE_VALIDITY_DAYS = 30;

/** Per-kind starting values for a new document. */
const STARTERS: Record<DocumentKind, { number: string; days: number; notes: string; terms: string }> = {
  invoice: {
    number: "INV-0001",
    days: DEFAULT_PAYMENT_TERMS_DAYS,
    notes: "Thank you for your business!",
    terms: `Payment due within ${DEFAULT_PAYMENT_TERMS_DAYS} days.`,
  },
  quote: {
    number: "QT-0001",
    days: DEFAULT_QUOTE_VALIDITY_DAYS,
    notes: "Thank you for the opportunity. We look forward to working with you.",
    terms: `This quotation is valid for ${DEFAULT_QUOTE_VALIDITY_DAYS} days. Work starts on written acceptance.`,
  },
};

export function createLineItem(taxRate = 0): LineItem {
  return { id: createId(), description: "", code: "", quantity: 1, unitPrice: 0, taxRate };
}

interface NewInvoiceOptions {
  kind?: DocumentKind;
  profile?: BusinessProfile | null;
  currency: string;
  number?: string;
  templateId?: string;
}

/**
 * A blank invoice or quotation, pre-filled with the user's saved business details when they have
 * them.
 */
export function createInvoice({
  kind = "invoice",
  profile,
  currency,
  number,
  templateId,
}: NewInvoiceOptions): Invoice {
  const starter = STARTERS[kind];
  const issueDate = todayIso();
  const taxMode: TaxMode = currency === "INR" ? "gst" : "none";
  return {
    kind,
    templateId: templateId ?? DEFAULT_TEMPLATE_ID,
    number: number ?? starter.number,
    issueDate,
    dueDate: addDaysIso(issueDate, starter.days),
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
    notes: starter.notes,
    terms: starter.terms,
  };
}

/**
 * Turns an accepted quotation into an invoice: same client, items, tax and design, with a new
 * invoice number, today's date, payment terms and the user's latest payment details.
 */
export function quoteToInvoice(
  quote: Invoice,
  { number, profile }: { number: string; profile?: BusinessProfile | null },
): Invoice {
  const starter = STARTERS.invoice;
  const issueDate = todayIso();
  return {
    ...quote,
    kind: "invoice",
    number,
    issueDate,
    dueDate: addDaysIso(issueDate, starter.days),
    payment: profile?.payment ?? quote.payment,
    items: quote.items.map((item) => ({ ...item, id: createId() })),
    notes: starter.notes,
    terms: starter.terms,
  };
}
