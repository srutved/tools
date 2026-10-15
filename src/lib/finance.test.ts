import { describe, expect, it } from "vitest";
import { clampInput, formatPercent, formatTenure, yearRowLabel } from "./finance";

describe("clampInput", () => {
  it("keeps positive numbers and caps them", () => {
    expect(clampInput(12.5)).toBe(12.5);
    expect(clampInput(150, 100)).toBe(100);
  });

  it("turns negatives, NaN and Infinity into 0", () => {
    expect(clampInput(-1)).toBe(0);
    expect(clampInput(Number.NaN)).toBe(0);
    expect(clampInput(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("formatPercent", () => {
  it("shows up to two decimals", () => {
    expect(formatPercent(7.1)).toBe("7.1%");
    expect(formatPercent(8.25)).toBe("8.25%");
    expect(formatPercent(12)).toBe("12%");
  });
});

describe("formatTenure", () => {
  it("writes months as years and months", () => {
    expect(formatTenure(30)).toBe("2 years 6 months");
    expect(formatTenure(12)).toBe("1 year");
    expect(formatTenure(13)).toBe("1 year 1 month");
    expect(formatTenure(5)).toBe("5 months");
    expect(formatTenure(0)).toBe("0 months");
  });
});

describe("yearRowLabel", () => {
  it("notes a final year that ends early", () => {
    expect(yearRowLabel(1, 30)).toBe("Year 1");
    expect(yearRowLabel(3, 30)).toBe("Year 3 (6 months)");
    expect(yearRowLabel(2, 24)).toBe("Year 2");
  });
});
