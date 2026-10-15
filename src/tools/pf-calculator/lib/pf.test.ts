import { describe, expect, it } from "vitest";
import { monthlyContribution, projectPf, type PfInput } from "./pf";

const BASE: PfInput = {
  currentAge: 30,
  retirementAge: 31,
  monthlyBasic: 0,
  salaryIncrease: 0,
  currentBalance: 0,
  interestRate: 0,
  basis: "full",
  vpfPercent: 0,
};

describe("monthlyContribution", () => {
  it("splits the employer's 12% between EPS (at most ₹1,250) and EPF", () => {
    expect(monthlyContribution(50000, "full", 0)).toEqual({
      employee: 6000,
      vpf: 0,
      employerTotal: 6000,
      eps: 1250,
      employerEpf: 4750,
    });
  });

  it("is ₹1,800 from each side on the ₹15,000 wage ceiling", () => {
    expect(monthlyContribution(50000, "ceiling", 0)).toMatchObject({
      employee: 1800,
      eps: 1250,
      employerEpf: 550,
    });
    expect(monthlyContribution(12000, "ceiling", 0)).toMatchObject({
      employee: 1440,
      eps: 1000,
      employerEpf: 440,
    });
  });

  it("adds voluntary PF on the full basic", () => {
    expect(monthlyContribution(50000, "ceiling", 10).vpf).toBe(5000);
  });

  it("sends the employer's whole share to EPF once EPS stops at 58", () => {
    expect(monthlyContribution(50000, "full", 0, false)).toMatchObject({ eps: 0, employerEpf: 6000 });
  });

  it("ignores negative amounts", () => {
    expect(monthlyContribution(-1, "full", -5)).toMatchObject({
      employee: 0,
      vpf: 0,
      eps: 0,
      employerEpf: 0,
    });
  });
});

describe("projectPf", () => {
  it("compounds interest yearly on an existing balance", () => {
    const result = projectPf({ ...BASE, retirementAge: 32, currentBalance: 100000, interestRate: 12 });
    expect(result.years.map((year) => year.closingBalance)).toEqual([112000, 125440]);
    expect(result.corpus).toBe(125440);
    expect(result.totalInterest).toBe(25440);
  });

  it("starts paying interest on a contribution from the following month", () => {
    const result = projectPf({ ...BASE, monthlyBasic: 15000, basis: "ceiling", interestRate: 12 });
    // ₹2,350 a month (₹1,800 + ₹550): interest is 1% a month on 0, 2,350, 4,700 … 25,850.
    expect(result.totalEmployee).toBe(21600);
    expect(result.totalEmployerEpf).toBe(6600);
    expect(result.totalEps).toBe(15000);
    expect(result.totalInterest).toBe(1551);
    expect(result.corpus).toBe(29751);
  });

  it("raises the salary once a year", () => {
    const result = projectPf({ ...BASE, retirementAge: 32, monthlyBasic: 10000, salaryIncrease: 10 });
    expect(result.years.map((year) => year.monthlyBasic)).toEqual([10000, 11000]);
    expect(result.years[0]).toMatchObject({ employee: 14400, employerEpf: 4404, eps: 9996 });
    expect(result.years[1]).toMatchObject({ employee: 15840, employerEpf: 4848, eps: 10992 });
    expect(result.corpus).toBe(39492);
  });

  it("stops EPS contributions at 58", () => {
    const result = projectPf({ ...BASE, currentAge: 57, retirementAge: 59, monthlyBasic: 50000 });
    expect(result.years[0]).toMatchObject({ age: 57, eps: 15000, employerEpf: 57000 });
    expect(result.years[1]).toMatchObject({ age: 58, eps: 0, employerEpf: 72000 });
    expect(result.totalEps).toBe(15000);
  });

  it("counts VPF as the employee's money", () => {
    const result = projectPf({ ...BASE, monthlyBasic: 50000, vpfPercent: 10 });
    expect(result.totalVpf).toBe(60000);
    expect(result.totalEmployee).toBe(132000);
    expect(result.corpus).toBe(132000 + 57000);
  });

  it("credits interest at retirement for a final part-year", () => {
    const result = projectPf({ ...BASE, retirementAge: 30.5, currentBalance: 120000, interestRate: 12 });
    expect(result.months).toBe(6);
    expect(result.years).toHaveLength(1);
    expect(result.years[0].months).toBe(6);
    expect(result.corpus).toBe(127200);
  });

  it("parts add up to the corpus", () => {
    const result = projectPf({
      currentAge: 25,
      retirementAge: 58,
      monthlyBasic: 30000,
      salaryIncrease: 5,
      currentBalance: 50000,
      interestRate: 8.25,
      basis: "full",
      vpfPercent: 0,
    });
    expect(result.years).toHaveLength(33);
    expect(result.corpus).toBeCloseTo(
      result.openingBalance + result.totalEmployee + result.totalEmployerEpf + result.totalInterest,
      2,
    );
    expect(result.corpus).toBe(result.years.at(-1)!.closingBalance);
    expect(result.corpus).toBeGreaterThan(10000000);
  });

  it("returns the current balance when already at retirement age", () => {
    const result = projectPf({ ...BASE, currentAge: 60, retirementAge: 58, currentBalance: 500000 });
    expect(result.months).toBe(0);
    expect(result.years).toEqual([]);
    expect(result.corpus).toBe(500000);
    expect(result.totalInterest).toBe(0);
  });
});
