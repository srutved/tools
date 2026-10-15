import { describe, expect, it } from "vitest";
import { calculateRd, MAX_RD_MONTHS } from "./rd";

describe("calculateRd", () => {
  it("matches the usual bank example of ₹5,000 a month for a year at 7%", () => {
    const result = calculateRd({ monthly: 5000, annualRate: 7, months: 12 });
    expect(result.invested).toBe(60000);
    /*
     * The commonly quoted figure is about ₹62,315. Summing each instalment with quarterly
     * compounding for the months it has been in gives ₹62,310.66: the same as the closed form
     * M = R × ((1 + i)^n − 1) ÷ (1 − (1 + i)^(−1/3)) with i = r ÷ 400 and n quarters. Published
     * examples differ by a few rupees because banks round interest at each quarterly credit and
     * some accrue simple interest within a quarter, so we accept anything within ₹10 of it.
     */
    expect(result.maturity).toBeCloseTo(62310.66, 2);
    expect(Math.abs(result.maturity - 62315)).toBeLessThan(10);
    expect(result.interest).toBeCloseTo(2310.66, 2);
  });

  it("agrees with the closed-form RD formula", () => {
    const i = 6.5 / 400;
    const quarters = 60 / 3;
    const closedForm = (2000 * ((1 + i) ** quarters - 1)) / (1 - (1 + i) ** (-1 / 3));
    expect(calculateRd({ monthly: 2000, annualRate: 6.5, months: 60 }).maturity).toBeCloseTo(closedForm, 2);
  });

  it("lists the value at the end of each year, with a part year at the end", () => {
    const result = calculateRd({ monthly: 1000, annualRate: 7, months: 30 });
    expect(result.yearly.map((year) => year.months)).toEqual([12, 12, 6]);
    expect(result.yearly.map((year) => year.deposited)).toEqual([12000, 24000, 30000]);
    expect(result.yearly[0].value).toBeCloseTo(
      calculateRd({ monthly: 1000, annualRate: 7, months: 12 }).maturity,
      2,
    );
    expect(result.yearly.at(-1)!.value).toBe(result.maturity);
  });

  it("earns nothing at 0%", () => {
    expect(calculateRd({ monthly: 1000, annualRate: 0, months: 12 })).toMatchObject({
      invested: 12000,
      interest: 0,
      maturity: 12000,
    });
  });

  it("treats missing or out-of-range inputs safely", () => {
    expect(calculateRd({ monthly: 0, annualRate: 7, months: 12 })).toMatchObject({
      months: 0,
      maturity: 0,
      yearly: [],
    });
    expect(calculateRd({ monthly: 1000, annualRate: 7, months: 999 }).months).toBe(MAX_RD_MONTHS);
    expect(calculateRd({ monthly: 1000, annualRate: -3, months: 12 }).maturity).toBe(12000);
  });
});
