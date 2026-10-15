import { describe, expect, it } from "vitest";
import { amountToInput, parseAmount, sanitiseAmountInput } from "./parse-amount";

describe("parseAmount", () => {
  it("reads plain and grouped numbers", () => {
    expect(parseAmount("1200")).toBe(1200);
    expect(parseAmount("1,20,000")).toBe(120000);
    expect(parseAmount("120,000.50")).toBe(120000.5);
    expect(parseAmount("₹ 25,000")).toBe(25000);
  });

  it("treats empty or half-typed input as 0", () => {
    expect(parseAmount("")).toBe(0);
    expect(parseAmount(".")).toBe(0);
    expect(parseAmount("abc")).toBe(0);
    expect(parseAmount("1.2.3")).toBe(0);
  });
});

describe("sanitiseAmountInput", () => {
  it("drops letters and signs but keeps digits, commas and the decimal point", () => {
    expect(sanitiseAmountInput("₹1,20,000.5x")).toBe("1,20,000.5");
    expect(sanitiseAmountInput("-500")).toBe("500");
  });
});

describe("amountToInput", () => {
  it("writes numbers without grouping and blanks zero", () => {
    expect(amountToInput(12000)).toBe("12000");
    expect(amountToInput(1000 / 12)).toBe("83.33");
    expect(amountToInput(0)).toBe("");
  });
});
