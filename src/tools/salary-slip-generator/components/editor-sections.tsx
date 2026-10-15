"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { get, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { FieldRow, FormSection } from "@/components/tool/form";
import { NumberField, SelectField, TextAreaField, TextField } from "@/components/tool/form-fields";
import { ImageField } from "@/components/tool/image-field";
import { MonthField } from "@/components/tool/month-field";
import { Button } from "@/components/ui/button";
import { formatMoney, getCurrencyOptions, POPULAR_CURRENCIES } from "@/lib/currency";
import { currentMonth } from "@/lib/date";
import { createPayItem } from "../defaults";
import { payTotals } from "../lib/payslip";
import type { SalarySlip } from "../schema";

const THIS_YEAR = Number(currentMonth().slice(0, 4));
const YEARS = Array.from({ length: 5 }, (_, index) => THIS_YEAR - 3 + index);

export function CompanySection() {
  return (
    <FormSection title="Company" description="Saved with the slip, so next month's is quicker.">
      <ImageField<SalarySlip> name="company.logo" label="Logo (optional)" />
      <TextField<SalarySlip>
        name="company.name"
        label="Company name"
        placeholder="e.g. Bluefin Technologies Pvt Ltd"
        autoComplete="organization"
      />
      <TextAreaField<SalarySlip>
        name="company.address"
        label="Address"
        rows={2}
        placeholder="e.g. 4th Floor, Prestige Tech Park, Outer Ring Road, Bengaluru, Karnataka 560103"
      />
    </FormSection>
  );
}

export function EmployeeSection() {
  return (
    <FormSection title="Employee">
      <FieldRow>
        <TextField<SalarySlip> name="employee.name" label="Name" placeholder="e.g. Priya Nair" />
        <TextField<SalarySlip>
          name="employee.employeeId"
          label="Employee ID (optional)"
          placeholder="e.g. BT-0142"
        />
      </FieldRow>
      <FieldRow>
        <TextField<SalarySlip>
          name="employee.designation"
          label="Designation"
          placeholder="e.g. Software Engineer"
        />
        <TextField<SalarySlip>
          name="employee.department"
          label="Department (optional)"
          placeholder="e.g. Engineering"
        />
      </FieldRow>
      <FieldRow>
        <TextField<SalarySlip> name="employee.dateOfJoining" label="Date of joining (optional)" type="date" />
        <TextField<SalarySlip> name="employee.pan" label="PAN (optional)" placeholder="e.g. ABCPN1234K" />
      </FieldRow>
      <FieldRow>
        <TextField<SalarySlip>
          name="employee.bankName"
          label="Bank (optional)"
          placeholder="e.g. HDFC Bank"
        />
        <TextField<SalarySlip>
          name="employee.bankAccount"
          label="Account number (optional)"
          placeholder="e.g. XXXXXXXX4321"
          hint="Many payslips show only the last four digits."
        />
      </FieldRow>
      <TextField<SalarySlip>
        name="employee.uan"
        label="UAN (optional)"
        placeholder="e.g. 100987654321"
        hint="The employee's 12-digit Provident Fund account number, if they have one."
        className="sm:w-1/2"
      />
    </FormSection>
  );
}

