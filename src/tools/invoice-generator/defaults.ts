import { addDaysIso, todayIso } from "@/lib/date";
import { createId } from "@/lib/utils";
import { EMPTY_PARTY, EMPTY_PAYMENT_DETAILS, type BusinessProfile } from "@/shared/business-profile";
import { computeInvoice } from "./lib/calculations";
import { kindLabels, type DocumentKind } from "./lib/document-kind";
import { nextInvoiceNumber } from "./lib/invoice-number";
import { EMPTY_EXTRA, type Invoice, type LineItem, type TaxMode } from "./schema";
import { DEFAULT_TEMPLATE_ID } from "./templates/registry";

export const DEFAULT_PAYMENT_TERMS_DAYS = 14;
export const DEFAULT_QUOTE_VALIDITY_DAYS = 30;

interface Starter {
  number: string;
  /** Days from the issue date to the second date (due, valid until, deliver by); 0 when there's none. */
  days: number;
  notes: string;
  terms: string;
}

/** Per-kind starting values for a new document. */
const STARTERS: Record<DocumentKind, Starter> = {
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
  proforma: {
    number: "PI-0001",
    days: 15,
    notes: "This is a proforma invoice, not a tax invoice. A tax invoice will be issued on dispatch.",
    terms: "Valid for 15 days. Goods are dispatched once the advance payment is received.",
  },
  receipt: {
    number: "RCT-0001",
    days: 0,
    notes: "Thank you for your payment.",
    terms: "",
  },
  "credit-note": {
    number: "CN-0001",
    days: 0,
    notes: "This credit note reduces the amount payable against the invoice above.",
    terms: "",
  },
  "debit-note": {
    number: "DN-0001",
    days: 0,
    notes: "This debit note increases the amount payable against the invoice above.",
    terms: "",
  },
  challan: {
    number: "DC-0001",
    days: 0,
    notes: "Please sign and return a copy of this challan on receiving the goods.",
    terms: "Goods are sent for the purpose stated above and are not a sale unless invoiced.",
  },
  "purchase-order": {
    number: "PO-0001",
    days: 15,
    notes: "Please quote this PO number on your invoice and delivery challan.",
    terms:
      "Deliver to the address above by the date shown. Goods must match the agreed specifications. Payment within 30 days of receiving the goods and a valid invoice.",
  },
};

/** The second date (due, valid until, deliver by), or "" for kinds without one. */
const secondDate = (kind: DocumentKind, issueDate: string) =>
  STARTERS[kind].days > 0 && kindLabels(kind).dueLabel ? addDaysIso(issueDate, STARTERS[kind].days) : "";

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
 * A blank document of the given kind, pre-filled with the user's saved business details when they
 * have them.
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
  // Receipts record a payment; the tax was on the invoice it settles.
  const taxMode: TaxMode = currency === "INR" && kind !== "receipt" ? "gst" : "none";
  return {
    kind,
    templateId: templateId ?? DEFAULT_TEMPLATE_ID,
    number: number ?? starter.number,
    issueDate,
    dueDate: secondDate(kind, issueDate),
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
    extra: { ...EMPTY_EXTRA, paymentMethod: kind === "receipt" ? "Bank transfer" : "" },
  };
}

/** The number after the user's latest one, or undefined to keep the example's own. */
export const nextNumberAfter = (latest: string | undefined) =>
  latest ? nextInvoiceNumber(latest) : undefined;

/**
 * Makes a landing-page example the user's own: their saved business details and payment info
 * (when they have them), today's date, a fresh due date and their next document number.
 */
export function fromExample(
  example: Invoice,
  { profile, number }: { profile?: BusinessProfile | null; number?: string },
): Invoice {
  const issueDate = todayIso();
  const hasProfile = Boolean(profile?.business.name.trim());
  return {
    ...example,
    number: number ?? example.number,
    issueDate,
    dueDate: secondDate(example.kind, issueDate),
    from: hasProfile ? profile!.business : example.from,
    logo: hasProfile ? profile!.logo : example.logo,
    payment: hasProfile ? profile!.payment : example.payment,
    items: example.items.map((item) => ({ ...item, id: createId() })),
  };
}

/** Documents one kind can be turned into, e.g. an accepted quotation into an invoice. */
export const CONVERSIONS: Partial<Record<DocumentKind, DocumentKind[]>> = {
  quote: ["invoice"],
  proforma: ["invoice"],
  invoice: ["receipt", "credit-note"],
};

/**
 * Turns a document into another kind: an accepted quotation or proforma into an invoice, or an
 * invoice into the receipt for its payment or a credit note against it. The client, design and
 * currency carry over; the new document gets its own number, today's date and its kind's wording.
 */
export function convertDocument(
  source: Invoice,
  target: DocumentKind,
  { number, profile }: { number: string; profile?: BusinessProfile | null },
): Invoice {
  const starter = STARTERS[target];
  const issueDate = todayIso();
  const base: Invoice = {
    ...source,
    kind: target,
    number,
    issueDate,
    dueDate: secondDate(target, issueDate),
    payment: profile?.payment ?? source.payment,
    items: source.items.map((item) => ({ ...item, id: createId() })),
    notes: starter.notes,
    terms: starter.terms,
    extra: { ...EMPTY_EXTRA },
  };
  const reference = { ...EMPTY_EXTRA, refNumber: source.number, refDate: source.issueDate };

  if (target === "receipt") {
    // One line for the payment, so the receipt shows exactly what was received.
    const total = computeInvoice(source).totals.total;
    return {
      ...base,
      taxMode: "none",
      discount: 0,
      items: [
        {
          ...createLineItem(),
          description:
            `Payment against ${kindLabels(source.kind).title.toLowerCase()} ${source.number}`.trim(),
          unitPrice: total,
        },
      ],
      extra: { ...reference, paymentMethod: "Bank transfer" },
    };
  }
  if (target === "credit-note" || target === "debit-note") return { ...base, extra: reference };
  return base;
}

/** An accepted quotation as an invoice. Kept for callers that only convert quotations. */
export const quoteToInvoice = (
  quote: Invoice,
  options: { number: string; profile?: BusinessProfile | null },
) => convertDocument(quote, "invoice", options);
