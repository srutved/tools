import { z } from "zod";
import { isMonth } from "@/lib/date";

export const payItemSchema = z.object({
  id: z.string(),
  label: z.string().max(80),
  amount: z.number().min(0, "Amounts can't be negative"),
});

export type PayItem = z.infer<typeof payItemSchema>;

/** Shape of a saved salary slip. Lenient on purpose: drafts are allowed to be incomplete. */
export const salarySlipSchema = z.object({
  templateId: z.string(),
  currency: z.string().length(3),
  company: z.object({
    name: z.string().max(120),
    address: z.string().max(300),
    /** PNG data URL, already downscaled. */
    logo: z.string(),
  }),
  employee: z.object({
    name: z.string().max(120),
    employeeId: z.string().max(40),
    designation: z.string().max(80),
    department: z.string().max(80),
    /** ISO date, or "". */
    dateOfJoining: z.string(),
    pan: z.string().max(10),
    /** Universal Account Number for Provident Fund (India). */
    uan: z.string().max(20),
    bankName: z.string().max(80),
    bankAccount: z.string().max(40),
  }),
  /** The month the salary is for, "YYYY-MM". */
  month: z.string(),
  /** ISO date the salary was paid, or "". */
  payDate: z.string(),
  workingDays: z.number().min(0, "Enter 0 or more days").max(31, "A month has at most 31 days"),
  paidDays: z.number().min(0, "Enter 0 or more days").max(31, "A month has at most 31 days"),
  earnings: z.array(payItemSchema).max(20),
  deductions: z.array(payItemSchema).max(20),
  notes: z.string().max(500),
});

export type SalarySlip = z.infer<typeof salarySlipSchema>;

const sum = (items: PayItem[]) => items.reduce((total, item) => total + (Number(item.amount) || 0), 0);

/** Stricter rules applied before a slip is downloaded or printed. */
export const salarySlipExportSchema = salarySlipSchema.superRefine((slip, ctx) => {
  const issue = (path: (string | number)[], message: string) =>
    ctx.addIssue({ code: "custom", path, message });
  if (!slip.company.name.trim()) issue(["company", "name"], "Add the company's name");
  if (!slip.employee.name.trim()) issue(["employee", "name"], "Add the employee's name");
  if (!isMonth(slip.month)) issue(["month"], "Choose the month");
  if (slip.paidDays > slip.workingDays) issue(["paidDays"], "Paid days can't be more than working days");
  slip.earnings.forEach((item, index) => {
    if (item.amount > 0 && !item.label.trim()) issue(["earnings", index, "label"], "Name this earning");
  });
  slip.deductions.forEach((item, index) => {
    if (item.amount > 0 && !item.label.trim()) issue(["deductions", index, "label"], "Name this deduction");
  });
  const gross = sum(slip.earnings);
  if (gross <= 0) issue(["earnings"], "Add at least one earning, such as basic salary");
  else if (sum(slip.deductions) > gross) issue(["deductions"], "Deductions can't be more than the earnings");
});