export function PayPeriodSection() {
  const currencies = useMemo(() => getCurrencyOptions(), []);
  const popular = currencies.filter((option) => POPULAR_CURRENCIES.includes(option.code));
  return (
    <FormSection title="Pay period">
      <FieldRow>
        <MonthField<SalarySlip> name="month" label="Salary for" years={YEARS} />
        <TextField<SalarySlip> name="payDate" label="Paid on" type="date" />
      </FieldRow>
      <FieldRow>
        <NumberField<SalarySlip>
          name="workingDays"
          label="Working days"
          step={0.5}
          placeholder="e.g. 30"
          hint="Days payable in the month."
        />
        <NumberField<SalarySlip>
          name="paidDays"
          label="Paid days"
          step={0.5}
          placeholder="e.g. 30"
          hint="Fewer than working days shows loss of pay."
        />
      </FieldRow>
      <SelectField<SalarySlip> name="currency" label="Currency" className="sm:w-1/2">
        <optgroup label="Popular">
          {popular.map((option) => (
            <option key={option.code} value={option.code}>
              {option.code} - {option.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="All currencies">
          {currencies.map((option) => (
            <option key={option.code} value={option.code}>
              {option.code} - {option.name}
            </option>
          ))}
        </optgroup>
      </SelectField>
    </FormSection>
  );
}

const SUGGESTIONS = {
  earnings: [
    "Basic salary",
    "House rent allowance (HRA)",
    "Special allowance",
    "Dearness allowance (DA)",
    "Conveyance allowance",
    "Medical allowance",
    "Leave travel allowance (LTA)",
    "Bonus",
    "Overtime",
    "Incentive",
    "Arrears",
  ],
  deductions: [
    "Provident fund (PF)",
    "Employee State Insurance (ESI)",
    "Professional tax",
    "Income tax (TDS)",
    "Labour welfare fund",
    "Loan recovery",
    "Advance recovery",
    "Loss of pay",
  ],
};

function PayItems({ name, title }: { name: "earnings" | "deductions"; title: string }) {
  const { control, formState } = useFormContext<SalarySlip>();
  const { fields, append, remove } = useFieldArray({ control, name, keyName: "key" });
  const listError = get(formState.errors, name);
  const message = (listError?.message ?? listError?.root?.message) as string | undefined;
  const listId = `${name}-suggestions`;
  const noun = name === "earnings" ? "earning" : "deduction";

  return (
    <div>
      <p className="text-sm font-bold">{title}</p>
      <datalist id={listId}>
        {SUGGESTIONS[name].map((label) => (
          <option key={label} value={label} />
        ))}
      </datalist>
      <div className="mt-2 space-y-3">
        {fields.map((field, index) => (
          <div key={field.key} className="flex items-start gap-2">
            <div className="grid flex-1 gap-2 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <TextField<SalarySlip>
                name={`${name}.${index}.label`}
                label={index === 0 ? "Component" : `Component ${index + 1}`}
                placeholder={`e.g. ${SUGGESTIONS[name][index % SUGGESTIONS[name].length]}`}
                list={listId}
              />
              <NumberField<SalarySlip> name={`${name}.${index}.amount`} label="Amount" placeholder="0" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="mt-7"
              onClick={() => remove(index)}
              aria-label={`Remove ${noun} ${index + 1}`}
            >
              <Trash2 className="text-muted" />
            </Button>
          </div>
        ))}
      </div>
      {message && <p className="mt-2 text-sm font-medium text-danger">{message}</p>}
      <Button variant="outline" size="sm" className="mt-3" onClick={() => append(createPayItem())}>
        <Plus /> Add {noun}
      </Button>
    </div>
  );
}

export function PaySection() {
  const earnings = useWatch<SalarySlip, "earnings">({ name: "earnings" });
  const deductions = useWatch<SalarySlip, "deductions">({ name: "deductions" });
  const currency = useWatch<SalarySlip, "currency">({ name: "currency" });
  const totals = payTotals({ earnings: earnings ?? [], deductions: deductions ?? [] });

  return (
    <FormSection
      title="Salary"
      description="Monthly amounts for this slip. Pick a suggestion or type your own."
    >
      <PayItems name="earnings" title="Earnings" />
      <PayItems name="deductions" title="Deductions" />
      <dl className="grid grid-cols-3 gap-2 rounded-lg bg-subtle p-3 text-sm">
        <div>
          <dt className="text-muted">Gross</dt>
          <dd className="font-bold">{formatMoney(totals.gross, currency)}</dd>
        </div>
        <div>
          <dt className="text-muted">Deductions</dt>
          <dd className="font-bold">{formatMoney(totals.deductions, currency)}</dd>
        </div>
        <div>
          <dt className="text-muted">Net pay</dt>
          <dd className="font-bold text-brand-strong">{formatMoney(totals.net, currency)}</dd>
        </div>
      </dl>
    </FormSection>
  );
}

export function NotesSection() {
  return (
    <FormSection title="Notes (optional)">
      <TextAreaField<SalarySlip>
        name="notes"
        label="Notes"
        rows={2}
        placeholder="e.g. Includes arrears of ₹2,000 for August."
      />
    </FormSection>
  );
}
