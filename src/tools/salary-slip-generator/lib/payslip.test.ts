import { describe, expect, it } from "vitest";
import { SAMPLE_SALARY_SLIP } from "../sample";
import { salarySlipExportSchema, type SalarySlip } from "../schema";
import { nextMonthSlip, payTotals, preparePayslip } from "./payslip";

const errorPaths = (slip: SalarySlip) => {
  const result = salarySlipExportSchema.safeParse(slip);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
};

describe("preparePayslip", () => {
  it("totals earnings and deductions and writes net pay in words", () => {
    expect(payTotals(SAMPLE_SALARY_SLIP)).toEqual({ gross: 80000, deductions: 8500, net: 71500 });
    const prepared = preparePayslip(SAMPLE_SALARY_SLIP);
    expect(prepared.period).toBe("September 2026");
    expect(prepared.grossEarnings).toBe("₹80,000.00");
    expect(prepared.netPay).toBe("₹71,500.00");
    expect(prepared.netPayInWords).toBe("Indian Rupees Seventy One Thousand Five Hundred Only");
  });

  it("lists only the employee details that were filled in", () => {
    const prepared = preparePayslip({
      ...SAMPLE_SALARY_SLIP,
      employee: { ...SAMPLE_SALARY_SLIP.employee, uan: "", department: "" },
    });
    const labels = prepared.details.map((detail) => detail.label);
    expect(labels).not.toContain("UAN");
    expect(labels).not.toContain("Department");
    expect(labels).not.toContain("Loss of pay days");
    expect(labels).toContain("Employee ID");
  });

  it("shows loss of pay days when fewer days are paid", () => {
    const prepared = preparePayslip({ ...SAMPLE_SALARY_SLIP, paidDays: 28 });
    expect(prepared.details.find((detail) => detail.label === "Loss of pay days")?.value).toBe("2");
  });

  it("skips empty rows but keeps named ones", () => {
    const prepared = preparePayslip({
      ...SAMPLE_SALARY_SLIP,
      deductions: [
        { id: "a", label: "Income tax (TDS)", amount: 0 },
        { id: "b", label: "", amount: 0 },
      ],
    });
    expect(prepared.deductions).toEqual([{ label: "Income tax (TDS)", amount: "₹0.00" }]);
  });
});

describe("nextMonthSlip", () => {
  it("moves to the next month and its pay date, adjusting a full month's days", () => {
    const next = nextMonthSlip(SAMPLE_SALARY_SLIP);
    expect(next.month).toBe("2026-10");
    expect(next.payDate).toBe("2026-10-30");
    expect(next.workingDays).toBe(31);
    expect(next.paidDays).toBe(31);
  });

  it("clamps the pay date to short months", () => {
    const next = nextMonthSlip({ ...SAMPLE_SALARY_SLIP, month: "2027-01", payDate: "2027-01-31" });
    expect(next.payDate).toBe("2027-02-28");
  });
});

describe("salarySlipExportSchema", () => {
  it("accepts the sample", () => {
    expect(errorPaths(SAMPLE_SALARY_SLIP)).toEqual([]);
  });

  it("needs names and at least one earning", () => {
    expect(
      errorPaths({
        ...SAMPLE_SALARY_SLIP,
        company: { ...SAMPLE_SALARY_SLIP.company, name: "" },
        employee: { ...SAMPLE_SALARY_SLIP.employee, name: " " },
        earnings: [{ id: "a", label: "Basic salary", amount: 0 }],
      }),
    ).toEqual(["company.name", "employee.name", "earnings"]);
  });

  it("rejects more paid days than working days, and deductions above earnings", () => {
    expect(
      errorPaths({
        ...SAMPLE_SALARY_SLIP,
        paidDays: 31,
        deductions: [{ id: "a", label: "Advance recovery", amount: 90000 }],
      }),
    ).toEqual(["paidDays", "deductions"]);
  });
});
