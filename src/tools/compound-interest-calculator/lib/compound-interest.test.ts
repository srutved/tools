import { describe, expect, it } from "vitest";
import { calculateCompoundInterest, MAX_CI_YEARS, type CompoundInput } from "./compound-interest";

const lumpSum: CompoundInput = {
  principal: 100000,
  annualRate: 10,
  years: 2,
  compounding: "yearly",
  depositFrequency: "none",
  deposit: 0,
};

describe("calculateCompoundInterest", () => {
  it("compounds a lump sum yearly, and compares it with simple interest", () => {
    const result = calculateCompoundInterest(lumpSum);
    expect(result.balance).toBe(121000);
    expect(result.interest).toBe(21000);
    expect(result.simpleInterest).toBe(20000);
    expect(result.deposits).toBe(0);
    expect(result.yearly.map((point) => point.balance)).toEqual([110000, 121000]);
  });

  it("compounds more often for a little more", () => {
    const at = (compounding: CompoundInput["compounding"]) =>
      calculateCompoundInterest({ ...lumpSum, annualRate: 8, years: 5, compounding }).balance;
    expect(at("half-yearly")).toBeCloseTo(100000 * 1.04 ** 10, 2);
    expect(at("quarterly")).toBeCloseTo(148594.74, 2);
    expect(at("monthly")).toBeCloseTo(100000 * (1 + 0.08 / 12) ** 60, 2);
    expect(at("daily")).toBeCloseTo(100000 * (1 + 0.08 / 365) ** 1825, 2);
    expect(at("daily")).toBeGreaterThan(at("monthly"));
    expect(at("monthly")).toBeGreaterThan(at("quarterly"));
  });

  it("adds yearly deposits at the end of each year", () => {
    const result = calculateCompoundInterest({
      ...lumpSum,
      principal: 0,
      years: 3,
      depositFrequency: "yearly",
      deposit: 10000,
    });
    expect(result.deposits).toBe(30000);
    expect(result.balance).toBeCloseTo(33100, 2);
    expect(result.simpleInterest).toBeCloseTo(3000, 2);
    expect(result.yearly.map((point) => point.putIn)).toEqual([10000, 20000, 30000]);
  });

  it("adds monthly deposits as an ordinary annuity", () => {
    const result = calculateCompoundInterest({
      principal: 0,
      annualRate: 12,
      years: 1,
      compounding: "monthly",
      depositFrequency: "monthly",
      deposit: 1000,
    });
    expect(result.balance).toBeCloseTo(1000 * ((1.01 ** 12 - 1) / 0.01), 2);
    expect(result.deposits).toBe(12000);
  });

  it("combines a lump sum with deposits", () => {
    const result = calculateCompoundInterest({
      ...lumpSum,
      depositFrequency: "yearly",
      deposit: 10000,
    });
    expect(result.balance).toBeCloseTo(121000 + 10000 * 1.1 + 10000, 2);
    expect(result.interest).toBeCloseTo(result.balance - 100000 - 20000, 2);
  });

  it("ends part-way through a year", () => {
    const result = calculateCompoundInterest({ ...lumpSum, years: 2.5 });
    expect(result.yearly.map((point) => point.years)).toEqual([1, 2, 2.5]);
    expect(result.balance).toBeCloseTo(100000 * 1.1 ** 2.5, 2);
    expect(result.simpleInterest).toBe(25000);
  });

  it("treats missing or out-of-range inputs safely", () => {
    expect(calculateCompoundInterest({ ...lumpSum, principal: 0 })).toMatchObject({
      balance: 0,
      interest: 0,
      simpleInterest: 0,
      yearly: [],
    });
    expect(calculateCompoundInterest({ ...lumpSum, annualRate: 0 }).balance).toBe(100000);
    expect(calculateCompoundInterest({ ...lumpSum, years: 1000 }).years).toBe(MAX_CI_YEARS);
    // A deposit amount is ignored while regular deposits are switched off.
    expect(calculateCompoundInterest({ ...lumpSum, deposit: 5000 }).deposits).toBe(0);
  });
});
