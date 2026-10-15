"use client";

import { useState } from "react";
import {
  AmountField,
  BreakdownTable,
  CalculatorLayout,
  CalculatorNotes,
  ChoiceGroup,
  formatRupees as rupees,
  NextStepLink,
  ResultHeadline,
  ResultsCard,
  SelectField,
  type ChoiceOption,
} from "@/components/tool/calculator";
import { FieldRow, FormSection } from "@/components/tool/form";
import { parseAmount } from "@/lib/parse-amount";
import { HRA_CITIES, type HraCity } from "@/tools/hra-calculator/lib/hra";
import type { TaxRegime } from "../lib/income-tax";
import {
  calculateSalary,
  compareRegimes,
  INVESTMENT_DEDUCTION_CAP,
  salarySlipQuery,
  type PfOption,
  type RegimeTax,
} from "../lib/salary";

const PF_OPTIONS: ChoiceOption<PfOption>[] = [
  { value: "capped", label: "12%, capped", description: "At most ₹1,800 a month (on ₹15,000 of basic)." },
  { value: "full", label: "12% of basic", description: "On the full basic salary." },
  { value: "none", label: "No PF", description: "Not part of your salary." },
];

const REGIMES: ChoiceOption<TaxRegime>[] = [
  { value: "new", label: "New (default)", description: "Lower rates, few deductions." },
  { value: "old", label: "Old", description: "Higher rates, with HRA and other deductions." },
];

const REGIME_NAMES: Record<TaxRegime, string> = { new: "new regime", old: "old regime" };

const both = (yearly: number) => [rupees(yearly / 12), rupees(yearly)];

