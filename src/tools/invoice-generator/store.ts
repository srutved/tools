import { createDocumentStore } from "@/lib/saved-documents";
import type { DocumentKind } from "./lib/document-kind";
import { invoiceSchema } from "./schema";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/** Documents saved before quotations existed have no `kind`; they are all invoices. */
function withKind(raw: unknown, kind: DocumentKind): unknown {
  if (!isObject(raw) || !Array.isArray(raw.documents)) return raw;
  return {
    ...raw,
    documents: raw.documents.map((entry: unknown) =>
      isObject(entry) && isObject(entry.data) && !("kind" in entry.data)
        ? { ...entry, data: { kind, ...entry.data } }
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
});

export const storeFor = (kind: DocumentKind) => (kind === "quote" ? quoteStore : invoiceStore);
