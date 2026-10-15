import { createDocumentStore } from "@/lib/saved-documents";
import { kindLabels, type DocumentKind } from "./lib/document-kind";
import { EMPTY_EXTRA, invoiceSchema } from "./schema";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Fills in fields added since a document was saved: documents saved before quotations existed have
 * no `kind` (they are all invoices), and those saved before receipts and notes have no `extra`.
 */
function withKind(raw: unknown, kind: DocumentKind): unknown {
  if (!isObject(raw) || !Array.isArray(raw.documents)) return raw;
  return {
    ...raw,
    documents: raw.documents.map((entry: unknown) =>
      isObject(entry) && isObject(entry.data)
        ? { ...entry, data: { kind, extra: EMPTY_EXTRA, ...entry.data } }
        : entry,
    ),
  };
}

/**
 * The user's saved invoices ("My invoices"). Version 1 of the app stored them as
 * `{ activeId, invoices: [{ id, updatedAt, invoice }] }`; that format is converted on load.
 */
export const invoiceStore = createDocumentStore({
  key: "invoice-generator/invoices",
  schema: invoiceSchema,
  migrate: (raw) => {
    if (!isObject(raw) || !Array.isArray(raw.invoices)) return withKind(raw, "invoice");
    return withKind(
      {
        activeId: raw.activeId ?? null,
        documents: raw.invoices.map((entry: { id?: unknown; updatedAt?: unknown; invoice?: unknown }) => ({
          id: entry?.id,
          updatedAt: entry?.updatedAt,
          data: entry?.invoice,
        })),
      },
      "invoice",
    );
  },
});

/** The user's saved quotations ("My quotations"). Same data as invoices, kept separately. */
export const quoteStore = createDocumentStore({
  key: "quotation-generator/quotations",
  schema: invoiceSchema,
  migrate: (raw) => withKind(raw, "quote"),
});

/** Every other kind keeps its own list, under its tool's name ("My receipts", "My credit notes"...). */
const otherStore = (kind: DocumentKind) =>
  createDocumentStore({
    key: `${kindLabels(kind).toolSlug}/documents`,
    schema: invoiceSchema,
    migrate: (raw) => withKind(raw, kind),
  });

const STORES: Record<DocumentKind, typeof invoiceStore> = {
  invoice: invoiceStore,
  quote: quoteStore,
  proforma: otherStore("proforma"),
  receipt: otherStore("receipt"),
  "credit-note": otherStore("credit-note"),
  "debit-note": otherStore("debit-note"),
  challan: otherStore("challan"),
  "purchase-order": otherStore("purchase-order"),
};

export const storeFor = (kind: DocumentKind) => STORES[kind];
