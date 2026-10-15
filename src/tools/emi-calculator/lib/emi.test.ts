import { describe, expect, it } from "vitest";
import { calculateEmi, emiFormula, LOAN_PRESETS, MAX_LOAN_MONTHS } from "./emi";

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

describe("emiFormula", () => {
  it("matches the standard reducing-balance EMI", () => {
    // ₹50 lakh at 8.5% for 20 years: the widely quoted ₹43,391.
    expect(emiFormula(5000000, 8.5, 240)).toBeCloseTo(43391.16, 2);
    // ₹1 lakh at 12% for 12 months.
    expect(emiFormula(100000, 12, 12)).toBeCloseTo(8884.88, 2);
  });

  it("divides the loan evenly at 0%", () => {
    expect(emiFormula(120000, 0, 12)).toBe(10000);
  });

  it("is 0 without a loan or a tenure", () => {
    expect(emiFormula(0, 8.5, 240)).toBe(0);
    expect(emiFormula(100000, 8.5, 0)).toBe(0);
  });
});

describe("calculateEmi", () => {
  const home = calculateEmi({ principal: 5000000, annualRate: 8.5, months: 240 });

  it("works out the EMI and totals", () => {
    expect(home.emi).toBe(43391.16);
    expect(home.totalPayment).toBeCloseTo(43391.161668 * 240, 1);
    expect(home.totalInterest).toBeCloseTo(home.totalPayment - 5000000, 2);
    expect(home.totalInterest).toBeCloseTo(5413878.8, 0);
  });

  it("builds a month-by-month schedule that repays the loan exactly", () => {
    expect(home.schedule).toHaveLength(240);
    expect(home.schedule[0].interest).toBeCloseTo(35416.67, 2);
    expect(home.schedule[0].principal).toBeCloseTo(7974.5, 2);
    expect(home.schedule.at(-1)!.balance).toBe(0);
    expect(sum(home.schedule.map((row) => row.principal))).toBeCloseTo(5000000, 0);
    expect(sum(home.schedule.map((row) => row.interest))).toBeCloseTo(home.totalInterest, 0);
  });

  it("groups the schedule into loan years", () => {
    expect(home.yearly).toHaveLength(20);
    expect(home.yearly[0].months).toBe(12);
    // Early on most of the EMI is interest; by the last year it's mostly principal.
    expect(home.yearly[0].interest).toBeGreaterThan(home.yearly[0].principal);
    expect(home.yearly[19].principal).toBeGreaterThan(home.yearly[19].interest);
    expect(home.yearly[19].balance).toBe(0);
    expect(home.yearly[0].balance).toBe(home.schedule[11].balance);
  });

  it("handles a tenure that ends part-way through a year", () => {
    const result = calculateEmi({ principal: 300000, annualRate: 10, months: 30 });
    expect(result.yearly.map((year) => year.months)).toEqual([12, 12, 6]);
    expect(result.yearly[2].balance).toBe(0);
  });

  it("charges no interest at 0%", () => {
    const result = calculateEmi({ principal: 120000, annualRate: 0, months: 12 });
    expect(result.emi).toBe(10000);
    expect(result.totalInterest).toBe(0);
    expect(result.schedule.every((row) => row.interest === 0)).toBe(true);
  });

  it("treats missing or out-of-range inputs safely", () => {
    const empty = calculateEmi({ principal: 0, annualRate: 0, months: 0 });
    expect(empty).toMatchObject({ emi: 0, totalInterest: 0, totalPayment: 0, schedule: [], yearly: [] });
    expect(calculateEmi({ principal: -5, annualRate: 9, months: 12 }).emi).toBe(0);
    expect(calculateEmi({ principal: 100000, annualRate: Number.NaN, months: 12 }).annualRate).toBe(0);
    expect(calculateEmi({ principal: 100000, annualRate: 9, months: 10000 }).months).toBe(MAX_LOAN_MONTHS);
    expect(calculateEmi({ principal: 100000, annualRate: 9, months: 12.4 }).months).toBe(12);
  });
});

describe("LOAN_PRESETS", () => {
  it("covers the four common loans with typical figures", () => {
    expect(LOAN_PRESETS.map((preset) => preset.id)).toEqual(["home", "car", "personal", "education"]);
    for (const preset of LOAN_PRESETS) {
      expect(preset.rate).toBeGreaterThan(0);
      expect(preset.years * 12).toBeLessThanOrEqual(MAX_LOAN_MONTHS);
    }
  });
});
