import { describe, expect, it } from "vitest";
import { calculatePpf, PPF_DEFAULT_RATE, PPF_MAX_DEPOSIT, PPF_TENURES } from "./ppf";

describe("calculatePpf", () => {
  it("works out the maturity of the full ₹1.5 lakh a year for 15 years at 7.1%", () => {
    const result = calculatePpf({ yearlyDeposit: 150000, annualRate: 7.1, years: 15 });
    expect(result.invested).toBe(2250000);
    // The widely quoted figure: about ₹40.68 lakh.
    expect(result.maturity).toBeCloseTo(4068209.22, 2);
    expect(result.interest).toBeCloseTo(1818209.22, 2);
    expect(result.capped).toBe(false);
  });

  it("credits interest on the opening balance plus the year's deposit", () => {
    const result = calculatePpf({ yearlyDeposit: 100000, annualRate: 7.1, years: 3 });
    expect(result.yearly[0]).toEqual({
      year: 1,
      deposit: 100000,
      interest: 7100,
      closing: 107100,
      totalDeposits: 100000,
    });
    expect(result.yearly[1].interest).toBeCloseTo((107100 + 100000) * 0.071, 2);
    expect(result.yearly).toHaveLength(3);
    expect(result.yearly.at(-1)!.closing).toBe(result.maturity);
  });

  it("keeps growing through 5-year extensions", () => {
    const fifteen = calculatePpf({ yearlyDeposit: 50000, annualRate: 7.1, years: 15 });
    const twenty = calculatePpf({ yearlyDeposit: 50000, annualRate: 7.1, years: 20 });
    expect(twenty.yearly).toHaveLength(20);
    expect(twenty.yearly[14].closing).toBe(fifteen.maturity);
    expect(twenty.maturity).toBeGreaterThan(fifteen.maturity);
  });

  it("caps deposits at the yearly maximum and flags small ones", () => {
    const over = calculatePpf({ yearlyDeposit: 200000, annualRate: 7.1, years: 15 });
    expect(over.capped).toBe(true);
    expect(over.yearlyDeposit).toBe(PPF_MAX_DEPOSIT);
    expect(over.invested).toBe(2250000);

    const under = calculatePpf({ yearlyDeposit: 300, annualRate: 7.1, years: 15 });
    expect(under.belowMinimum).toBe(true);
    expect(calculatePpf({ yearlyDeposit: 500, annualRate: 7.1, years: 15 }).belowMinimum).toBe(false);
    expect(calculatePpf({ yearlyDeposit: 0, annualRate: 7.1, years: 15 }).belowMinimum).toBe(false);
  });

  it("treats missing or out-of-range inputs safely", () => {
    expect(calculatePpf({ yearlyDeposit: 0, annualRate: 7.1, years: 15 })).toMatchObject({
      years: 0,
      maturity: 0,
      yearly: [],
    });
    expect(calculatePpf({ yearlyDeposit: 1000, annualRate: Number.NaN, years: 15 }).maturity).toBe(15000);
  });
});

describe("PPF defaults", () => {
  it("start at 7.1% over 15 years, extendable 5 years at a time", () => {
    expect(PPF_DEFAULT_RATE).toBe(7.1);
    expect(PPF_TENURES[0]).toBe(15);
    expect(PPF_TENURES.every((years) => (years - 15) % 5 === 0)).toBe(true);
  });
});
