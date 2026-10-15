/**
 * Turns the form into what the payslip prints: totals, net pay in words and the employee details
 * that were filled in. Pure and tolerant of half-filled forms, for the live preview.
 */

import { amountInWords } from "@/lib/amount-in-words";
import { formatMoney } from "@/lib/currency";
import { addMonths, dayOfMonth, formatDate, formatMonth, isMonth } from "@/lib/date";
import { roundTo, toFiniteNumber } from "@/lib/utils";
import type { PayItem, SalarySlip } from "../schema";

export interface PreparedPayItem {
  label: string;
  amount: string;
}

export interface PreparedPayslip {
  companyName: string;
  companyAddress: string;
  logo: string;
  /** e.g. "September 2026". */
  period: string;
  /** Label and value pairs, only for the details that were filled in. */
  details: { label: string; value: string }[];
  earnings: PreparedPayItem[];
  deductions: PreparedPayItem[];
  grossEarnings: string;
  totalDeductions: string;
  netPay: string;
  netPayInWords: string;
  notes: string;
}

const total = (items: PayItem[]) =>
  roundTo(
    items.reduce((sum, item) => sum + toFiniteNumber(item.amount), 0),
    2,
  );

/** Rows that say something: named, or with an amount. */
const shown = (items: PayItem[], currency: string): PreparedPayItem[] =>
  items
    .filter((item) => item.label.trim() || toFiniteNumber(item.amount) > 0)
    .map((item) => ({
      label: item.label.trim(),
      amount: formatMoney(toFiniteNumber(item.amount), currency),
    }));

export function payTotals(slip: Pick<SalarySlip, "earnings" | "deductions">) {
  const gross = total(slip.earnings);
  const deductions = total(slip.deductions);
  return { gross, deductions, net: roundTo(gross - deductions, 2) };
}

export function preparePayslip(slip: SalarySlip): PreparedPayslip {
  const { employee, currency } = slip;
  const { gross, deductions, net } = payTotals(slip);
  const working = toFiniteNumber(slip.workingDays);
  const paid = toFiniteNumber(slip.paidDays);

  const details = [
    { label: "Employee name", value: employee.name },
    { label: "Employee ID", value: employee.employeeId },
    { label: "Designation", value: employee.designation },
    { label: "Department", value: employee.department },
    { label: "Date of joining", value: employee.dateOfJoining ? formatDate(employee.dateOfJoining) : "" },
    { label: "PAN", value: employee.pan.toUpperCase() },
    { label: "UAN", value: employee.uan },
    { label: "Bank", value: employee.bankName },
    { label: "Account number", value: employee.bankAccount },
    { label: "Pay date", value: slip.payDate ? formatDate(slip.payDate) : "" },
    { label: "Working days", value: working ? String(working) : "" },
    { label: "Paid days", value: working ? String(paid) : "" },
    { label: "Loss of pay days", value: working > paid ? String(roundTo(working - paid, 1)) : "" },
  ].filter((detail) => detail.value.trim());

  return {
    companyName: slip.company.name.trim(),
    companyAddress: slip.company.address.trim(),
    logo: slip.company.logo,
    period: isMonth(slip.month) ? formatMonth(slip.month) : "",
    details,
    earnings: shown(slip.earnings, currency),
    deductions: shown(slip.deductions, currency),
    grossEarnings: formatMoney(gross, currency),
    totalDeductions: formatMoney(deductions, currency),
    netPay: formatMoney(Math.max(net, 0), currency),
    netPayInWords: amountInWords(Math.max(net, 0), currency),
    notes: slip.notes.trim(),
  };
}

/** The same employee and pay for the following month, paid on the same day of the month. */
export function nextMonthSlip(slip: SalarySlip): SalarySlip {
  if (!isMonth(slip.month)) return slip;
  const month = addMonths(slip.month, 1);
  const payDay = /^\d{4}-\d{2}-(\d{2})$/.exec(slip.payDate)?.[1];
  const payMonth = payDay ? addMonths(slip.payDate.slice(0, 7), 1) : "";
  const days = Number(dayOfMonth(month, 31).slice(8));
  const fullMonth = slip.workingDays === slip.paidDays && slip.workingDays >= 28;
  return {
    ...slip,
    month,
    payDate: payDay ? dayOfMonth(payMonth, Number(payDay)) : "",
    // A month paid in full stays in full; otherwise the days need checking anyway.
    workingDays: fullMonth ? days : slip.workingDays,
    paidDays: fullMonth ? days : slip.workingDays,
  };
}
