/**
 * The user's saved invoices ("My invoices"), kept in localStorage. Each invoice is validated on
 * its own, so one corrupted entry never wipes out the rest.
 */

import { z } from "zod";
import { readStored, writeStored } from "@/lib/storage";
import { invoiceSchema, type Invoice } from "./schema";

const STORAGE_KEY = "invoice-generator/invoices";

const savedInvoiceSchema = z.object({
  id: z.string(),
  updatedAt: z.number(),
  invoice: invoiceSchema,
});

export type SavedInvoice = z.infer<typeof savedInvoiceSchema>;

export interface InvoiceStore {
  activeId: string | null;
  invoices: SavedInvoice[];
}

const rawStoreSchema = z.object({
  activeId: z.string().nullable(),
  invoices: z.array(z.unknown()),
});

export function loadInvoiceStore(): InvoiceStore {
  const raw = readStored(STORAGE_KEY, rawStoreSchema);
  if (!raw) return { activeId: null, invoices: [] };
  const invoices = raw.invoices.flatMap((entry) => {
    const parsed = savedInvoiceSchema.safeParse(entry);
    return parsed.success ? [parsed.data] : [];
  });
  return { activeId: raw.activeId, invoices };
}

export function saveInvoiceStore(store: InvoiceStore): boolean {
  return writeStored(STORAGE_KEY, store);
}

/** Inserts or replaces an invoice, newest first. */
export function upsertInvoice(store: InvoiceStore, id: string, invoice: Invoice): InvoiceStore {
  const entry: SavedInvoice = { id, updatedAt: Date.now(), invoice };
  return {
    activeId: id,
    invoices: [entry, ...store.invoices.filter((saved) => saved.id !== id)],
  };
}

export function removeInvoice(store: InvoiceStore, id: string): InvoiceStore {
  const invoices = store.invoices.filter((saved) => saved.id !== id);
  return { activeId: store.activeId === id ? (invoices[0]?.id ?? null) : store.activeId, invoices };
}
