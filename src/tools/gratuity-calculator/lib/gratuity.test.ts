import { describe, expect, it } from "vitest";
import {
  calculateGratuity,
  formatService,
  gratuityWages,
  serviceBetween,
  yearsCounted,
  type GratuityInput,
} from "./gratuity";

const BASE: GratuityInput = {
  joiningDate: "2018-03-10",
  leavingDate: "2025-10-09",
  basicDa: 50000,
  totalPay: 0,
  employmentType: "permanent",
  covered: true,
};

describe("serviceBetween", () => {
  it("counts both the first and the last working day", () => {
    expect(serviceBetween("2018-04-01", "2026-03-31")).toEqual({ years: 8, months: 0, days: 0 });
    expect(serviceBetween("2026-01-05", "2026-01-05")).toEqual({ years: 0, months: 0, days: 1 });
  });

  it("works out completed years, months and days", () => {
    expect(serviceBetween("2018-03-10", "2025-10-09")).toEqual({ years: 7, months: 7, days: 0 });
    expect(serviceBetween("2018-03-10", "2025-08-09")).toEqual({ years: 7, months: 5, days: 0 });
    expect(serviceBetween("2021-04-01", "2026-03-30")).toEqual({ years: 4, months: 11, days: 30 });
    expect(serviceBetween("2019-11-20", "2026-05-25")).toEqual({ years: 6, months: 6, days: 6 });
  });

  it("is null for missing, impossible or backwards dates", () => {
    expect(serviceBetween("", "2026-01-01")).toBeNull();
    expect(serviceBetween("2026-02-30", "2026-03-31")).toBeNull();
    expect(serviceBetween("2026-03-01", "2026-02-28")).toBeNull();
  });
});

describe("yearsCounted", () => {
  it("counts a part-year of more than six months as a full year when covered", () => {
    expect(yearsCounted({ years: 7, months: 7, days: 0 }, true)).toBe(8);
    expect(yearsCounted({ years: 7, months: 5, days: 20 }, true)).toBe(7);
    expect(yearsCounted({ years: 7, months: 6, days: 0 }, true)).toBe(7);
    expect(yearsCounted({ years: 7, months: 6, days: 1 }, true)).toBe(8);
  });

  it("counts only completed years when not covered", () => {
    expect(yearsCounted({ years: 7, months: 11, days: 29 }, false)).toBe(7);
  });
});

describe("gratuityWages", () => {
  it("is basic + DA when that's at least half of total pay", () => {
    expect(gratuityWages(50000, 0)).toEqual({ wages: 50000, raised: false });
    expect(gratuityWages(50000, 100000)).toEqual({ wages: 50000, raised: false });
  });

  it("is raised to half of total pay when allowances are more than half", () => {
    expect(gratuityWages(30000, 80000)).toEqual({ wages: 40000, raised: true });
  });
});

describe("calculateGratuity", () => {
  it("uses 15/26 and rounds up the part-year for a covered employer", () => {
    const result = calculateGratuity(BASE);
    expect(result.yearsCounted).toBe(8);
    expect(result.roundedUp).toBe(true);
    expect(result.divisor).toBe(26);
    expect(result.gratuity).toBe(230769.23);
    expect(result.eligible).toBe(true);
    expect(result.taxFree).toBe(230769.23);
    expect(result.taxable).toBe(0);
  });

  it("uses 15/30 and completed years only when the employer isn't covered", () => {
    const result = calculateGratuity({ ...BASE, covered: false });
    expect(result.yearsCounted).toBe(7);
    expect(result.roundedUp).toBe(false);
    expect(result.gratuity).toBe(175000);
  });

  it("applies the 50% wages rule when total pay is given", () => {
    const result = calculateGratuity({ ...BASE, basicDa: 30000, totalPay: 80000 });
    expect(result.wages).toBe(40000);
    expect(result.wagesRaised).toBe(true);
    expect(result.gratuity).toBe(184615.38);
  });

  it("needs five years for permanent staff, but still shows the figure", () => {
    const result = calculateGratuity({ ...BASE, joiningDate: "2021-04-01", leavingDate: "2026-03-30" });
    expect(result.eligible).toBe(false);
    expect(result.minimumYears).toBe(5);
    expect(result.yearsCounted).toBe(5);
    expect(result.gratuity).toBe(144230.77);
    expect(
      calculateGratuity({ ...BASE, joiningDate: "2021-04-01", leavingDate: "2026-03-31" }).eligible,
    ).toBe(true);
  });

  it("pays fixed-term staff pro rata after one year", () => {
    const eligible = calculateGratuity({
      ...BASE,
      employmentType: "fixed-term",
      joiningDate: "2025-01-01",
      leavingDate: "2026-02-28",
    });
    expect(eligible.eligible).toBe(true);
    expect(eligible.yearsCounted).toBe(1);
    expect(eligible.gratuity).toBe(28846.15);

    const tooSoon = calculateGratuity({
      ...BASE,
      employmentType: "fixed-term",
      joiningDate: "2025-04-01",
      leavingDate: "2026-01-31",
    });
    expect(tooSoon.eligible).toBe(false);
    expect(tooSoon.minimumYears).toBe(1);
    expect(tooSoon.gratuity).toBe(28846.15);
  });

  it("splits the amount above ₹20 lakh as taxable", () => {
    const result = calculateGratuity({
      ...BASE,
      basicDa: 300000,
      joiningDate: "1996-04-01",
      leavingDate: "2026-03-31",
    });
    expect(result.yearsCounted).toBe(30);
    expect(result.gratuity).toBe(5192307.69);
    expect(result.aboveCap).toBe(true);
    expect(result.taxFree).toBe(2000000);
    expect(result.taxable).toBe(3192307.69);
  });

  it("says what's wrong with the dates", () => {
    expect(calculateGratuity({ ...BASE, leavingDate: "" }).datesProblem).toBe("missing");
    expect(calculateGratuity({ ...BASE, leavingDate: "2017-01-01" }).datesProblem).toBe("order");
    const result = calculateGratuity({ ...BASE, joiningDate: "" });
    expect(result.gratuity).toBe(0);
    expect(result.eligible).toBe(false);
  });

  it("ignores negative amounts", () => {
    expect(calculateGratuity({ ...BASE, basicDa: -5000, totalPay: -1 }).gratuity).toBe(0);
  });
});

describe("formatService", () => {
  it("reads naturally", () => {
    expect(formatService({ years: 7, months: 7, days: 0 })).toBe("7 years 7 months");
    expect(formatService({ years: 1, months: 0, days: 0 })).toBe("1 year");
    expect(formatService({ years: 0, months: 6, days: 1 })).toBe("6 months 1 day");
    expect(formatService({ years: 0, months: 0, days: 0 })).toBe("0 days");
  });
});
