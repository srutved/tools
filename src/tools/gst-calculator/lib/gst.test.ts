import { describe, expect, it } from "vitest";
import { calculateGst, formatRate } from "./gst";

describe("calculateGst", () => {
  it("adds GST and splits it into CGST and SGST within the state", () => {
    expect(calculateGst({ amount: 10000, rate: 18, mode: "add", supply: "intra" })).toEqual({
      base: 10000,
      gst: 1800,
      total: 11800,
      cgst: 900,
      sgst: 900,
      igst: 0,
      rate: 18,
    });
  });

  it("charges IGST on a supply to another state", () => {
    const result = calculateGst({ amount: 10000, rate: 5, mode: "add", supply: "inter" });
    expect(result).toMatchObject({ gst: 500, total: 10500, cgst: 0, sgst: 0, igst: 500 });
  });

  it("removes GST from an inclusive amount", () => {
    const result = calculateGst({ amount: 11800, rate: 18, mode: "remove", supply: "intra" });
    expect(result).toMatchObject({ base: 10000, gst: 1800, total: 11800, cgst: 900, sgst: 900 });
  });

  it("rounds to paise and keeps CGST + SGST equal to the GST", () => {
    const result = calculateGst({ amount: 999, rate: 18, mode: "remove", supply: "intra" });
    expect(result.base).toBe(846.61);
    expect(result.gst).toBe(152.39);
    expect(result.base + result.gst).toBeCloseTo(999, 2);
    expect(result.cgst).toBe(76.19);
    expect(result.sgst).toBe(76.2);
  });

  it("handles the small and luxury rates", () => {
    expect(calculateGst({ amount: 100000, rate: 0.25, mode: "add", supply: "inter" }).igst).toBe(250);
    expect(calculateGst({ amount: 50000, rate: 3, mode: "add", supply: "intra" }).cgst).toBe(750);
    expect(calculateGst({ amount: 140000, rate: 40, mode: "remove", supply: "inter" }).base).toBe(100000);
  });

  it("treats negative or missing amounts and rates safely", () => {
    expect(calculateGst({ amount: -50, rate: 18, mode: "add", supply: "intra" }).total).toBe(0);
    expect(calculateGst({ amount: 100, rate: Number.NaN, mode: "add", supply: "intra" }).total).toBe(100);
    expect(calculateGst({ amount: 100, rate: 500, mode: "add", supply: "intra" }).rate).toBe(100);
  });
});

describe("formatRate", () => {
  it("shows up to three decimals", () => {
    expect(formatRate(18)).toBe("18%");
    expect(formatRate(0.25)).toBe("0.25%");
    expect(formatRate(0.125)).toBe("0.125%");
  });
});
