import { describe, expect, it } from "vitest";
import { isValidGstin, stateCodeFromGstin } from "./gst";
import { nextInvoiceNumber } from "./invoice-number";
import { buildUpiUri, isValidUpiId } from "./upi";

describe("nextInvoiceNumber", () => {
  it.each([
    ["INV-0007", "INV-0008"],
    ["INV-0099", "INV-0100"],
    ["2026/099", "2026/100"],
    ["A-9-B", "A-10-B"],
    ["ACME", "ACME-2"],
    ["", "INV-0001"],
  ])("%s → %s", (previous, next) => {
    expect(nextInvoiceNumber(previous)).toBe(next);
  });
});

describe("GSTIN", () => {
  it("validates the 15-character format", () => {
    expect(isValidGstin("29ABCDE1234F1Z5")).toBe(true);
    expect(isValidGstin("29abcde1234f1z5")).toBe(true);
    expect(isValidGstin("29ABCDE1234F1X5")).toBe(false);
    expect(isValidGstin("123")).toBe(false);
  });

  it("reads the state code", () => {
    expect(stateCodeFromGstin("27PQRSX6789K1Z2")).toBe("27");
    expect(stateCodeFromGstin("99PQRSX6789K1Z2")).toBeNull();
  });
});

describe("UPI", () => {
  it("validates UPI IDs", () => {
    expect(isValidUpiId("aarav@okbank")).toBe(true);
    expect(isValidUpiId("9876543210@ybl")).toBe(true);
    expect(isValidUpiId("aarav")).toBe(false);
    expect(isValidUpiId("a@1bank")).toBe(false);
  });

  it("builds an NPCI deep link with an encoded payee name and note", () => {
    expect(
      buildUpiUri({ upiId: "aarav@okbank", payeeName: "Aarav & Co", amount: 1180, note: "Invoice INV-1" }),
    ).toBe("upi://pay?pa=aarav@okbank&pn=Aarav%20%26%20Co&am=1180.00&cu=INR&tn=Invoice%20INV-1");
  });
});
