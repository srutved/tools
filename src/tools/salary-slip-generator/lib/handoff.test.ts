import { describe, expect, it } from "vitest";
import { createSalarySlip } from "../defaults";
import { salarySlipExportSchema } from "../schema";
import { salaryFromQuery, slipWithSalary } from "./handoff";

const query = (text: string) => new URLSearchParams(text);

describe("salaryFromQuery", () => {
  it("reads the monthly amounts", () => {
    expect(salaryFromQuery(query("basic=50000&hra=25000&special=23200&pf=1800&pt=200&tds=0"))).toEqual({
      basic: 50000,
      hra: 25000,
      special: 23200,
      pf: 1800,
      pt: 200,
      tds: 0,
    });
  });

  it("rounds to rupees and ignores bad or negative values", () => {
    expect(salaryFromQuery(query("basic=50000.6&hra=abc&pf=-5"))).toMatchObject({
      basic: 50001,
      hra: 0,
      pf: 0,
      tds: 0,
    });
  });

  it("returns undefined without a usable salary", () => {
    expect(salaryFromQuery(query(""))).toBeUndefined();
    expect(salaryFromQuery(query("template=modern-teal"))).toBeUndefined();
    expect(salaryFromQuery(query("basic=abc&hra=0"))).toBeUndefined();
  });
});

describe("slipWithSalary", () => {
  it("fills the earnings and deductions, leaving out lines that are 0", () => {
    const salary = salaryFromQuery(query("basic=50000&hra=25000&special=23200&pf=1800&pt=200&tds=0"))!;
    const slip = slipWithSalary(createSalarySlip({ currency: "USD" }), salary);
    expect(slip.currency).toBe("INR");
    expect(slip.earnings.map(({ label, amount }) => [label, amount])).toEqual([
      ["Basic salary", 50000],
      ["House rent allowance (HRA)", 25000],
      ["Special allowance", 23200],
    ]);
    expect(slip.deductions.map(({ label, amount }) => [label, amount])).toEqual([
      ["Provident fund (PF)", 1800],
      ["Professional tax", 200],
    ]);
    expect(new Set([...slip.earnings, ...slip.deductions].map((item) => item.id)).size).toBe(5);
  });

  it("makes a slip that only needs the names before download", () => {
    const salary = salaryFromQuery(query("basic=50000&hra=25000&special=23200&pf=1800&pt=200&tds=1500"))!;
    const slip = slipWithSalary(createSalarySlip(), salary);
    const result = salarySlipExportSchema.safeParse(slip);
    const paths = result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
    expect(paths.sort()).toEqual(["company.name", "employee.name"]);
  });
});
