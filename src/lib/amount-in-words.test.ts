import { describe, expect, it } from "vitest";
import { amountInWords, numberToIndianWords, numberToWords } from "./amount-in-words";

describe("numberToWords", () => {
  it.each([
    [0, "Zero"],
    [7, "Seven"],
    [15, "Fifteen"],
    [40, "Forty"],
    [99, "Ninety Nine"],
    [100, "One Hundred"],
    [1005, "One Thousand Five"],
    [1_250_000, "One Million Two Hundred Fifty Thousand"],
    [3_000_000_001, "Three Billion One"],
  ])("%d → %s", (n, words) => {
    expect(numberToWords(n)).toBe(words);
  });
});

describe("numberToIndianWords", () => {
  it.each([
    [100_000, "One Lakh"],
    [120_500, "One Lakh Twenty Thousand Five Hundred"],
    [12_500_000, "One Crore Twenty Five Lakh"],
    [1_000_000_000, "One Hundred Crore"],
  ])("%d → %s", (n, words) => {
    expect(numberToIndianWords(n)).toBe(words);
  });
});

describe("amountInWords", () => {
  it("uses rupees, Indian grouping and paise for INR", () => {
    expect(amountInWords(120500.5, "INR")).toBe(
      "Indian Rupees One Lakh Twenty Thousand Five Hundred and Fifty Paise Only",
    );
  });

  it("uses international grouping and cents for USD", () => {
    expect(amountInWords(1250.75, "USD")).toBe(
      "One Thousand Two Hundred Fifty US Dollars and Seventy Five Cents Only",
    );
  });

  it("uses the singular currency name for one unit", () => {
    expect(amountInWords(1, "EUR")).toBe("One Euro Only");
  });

  it("omits minor units for zero-decimal currencies like JPY", () => {
    expect(amountInWords(5000, "JPY")).toBe("Five Thousand Japanese Yen Only");
  });

  it("supports three-decimal currencies", () => {
    expect(amountInWords(12.5, "KWD")).toBe("Twelve Kuwaiti Dinars and Five Hundred Fils Only");
  });

  it("falls back to a fraction when the minor unit name is unknown", () => {
    expect(amountInWords(10.5, "BRL")).toBe("Ten Brazilian Reals and 50/100 Only");
  });
});
