import { describe, expect, it } from "vitest";
import { convertDocument, createInvoice } from "../defaults";
import { sampleFor } from "../sample";
import { invoiceExportSchema, type Invoice } from "../schema";
import { invoiceStore, storeFor } from "../store";
import { computeInvoice } from "./calculations";
import { DOCUMENT_KINDS, kindLabels } from "./document-kind";

const errorPaths = (invoice: Invoice) => {
  const result = invoiceExportSchema.safeParse(invoice);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
};
const messages = (invoice: Invoice) => {
  const result = invoiceExportSchema.safeParse(invoice);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
};

describe("document kinds", () => {
  it("has a sample that passes export validation for every kind", () => {
    for (const kind of DOCUMENT_KINDS) expect([kind, errorPaths(sampleFor(kind))]).toEqual([kind, []]);
  });

  it("starts each kind with its own number and only the dates it uses", () => {
    expect(createInvoice({ kind: "receipt", currency: "INR" })).toMatchObject({
      number: "RCT-0001",
      dueDate: "",
      taxMode: "none",
      extra: { paymentMethod: "Bank transfer" },
    });
    expect(createInvoice({ kind: "credit-note", currency: "INR" }).dueDate).toBe("");
    expect(createInvoice({ kind: "purchase-order", currency: "INR" }).dueDate).not.toBe("");
    expect(createInvoice({ kind: "challan", currency: "INR" }).number).toBe("DC-0001");
  });

  it("words validation messages for the kind of document", () => {
    const blank = {
      ...sampleFor("purchase-order"),
      number: "",
      to: { ...sampleFor("invoice").to, name: "" },
    };
    expect(messages(blank)).toEqual(["Add the PO number", "Add the vendor's name"]);
  });

  it("requires the original invoice and a reason on credit notes", () => {
    const note = {
      ...sampleFor("credit-note"),
      extra: { ...sampleFor("credit-note").extra, refNumber: "", reason: "" },
    };
    expect(errorPaths(note)).toEqual(["extra.refNumber", "extra.reason"]);
  });

  it("keeps each kind in its own saved list", () => {
    const keys = new Set(DOCUMENT_KINDS.map((kind) => storeFor(kind)));
    expect(keys.size).toBe(DOCUMENT_KINDS.length);
    expect(storeFor("invoice")).toBe(invoiceStore);
    expect(kindLabels("challan").toolSlug).toBe("delivery-challan-generator");
  });
});

describe("convertDocument", () => {
  const invoice = sampleFor("invoice");
  const options = { number: "X-0001" };

  it("turns an invoice into a receipt for its total, linked to the invoice", () => {
    const receipt = convertDocument(invoice, "receipt", options);
    expect(receipt).toMatchObject({
      kind: "receipt",
      number: "X-0001",
      dueDate: "",
      taxMode: "none",
      to: invoice.to,
      extra: { refNumber: "INV-0042", refDate: "2026-10-01", paymentMethod: "Bank transfer" },
    });
    expect(receipt.items).toHaveLength(1);
    expect(receipt.items[0].description).toBe("Payment against invoice INV-0042");
    expect(computeInvoice(receipt).totals.total).toBe(computeInvoice(invoice).totals.total);
  });

  it("turns an invoice into a credit note against it, keeping the items to edit", () => {
    const note = convertDocument(invoice, "credit-note", options);
    expect(note.kind).toBe("credit-note");
    expect(note.items).toHaveLength(invoice.items.length);
    expect(note.extra).toMatchObject({ refNumber: "INV-0042", refDate: "2026-10-01", reason: "" });
  });

  it("turns a quotation or proforma into an invoice with payment terms", () => {
    for (const kind of ["quote", "proforma"] as const) {
      const converted = convertDocument(sampleFor(kind), "invoice", options);
      expect(converted.kind).toBe("invoice");
      expect(converted.dueDate).not.toBe("");
      expect(converted.extra.refNumber).toBe("");
    }
  });
});
