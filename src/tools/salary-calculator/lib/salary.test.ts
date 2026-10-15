import { describe, expect, it } from "vitest";
import { calculateSalary, compareRegimes, monthlyPf, salarySlipQuery, type SalaryInput } from "./salary";

const BASE: SalaryInput = {
  ctc: 1200000,
  basicPercent: 50,
  hraPercent: 50,
  pf: "capped",
  gratuityIncluded: false,
  professionalTax: 200,
  regime: "new",
  rent: 0,
  city: "",
  otherDeductions: 0,
};

describe("monthlyPf", () => {
  it("is 12% of basic, optionally capped at ₹1,800", () => {
    expect(monthlyPf(50000, "full")).toBe(6000);
    expect(monthlyPf(50000, "capped")).toBe(1800);
    expect(monthlyPf(12000, "capped")).toBe(1440);
    expect(monthlyPf(50000, "none")).toBe(0);
  });
});

describe("calculateSalary", () => {
  it("turns ₹12 lakh CTC into in-hand pay with no tax in the new regime", () => {
    const result = calculateSalary(BASE);
    expect(result).toMatchObject({
      employerPf: 21600,
      gratuity: 0,
      gross: 1178400,
      basic: 600000,
      hra: 300000,
      special: 278400,
      employeePf: 21600,
      professionalTax: 2400,
      hraReduced: false,
    });
    expect(result.tax.taxableIncome).toBe(1103400);
    expect(result.tax.total).toBe(0);
    expect(result.inHand).toBe(1154400);
    expect(result.monthlyInHand).toBe(96200);
  });

  it("applies the HRA exemption and deductions in the old regime", () => {
    const result = calculateSalary({
      ...BASE,
      regime: "old",
      rent: 25000,
      city: "bengaluru",
      otherDeductions: 128400,
    });
    expect(result.tax.hraExemption).toBe(240000);
    expect(result.tax.otherDeductions).toBe(150000);
    expect(result.tax.professionalTax).toBe(2400);
    expect(result.tax.taxableIncome).toBe(736000);
    expect(result.tax.total).toBe(62088);
    expect(compareRegimes(result.taxes)).toEqual({ cheaper: "new", saving: 62088 });
  });

  it("takes full PF and gratuity out of the CTC", () => {
    const result = calculateSalary({
      ...BASE,
      ctc: 2500000,
      basicPercent: 40,
      pf: "full",
      gratuityIncluded: true,
    });
    expect(result.employerPf).toBe(120000);
    expect(result.gratuity).toBe(48100);
    expect(result.gross).toBe(2331900);
    expect(result.special).toBe(831900);
    expect(result.tax.total).toBe(274794);
    expect(result.inHand).toBe(1934706);
  });

  it("lowers HRA when it doesn't fit in the gross", () => {
    const result = calculateSalary({ ...BASE, ctc: 1000000, basicPercent: 80 });
    expect(result.hra).toBe(178400);
    expect(result.special).toBe(0);
    expect(result.hraReduced).toBe(true);
    expect(result.basic + result.hra + result.special).toBe(result.gross);
  });

  it("lowers basic when it's more than the gross", () => {
    const result = calculateSalary({ ...BASE, ctc: 300000, basicPercent: 100, pf: "full" });
    expect(result.gross).toBe(264000);
    expect(result.basic).toBe(264000);
    expect(result.basicReduced).toBe(true);
  });

  it("caps professional tax at ₹2,500 a year", () => {
    expect(calculateSalary({ ...BASE, professionalTax: 300 }).professionalTax).toBe(2500);
  });

  it("returns zeros for an empty CTC", () => {
    const result = calculateSalary({ ...BASE, ctc: 0, professionalTax: 0 });
    expect(result.gross).toBe(0);
    expect(result.monthlyInHand).toBe(0);
    expect(result.tax.total).toBe(0);
  });
});

describe("salarySlipQuery", () => {
  it("passes monthly amounts, rounded to rupees", () => {
    const query = new URLSearchParams(salarySlipQuery(calculateSalary(BASE)));
    expect(Object.fromEntries(query)).toEqual({
      basic: "50000",
      hra: "25000",
      special: "23200",
      pf: "1800",
      pt: "200",
      tds: "0",
    });
  });
});
