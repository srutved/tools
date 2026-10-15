import { describe, expect, it } from "vitest";
import { calculateFd, fdValue, MAX_FD_MONTHS } from "./fd";

describe("fdValue", () => {
  it("compounds at the chosen frequency", () => {
    // ₹1 lakh at 7% for 5 years.
    expect(fdValue(100000, 7, 5, "quarterly")).toBeCloseTo(141477.82, 2);
    expect(fdValue(100000, 7, 5, "yearly")).toBeCloseTo(140255.17, 2);
    expect(fdValue(100000, 7, 5, "monthly")).toBeCloseTo(141762.5, 1);
    expect(fdValue(100000, 7, 1, "half-yearly")).toBeCloseTo(107122.5, 2);
  });
});

describe("calculateFd", () => {
  const payoutFd = { principal: 500000, annualRate: 7.2, months: 36, compounding: "quarterly" } as const;

  it("works out a cumulative FD with quarterly compounding", () => {
    const result = calculateFd({
      principal: 100000,
      annualRate: 7,
      months: 60,
      compounding: "quarterly",
      payout: "cumulative",
    });
    expect(result.maturity).toBeCloseTo(141477.82, 2);
    expect(result.totalInterest).toBeCloseTo(41477.82, 2);
    expect(result.periodicPayout).toBe(0);
    expect(result.yearly).toHaveLength(5);
    expect(result.yearly[0].interest).toBeCloseTo(7185.903, 2);
    // Each year earns more than the last, as interest earns interest.
    expect(result.yearly[4].interest).toBeGreaterThan(result.yearly[0].interest);
    expect(result.yearly.at(-1)!.balance).toBe(result.maturity);
  });

  it("handles a term in years and months", () => {
    const result = calculateFd({
      principal: 50000,
      annualRate: 6.5,
      months: 30,
      compounding: "quarterly",
      payout: "cumulative",
    });
    expect(result.yearly.map((year) => year.months)).toEqual([12, 12, 6]);
    expect(result.maturity).toBeCloseTo(50000 * (1 + 0.065 / 4) ** 10, 2);
  });

  it("pays simple interest monthly or quarterly and returns the deposit", () => {
    const monthly = calculateFd({ ...payoutFd, payout: "monthly" });
    expect(monthly.periodicPayout).toBe(3000);
    expect(monthly.totalInterest).toBe(108000);
    expect(monthly.maturity).toBe(500000);
    expect(monthly.yearly.map((year) => year.interest)).toEqual([36000, 36000, 36000]);
    expect(monthly.yearly.every((year) => year.balance === 500000)).toBe(true);

    const quarterly = calculateFd({ ...payoutFd, payout: "quarterly" });
    expect(quarterly.periodicPayout).toBe(9000);
    expect(quarterly.totalInterest).toBe(108000);
  });

  it("treats missing or out-of-range inputs safely", () => {
    const empty = calculateFd({
      principal: 0,
      annualRate: 7,
      months: 12,
      compounding: "quarterly",
      payout: "cumulative",
    });
    expect(empty).toMatchObject({ totalInterest: 0, maturity: 0, yearly: [] });
    const capped = calculateFd({
      principal: 1000,
      annualRate: 7,
      months: 5000,
      compounding: "yearly",
      payout: "cumulative",
    });
    expect(capped.months).toBe(MAX_FD_MONTHS);
    const noRate = calculateFd({
      principal: 1000,
      annualRate: Number.NaN,
      months: 12,
      compounding: "yearly",
      payout: "cumulative",
    });
    expect(noRate.maturity).toBe(1000);
  });
});
