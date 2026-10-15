import { describe, expect, it } from "vitest";
import { addMonths, financialYear, formatMonth, monthRange } from "@/lib/date";
import { SAMPLE_RENT_RECEIPT } from "../sample";
import { rentReceiptExportSchema } from "../schema";
import { MAX_MONTHS, prepareRentReceipts } from "./receipts";

describe("month helpers", () => {
  it("adds months across years", () => {
    expect(addMonths("2026-11", 3)).toBe("2027-02");
    expect(addMonths("2026-01", -1)).toBe("2025-12");
  });
  it("lists months inclusively and rejects backwards ranges", () => {
    expect(monthRange("2026-11", "2027-02")).toEqual(["2026-11", "2026-12", "2027-01", "2027-02"]);
    expect(monthRange("2027-02", "2026-11")).toEqual([]);
  });
  it("finds the Indian financial year", () => {
    expect(financialYear("2026-10")).toEqual({ from: "2026-04", to: "2027-03" });
    expect(financialYear("2027-02")).toEqual({ from: "2026-04", to: "2027-03" });
  });
  it("formats months", () => {
    expect(formatMonth("2026-04")).toBe("April 2026");
  });
});

describe("prepareRentReceipts", () => {
  it("makes one numbered, dated receipt per month", () => {
    const prepared = prepareRentReceipts(SAMPLE_RENT_RECEIPT);
    expect(prepared.receipts).toHaveLength(12);
    expect(prepared.receipts[0]).toEqual({ number: "RR-01", date: "05 Apr 2026", period: "April 2026" });
    expect(prepared.receipts[11].period).toBe("March 2027");
    expect(prepared.total).toBe("₹3,00,000.00");
    expect(prepared.amountInWords).toBe("Indian Rupees Twenty Five Thousand Only");
  });

  it("clamps the payment day to short months", () => {
    const prepared = prepareRentReceipts({
      ...SAMPLE_RENT_RECEIPT,
      from: "2027-02",
      to: "2027-02",
      paymentDay: 31,
    });
    expect(prepared.receipts[0].date).toBe("28 Feb 2027");
  });

  it("asks for a revenue stamp only on cash receipts over ₹5,000", () => {
    const withMode = (paymentMode: "cash" | "upi", monthlyRent = 25000) =>
      prepareRentReceipts({ ...SAMPLE_RENT_RECEIPT, paymentMode, monthlyRent }).revenueStamp;
    expect(withMode("cash")).toBe(true);
    expect(withMode("upi")).toBe(false);
    expect(withMode("cash", 5000)).toBe(false);
  });

  it("flags when the landlord's PAN is needed for HRA", () => {
    expect(prepareRentReceipts({ ...SAMPLE_RENT_RECEIPT, monthlyRent: 8000 }).panRequired).toBe(false);
    expect(prepareRentReceipts({ ...SAMPLE_RENT_RECEIPT, monthlyRent: 9000 }).panRequired).toBe(true);
  });

  it("caps very long ranges", () => {
    const prepared = prepareRentReceipts({ ...SAMPLE_RENT_RECEIPT, from: "2020-01", to: "2027-12" });
    expect(prepared.receipts).toHaveLength(MAX_MONTHS);
  });
});

describe("rentReceiptExportSchema", () => {
  it("accepts the sample", () => {
    expect(rentReceiptExportSchema.safeParse(SAMPLE_RENT_RECEIPT).success).toBe(true);
  });
  it("rejects an invalid PAN and a backwards range", () => {
    const result = rentReceiptExportSchema.safeParse({
      ...SAMPLE_RENT_RECEIPT,
      landlordPan: "12345",
      from: "2027-03",
      to: "2026-04",
    });
    const paths = result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
    expect(paths).toEqual(["landlordPan", "to"]);
  });
});
