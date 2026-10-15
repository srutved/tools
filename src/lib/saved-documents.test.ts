import { describe, expect, it } from "vitest";
import { SAMPLE_INVOICE } from "@/tools/invoice-generator/sample";
import { invoiceStore } from "@/tools/invoice-generator/store";
import { removeDocument, upsertDocument, type DocumentCollection } from "./saved-documents";

const collection: DocumentCollection<string> = {
  activeId: "a",
  documents: [
    { id: "a", updatedAt: 1, data: "first" },
    { id: "b", updatedAt: 2, data: "second" },
  ],
};

describe("saved documents", () => {
  it("upserts to the top and makes the document active", () => {
    const next = upsertDocument(collection, "b", "edited");
    expect(next.activeId).toBe("b");
    expect(next.documents.map((doc) => doc.data)).toEqual(["edited", "first"]);
  });

  it("opens the next document when the active one is removed", () => {
    expect(removeDocument(collection, "a")).toMatchObject({ activeId: "b", documents: [{ id: "b" }] });
    expect(removeDocument(collection, "b").activeId).toBe("a");
  });
});

describe("invoice store", () => {
  it("loads invoices saved in the version 1 format", () => {
    const storage = new Map<string, string>();
    const localStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    };
    Object.assign(globalThis, { window: { localStorage } });
    try {
      storage.set(
        "srutved-tools/v1/invoice-generator/invoices",
        JSON.stringify({ activeId: "x", invoices: [{ id: "x", updatedAt: 5, invoice: SAMPLE_INVOICE }] }),
      );
      expect(invoiceStore.load()).toEqual({
        activeId: "x",
        documents: [{ id: "x", updatedAt: 5, data: SAMPLE_INVOICE }],
      });

      // Invoices saved before quotations existed have no kind; they still load, as invoices.
      const withoutKind: Partial<typeof SAMPLE_INVOICE> = { ...SAMPLE_INVOICE };
      delete withoutKind.kind;
      storage.set(
        "srutved-tools/v1/invoice-generator/invoices",
        JSON.stringify({ activeId: "y", documents: [{ id: "y", updatedAt: 6, data: withoutKind }] }),
      );
      expect(invoiceStore.load().documents[0]?.data).toEqual(SAMPLE_INVOICE);
    } finally {
      Reflect.deleteProperty(globalThis, "window");
    }
  });
});