export function SalaryCalculator() {
  const [ctc, setCtc] = useState("");
  const [basicPercent, setBasicPercent] = useState("50");
  const [hraPercent, setHraPercent] = useState("50");
  const [pf, setPf] = useState<PfOption>("capped");
  const [gratuityIncluded, setGratuityIncluded] = useState(false);
  const [professionalTax, setProfessionalTax] = useState("200");
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [rent, setRent] = useState("");
  const [city, setCity] = useState<HraCity | "">("");
  const [otherDeductions, setOtherDeductions] = useState("");

  const result = calculateSalary({
    ctc: parseAmount(ctc),
    basicPercent: parseAmount(basicPercent),
    hraPercent: parseAmount(hraPercent),
    pf,
    gratuityIncluded,
    professionalTax: parseAmount(professionalTax),
    regime,
    rent: parseAmount(rent),
    city,
    otherDeductions: parseAmount(otherDeductions),
  });
  const comparison = compareRegimes(result.taxes);
  const hasOldRegimeInputs = parseAmount(rent) > 0 || parseAmount(otherDeductions) > 0;
  const investmentRoom = Math.max(INVESTMENT_DEDUCTION_CAP - result.employeePf, 0);

  const adjustments = [
    result.basicReduced &&
      "Basic salary is more than what's left of the CTC after PF and gratuity, so it has been lowered to fit. Try a lower basic percentage.",
    result.hraReduced &&
      "HRA doesn't fit in the gross salary at that percentage, so it has been lowered to what's left after basic, and there's no special allowance.",
  ].filter((note): note is string => Boolean(note));

  return (
    <CalculatorLayout
      inputs={
        <>
          <FormSection title="Your CTC" description="The cost to company from your offer letter, for a year.">
            <AmountField
              id="salary-ctc"
              label="Annual CTC"
              value={ctc}
              onChange={setCtc}
              prefix="₹"
              suffix="a year"
              placeholder="e.g. 12,00,000"
            />
            <FieldRow>
              <AmountField
                id="salary-basic"
                label="Basic salary"
                value={basicPercent}
                onChange={setBasicPercent}
                suffix="% of CTC"
                placeholder="e.g. 50"
                hint="Usually 40% to 50% of CTC."
              />
              <AmountField
                id="salary-hra"
                label="House rent allowance (HRA)"
                value={hraPercent}
                onChange={setHraPercent}
                suffix="% of basic"
                placeholder="e.g. 50"
                hint="Often 50% of basic in metros, 40% elsewhere."
              />
            </FieldRow>
          </FormSection>

          <FormSection title="What comes out of it">
            <ChoiceGroup
              name="salary-pf"
              legend="Provident fund (PF)"
              options={PF_OPTIONS}
              value={pf}
              onChange={setPf}
              hint="You and your employer pay the same amount. The employer's share is part of your CTC."
              className="grid sm:grid-cols-3"
            />
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={gratuityIncluded}
                onChange={(event) => setGratuityIncluded(event.target.checked)}
                className="mt-0.5 size-4 accent-brand"
                aria-describedby="salary-gratuity-hint"
              />
              <span>
                <span className="font-semibold">Gratuity is included in my CTC</span>
                <span id="salary-gratuity-hint" className="mt-0.5 block text-xs text-muted">
                  4.81% of basic. It&apos;s paid when you leave after five or more years, not every month.
                </span>
              </span>
            </label>
            <AmountField
              id="salary-professional-tax"
              label="Professional tax"
              value={professionalTax}
              onChange={setProfessionalTax}
              prefix="₹"
              suffix="a month"
              placeholder="e.g. 200"
              hint="Set by your state, at most ₹2,500 a year. Enter 0 if your state doesn't charge it."
              className="sm:w-1/2"
            />
          </FormSection>

          <FormSection title="Income tax" description="Estimated for FY 2026-27 (April 2026 to March 2027).">
            <ChoiceGroup
              name="salary-regime"
              legend="Tax regime"
              options={REGIMES}
              value={regime}
              onChange={setRegime}
              className="grid sm:grid-cols-2"
            />
            {regime === "old" && (
              <>
                <FieldRow>
                  <AmountField
                    id="salary-rent"
                    label="Rent paid"
                    value={rent}
                    onChange={setRent}
                    prefix="₹"
                    suffix="a month"
                    placeholder="e.g. 25,000"
                    hint="For the HRA exemption. Leave blank if you don't pay rent."
                  />
                  <SelectField
                    id="salary-city"
                    label="City you live in"
                    value={city}
                    onChange={(value) => setCity(value as HraCity)}
                    options={HRA_CITIES}
                    placeholder="Choose your city"
                    hint="Eight metros get a higher HRA limit."
                  />
                </FieldRow>
                <AmountField
                  id="salary-other-deductions"
                  label="Other deductions (80C, 80D…)"
                  value={otherDeductions}
                  onChange={setOtherDeductions}
                  prefix="₹"
                  suffix="a year"
                  placeholder="e.g. 1,00,000"
                  hint={`80C is capped at ${rupees(INVESTMENT_DEDUCTION_CAP)} a year including your PF (${rupees(result.employeePf)}), so add at most ${rupees(investmentRoom)} more for 80C, plus health insurance and other deductions.`}
                />
              </>
            )}
          </FormSection>
        </>
      }
      results={
        <ResultsCard>
          <ResultHeadline
            label="Monthly in-hand salary"
            value={rupees(result.monthlyInHand)}
            detail={`${rupees(result.inHand)} a year, after an estimated ${rupees(result.tax.total)} income tax`}
          />

          {adjustments.length > 0 && <CalculatorNotes notes={adjustments} />}

          <BreakdownTable
            caption="From CTC to in-hand"
            columns={["Monthly", "Yearly"]}
            rows={[
              { label: "CTC", values: both(result.ctc), tone: "total" },
              { label: "Employer's PF", values: both(result.employerPf), tone: "minus" },
              { label: "Gratuity", values: both(result.gratuity), tone: "minus" },
              { label: "Gross salary", values: both(result.gross), tone: "total" },
              { label: "Employee's PF", values: both(result.employeePf), tone: "minus" },
              { label: "Professional tax", values: both(result.professionalTax), tone: "minus" },
              {
                label: "Income tax (TDS, estimate)",
                values: both(result.tax.total),
                tone: "minus",
              },
              { label: "In-hand salary", values: both(result.inHand), tone: "highlight" },
            ]}
          />

          <BreakdownTable
            caption="Salary structure"
            columns={["Monthly", "Yearly"]}
            rows={[
              { label: "Basic salary", values: both(result.basic) },
              { label: "House rent allowance (HRA)", values: both(result.hra) },
              { label: "Special allowance", values: both(result.special) },
              { label: "Gross salary", values: both(result.gross), tone: "total" },
            ]}
          />

          <p className="rounded-lg bg-subtle p-4 text-sm">
            {comparison.cheaper ? (
              <>
                You&apos;d pay <strong>{rupees(comparison.saving)} less</strong> a year under the{" "}
                <strong>{REGIME_NAMES[comparison.cheaper]}</strong>.
              </>
            ) : (
              "Both regimes come to the same tax on this salary."
            )}{" "}
            {regime === "new" && !hasOldRegimeInputs
              ? "The old regime figure has no rent or deductions yet: choose Old to add them."
              : "The old regime figure includes the rent and deductions you entered."}
          </p>

          <TaxDetails tax={result.tax} />

          <NextStepLink
            toolSlug="salary-calculator"
            href={
              result.gross > 0
                ? `/salary-slip-generator?${salarySlipQuery(result)}`
                : "/salary-slip-generator"
            }
            label="Make a salary slip with these figures"
          />
        </ResultsCard>
      }
    />
  );
}

/** How the estimated tax was reached, step by step. */
function TaxDetails({ tax }: { tax: RegimeTax }) {
  const rows: [string, number, boolean?][] = [
    ["Gross salary", tax.grossSalary],
    ["Standard deduction", -tax.standardDeduction],
    ...(tax.regime === "old"
      ? ([
          ["HRA exemption", -tax.hraExemption],
          ["Professional tax", -tax.professionalTax],
          ["PF and other deductions", -tax.otherDeductions],
        ] as [string, number][])
      : []),
    ["Taxable income", tax.taxableIncome, true],
    ["Tax on the slabs", tax.slabTax],
    ["Rebate and relief", -tax.rebate],
    ["Surcharge", tax.surcharge],
    ["Health and education cess (4%)", tax.cess],
    ["Income tax for the year", tax.total, true],
  ];
  return (
    <details className="group rounded-lg border border-border p-4 text-sm">
      <summary className="cursor-pointer font-bold">
        How the tax was worked out ({REGIME_NAMES[tax.regime]})
      </summary>
      <dl className="mt-3 space-y-1.5">
        {rows.map(([label, amount, bold]) => (
          <div
            key={label}
            className={bold ? "flex justify-between gap-4 font-bold" : "flex justify-between gap-4"}
          >
            <dt>{label}</dt>
            <dd className="tabular-nums">{amount < 0 ? `− ${rupees(-amount)}` : rupees(amount)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-muted">
        An estimate for a resident under 60 with salary as their only income. Your employer&apos;s TDS may
        differ slightly, for example if you join mid-year or declare other income.
      </p>
    </details>
  );
}
