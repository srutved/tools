import { createDocumentStore } from "@/lib/saved-documents";
import { invoiceSchema } from "./schema";

/**
 * The user's saved invoices ("My invoices"). Version 1 of the app stored them as
 * `{ activeId, invoices: [{ id, updatedAt, invoice }] }`; that format is converted on load.
 */
export const invoiceStore = createDocumentStore({
  key: "invoice-generator/invoices",
  schema: invoiceSchema,
  migrate: (raw) => {
    if (typeof raw !== "object" || raw === null || !("invoices" in raw) || !Array.isArray(raw.invoices)) {
      return raw;
    }
    return {
      activeId: "activeId" in raw ? raw.activeId : null,
      documents: raw.invoices.map((entry: { id?: unknown; updatedAt?: unknown; invoice?: unknown }) => ({
        id: entry?.id,
        updatedAt: entry?.updatedAt,
        data: entry?.invoice,
      })),
    };
  },
});
