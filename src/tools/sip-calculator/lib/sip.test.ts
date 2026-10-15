import { describe, expect, it } from "vitest";
import { calculateSip, MAX_SIP_YEARS, sipFutureValue } from "./sip";

describe("sipFutureValue", () => {
  it("uses the start-of-month convention", () => {
    // ₹10,000 a month for 10 years at 12%: the widely quoted ₹23.23 lakh.
    expect(sipFutureValue(10000, 12, 120)).toBeCloseTo(2323390.76, 2);
    // One month: the instalment grows for that month.
    expect(sipFutureValue(1000, 12, 1)).toBeCloseTo(1010, 6);
  });

  it("is just the instalments added up at 0%", () => {
    expect(sipFutureValue(5000, 0, 24)).toBe(120000);
  });
});

describe("calculateSip", () => {
  it("matches the closed-form value without a step-up", () => {
    const result = calculateSip({ monthly: 10000, annualReturn: 12, years: 10 });
    expect(result.invested).toBe(1200000);
    expect(result.value).toBeCloseTo(sipFutureValue(10000, 12, 120), 2);
    expect(result.returns).toBeCloseTo(result.value - 1200000, 2);
    expect(result.months).toBe(120);
  });

  it("lists the value at the end of each year", () => {
    const result = calculateSip({ monthly: 10000, annualReturn: 12, years: 10 });
    expect(result.yearly).toHaveLength(10);
    expect(result.yearly[0]).toMatchObject({ year: 1, monthly: 10000, invested: 120000 });
    expect(result.yearly[0].value).toBeCloseTo(sipFutureValue(10000, 12, 12), 2);
    expect(result.yearly.at(-1)!.value).toBe(result.value);
  });

  it("raises the instalment every year with a step-up", () => {
    const result = calculateSip({ monthly: 10000, annualReturn: 12, years: 3, stepUp: 10 });
    expect(result.yearly.map((year) => year.monthly)).toEqual([10000, 11000, 12100]);
    expect(result.invested).toBe(12 * (10000 + 11000 + 12100));
    // Same as three level SIPs, each starting a year later and topped up by the extra.
    const expected =
      sipFutureValue(10000, 12, 36) + sipFutureValue(1000, 12, 24) + sipFutureValue(1100, 12, 12);
    expect(result.value).toBeCloseTo(expected, 2);
  });

  it("handles a part year at the end", () => {
    const result = calculateSip({ monthly: 1000, annualReturn: 0, years: 1.5 });
    expect(result.months).toBe(18);
    expect(result.yearly.map((year) => year.year)).toEqual([1, 2]);
    expect(result.value).toBe(18000);
    expect(result.returns).toBe(0);
  });

  it("treats missing or out-of-range inputs safely", () => {
    expect(calculateSip({ monthly: 0, annualReturn: 12, years: 10 })).toMatchObject({
      invested: 0,
      value: 0,
      months: 0,
      yearly: [],
    });
    expect(calculateSip({ monthly: 1000, annualReturn: Number.NaN, years: 1 }).value).toBe(12000);
    expect(calculateSip({ monthly: 1000, annualReturn: 12, years: 500 }).months).toBe(MAX_SIP_YEARS * 12);
    expect(calculateSip({ monthly: 1000, annualReturn: 12, years: 1, stepUp: -5 }).invested).toBe(12000);
  });
});
