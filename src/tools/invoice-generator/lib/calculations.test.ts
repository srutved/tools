import { describe, expect, it } from "vitest";
import { SAMPLE_INVOICE } from "../sample";
import type { Invoice } from "../schema";
import { computeInvoice, isIntraStateSupply } from "./calculations";

const invoice = (overrides: Partial<Invoice>): Invoice => ({ ...SAMPLE_INVOICE, ...overrides });

const item = (unitPrice: number, taxRate: number, quantity = 1) => ({
  id: `${unitPrice}-${taxRate}`,
  description: "Work",
  code: "",
  quantity,
  unitPrice,
  taxRate,
});

describe("computeInvoice", () => {
  it("splits GST into CGST and SGST for an intra-state supply", () => {
    const result = computeInvoice(
      invoice({
        placeOfSupply: "29",
        from: { ...SAMPLE_INVOICE.from, stateCode: "29" },
        items: [item(1000, 18)],
      }),
    );
    expect(result.totals.taxLines).toEqual([
      { label: "CGST 9%", amount: 90 },
      { label: "SGST 9%", amount: 90 },
    ]);
    expect(result.totals.total).toBe(1180);
  });

  it("charges IGST for an inter-state supply", () => {
    const result = computeInvoice(invoice({ placeOfSupply: "27", items: [item(1000, 18)] }));
    expect(result.totals.taxLines).toEqual([{ label: "IGST 18%", amount: 180 }]);
  });

  it("groups tax by rate", () => {
    const result = computeInvoice(
      invoice({
        taxMode: "custom",
        taxLabel: "VAT",
        currency: "GBP",
        items: [item(100, 20), item(50, 20), item(10, 5)],
      }),
    );
    expect(result.totals.taxLines).toEqual([
      { label: "VAT 5%", amount: 0.5 },
      { label: "VAT 20%", amount: 30 },
    ]);
  });

  it("applies a flat discount before tax, proportionally across lines", () => {
    const result = computeInvoice(
      invoice({ placeOfSupply: "27", discount: 100, items: [item(600, 18), item(400, 5)] }),
    );
    // Taxable value is 900: 540 at 18% (97.2) and 360 at 5% (18).
    expect(result.totals.discount).toBe(100);
    expect(result.totals.totalTax).toBe(115.2);
    expect(result.totals.total).toBe(1015.2);
  });

  it("never discounts more than the subtotal", () => {
    const result = computeInvoice(invoice({ taxMode: "none", discount: 5000, items: [item(100, 0)] }));
    expect(result.totals.discount).toBe(100);
    expect(result.totals.total).toBe(0);
  });

  it("zero-rates exports under LUT and prints the declaration", () => {
    const result = computeInvoice(
      invoice({ taxMode: "gst-export", lutNumber: "AD290326000123", items: [item(1000, 18)] }),
    );
    expect(result.totals.totalTax).toBe(0);
    expect(result.notices).toEqual([
      "Supply meant for export under LUT without payment of IGST.",
      "LUT ARN: AD290326000123",
    ]);
  });

  it("rounds to the currency's minor units", () => {
    const result = computeInvoice(invoice({ taxMode: "none", currency: "JPY", items: [item(333.6, 0, 3)] }));
    expect(result.totals.total).toBe(1001);
  });

  it("treats half-typed numbers as zero instead of producing NaN", () => {
    const result = computeInvoice(invoice({ items: [{ ...item(100, 18), quantity: Number.NaN }] }));
    expect(result.totals.total).toBe(0);
  });

  it("builds a UPI payment link only for INR invoices with a valid UPI ID", () => {
    expect(computeInvoice(SAMPLE_INVOICE).upiUri).toMatch(/^upi:\/\/pay\?pa=aarav@okbank&/);
    expect(computeInvoice(invoice({ currency: "USD" })).upiUri).toBeNull();
    expect(
      computeInvoice(invoice({ payment: { ...SAMPLE_INVOICE.payment, upiId: "not a upi id" } })).upiUri,
    ).toBeNull();
  });
});

describe("isIntraStateSupply", () => {
  it("falls back to the client's state when no place of supply is set", () => {
    const from = { ...SAMPLE_INVOICE.from, stateCode: "29" };
    expect(
      isIntraStateSupply({ from, to: { ...SAMPLE_INVOICE.to, stateCode: "29" }, placeOfSupply: "" }),
    ).toBe(true);
    expect(
      isIntraStateSupply({ from, to: { ...SAMPLE_INVOICE.to, stateCode: "27" }, placeOfSupply: "" }),
    ).toBe(false);
  });
});
