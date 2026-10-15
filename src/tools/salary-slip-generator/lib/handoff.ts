import { createPayItem } from "../defaults";
import type { SalarySlip } from "../schema";

/**
 * Monthly amounts the salary calculator passes in the URL, e.g.
 * /salary-slip-generator?basic=50000&hra=25000&special=23200&pf=1800&pt=200&tds=0.
 * ToolGate removes them from the address bar once read, so a reload doesn't add another slip.
 */
export const SALARY_HANDOFF_PARAMS = ["basic", "hra", "special", "pf", "pt", "tds"] as const;

export type SalaryHandoff = Record<(typeof SALARY_HANDOFF_PARAMS)[number], number>;

const MAX_AMOUNT = 1e9;

/** The salary in the query, or undefined if there isn't one (or none of the amounts is usable). */
export function salaryFromQuery(query: URLSearchParams): SalaryHandoff | undefined {
  const entries = SALARY_HANDOFF_PARAMS.map((name) => {
    const value = Number(query.get(name) ?? "");
    const amount = Number.isFinite(value) ? Math.min(Math.max(Math.round(value), 0), MAX_AMOUNT) : 0;
    return [name, amount] as const;
  });
  if (entries.every(([, amount]) => amount === 0)) return undefined;
  return Object.fromEntries(entries) as SalaryHandoff;
}

/**
 * A slip with the salary's earnings and deductions, in rupees. Basic salary is always listed;
 * other lines are left out when they're 0 (e.g. no PF).
 */
export function slipWithSalary(slip: SalarySlip, salary: SalaryHandoff): SalarySlip {
  const items = (lines: [string, number][]) =>
    lines
      .filter(([label, amount]) => amount > 0 || label === "Basic salary")
      .map(([label, amount]) => createPayItem(label, amount));
  return {
    ...slip,
    currency: "INR",
    earnings: items([
      ["Basic salary", salary.basic],
      ["House rent allowance (HRA)", salary.hra],
      ["Special allowance", salary.special],
    ]),
    deductions: items([
      ["Provident fund (PF)", salary.pf],
      ["Professional tax", salary.pt],
      ["Income tax (TDS)", salary.tds],
    ]),
  };
}
