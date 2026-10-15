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
  type BreakdownRow,
  type ChoiceOption,
} from "@/components/tool/calculator";
import { FieldRow, FormSection } from "@/components/tool/form";
import { parseAmount } from "@/lib/parse-amount";
import {
  DEFAULT_EPF_RATE,
  DEFAULT_RETIREMENT_AGE,
  EPS_END_AGE,
  EPS_MONTHLY_CAP,
  PF_WAGE_CEILING,
  projectPf,
  type PfWageBasis,
  type PfYear,
} from "../lib/pf";

const BASES: ChoiceOption<PfWageBasis>[] = [
  { value: "full", label: "12% of full basic", description: "On your whole basic + DA." },
  {
    value: "ceiling",
    label: `12% of ${rupees(PF_WAGE_CEILING)}`,
    description: "The wage ceiling: at most ₹1,800 a month from each side.",
  },
];

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/** 342 months → "28 years 6 months". */
function formatMonths(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years > 0 && plural(years, "year"), rest > 0 && plural(rest, "month")].filter(Boolean).join(" ");
}

export function PfCalculator() {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState(String(DEFAULT_RETIREMENT_AGE));
  const [basic, setBasic] = useState("");
  const [increase, setIncrease] = useState("5");
  const [basis, setBasis] = useState<PfWageBasis>("full");
  const [vpf, setVpf] = useState("");
  const [balance, setBalance] = useState("");
  const [rate, setRate] = useState(String(DEFAULT_EPF_RATE));

  const result = projectPf({
    currentAge: parseAmount(currentAge),
    retirementAge: parseAmount(retirementAge),
    monthlyBasic: parseAmount(basic),
    salaryIncrease: parseAmount(increase),
    currentBalance: parseAmount(balance),
    interestRate: parseAmount(rate),
    basis,
    vpfPercent: parseAmount(vpf),
  });
  const hasAges = parseAmount(currentAge) > 0 && parseAmount(retirementAge) > 0;
  const ready = hasAges && result.months > 0;
  const { firstMonth } = result;
  const ownShare = result.totalEmployee - result.totalVpf;

  const headlineDetail = !hasAges
    ? "Enter your age to see your balance at retirement."
    : result.months === 0
      ? "Your retirement age needs to be later than your current age."
      : `At age ${parseAmount(retirementAge)}, in ${formatMonths(result.months)}, including ${rupees(result.totalInterest)} of interest`;

  const sourceRows: BreakdownRow[] = [
    { label: "Balance today", values: [rupees(result.openingBalance)] },
    { label: "Your contributions (12%)", values: [rupees(ownShare)] },
    ...(result.totalVpf > 0 ? [{ label: "Your voluntary PF", values: [rupees(result.totalVpf)] }] : []),
    { label: "Employer's share to EPF", values: [rupees(result.totalEmployerEpf)] },
    { label: "Interest earned", values: [rupees(result.totalInterest)] },
    { label: "EPF balance at retirement", values: [rupees(result.corpus)], tone: "highlight" },
  ];

  const monthRows: BreakdownRow[] = [
    { label: "Your PF (12%)", values: [rupees(firstMonth.employee)] },
    ...(firstMonth.vpf > 0 ? [{ label: "Your voluntary PF", values: [rupees(firstMonth.vpf)] }] : []),
    { label: "Employer to EPF", values: [rupees(firstMonth.employerEpf)] },
    {
      label: "Into your EPF account",
      values: [rupees(firstMonth.employee + firstMonth.vpf + firstMonth.employerEpf)],
      tone: "total",
    },
    { label: "Employer to EPS (pension)", values: [rupees(firstMonth.eps)] },
  ];

  const notes = [
    `Interest is worked out monthly on the running balance at the rate you enter and credited once a year, as the EPFO does. The rate is declared every year: ${DEFAULT_EPF_RATE}% for FY 2025-26.`,
    "Your salary is assumed to rise once a year by the percentage you enter, with contributions every month until retirement and no withdrawals.",
    `The employer's pension (EPS) share is 8.33% of basic up to ${rupees(PF_WAGE_CEILING)}, so at most ${rupees(EPS_MONTHLY_CAP)} a month. It stops at ${EPS_END_AGE}, after which all of the employer's 12% goes to EPF.`,
    "An estimate, not financial advice. Check your passbook on the EPFO member portal, or ask your employer, for exact figures.",
  ];

  return (
    <CalculatorLayout
      inputs={
        <>
          <FormSection title="You">
            <FieldRow>
              <AmountField
                id="pf-age"
                label="Current age"
                value={currentAge}
                onChange={setCurrentAge}
                suffix="years"
                placeholder="e.g. 30"
              />
              <AmountField
                id="pf-retirement-age"
                label="Retirement age"
                value={retirementAge}
                onChange={setRetirementAge}
                suffix="years"
                placeholder="e.g. 58"
                hint="58 is when the EPS pension starts."
              />
            </FieldRow>
          </FormSection>

          <FormSection title="Your salary" description="As on your payslip today.">
            <FieldRow>
              <AmountField
                id="pf-basic"
                label="Basic salary + DA"
                value={basic}
                onChange={setBasic}
                prefix="₹"
                suffix="a month"
                placeholder="e.g. 50,000"
                hint="PF is worked out on basic pay plus dearness allowance (DA)."
              />
              <AmountField
                id="pf-increase"
                label="Yearly salary increase"
                value={increase}
                onChange={setIncrease}
                suffix="% a year"
                placeholder="e.g. 5"
                hint="Applied once a year."
              />
            </FieldRow>
          </FormSection>

          <FormSection title="PF contributions">
            <ChoiceGroup
              name="pf-basis"
              legend="PF is worked out on"
              options={BASES}
              value={basis}
              onChange={setBasis}
              hint="Check your payslip: if your PF is ₹1,800 a month, it's on the wage ceiling."
              className="grid sm:grid-cols-2"
            />
            <AmountField
              id="pf-vpf"
              label="Voluntary PF (VPF, optional)"
              value={vpf}
              onChange={setVpf}
              suffix="% of basic"
              placeholder="e.g. 5"
              hint="Extra you choose to put in on top of the 12%. Your employer doesn't match it."
              className="sm:w-1/2"
            />
          </FormSection>

          <FormSection title="Your EPF account">
            <FieldRow>
              <AmountField
                id="pf-balance"
                label="EPF balance today"
                value={balance}
                onChange={setBalance}
                prefix="₹"
                placeholder="e.g. 2,00,000"
                hint="From your EPF passbook. Leave blank if you're just starting."
              />
              <AmountField
                id="pf-rate"
                label="EPF interest rate"
                value={rate}
                onChange={setRate}
                suffix="% a year"
                placeholder="e.g. 8.25"
                hint={`${DEFAULT_EPF_RATE}% for FY 2025-26. Declared every year.`}
              />
            </FieldRow>
          </FormSection>
        </>
      }
      results={
        <ResultsCard>
          <ResultHeadline
            label="EPF balance at retirement"
            value={rupees(ready ? result.corpus : result.openingBalance)}
            detail={headlineDetail}
          />

          {ready && (
            <>
              <BreakdownTable caption="Where it comes from" columns={["Amount"]} rows={sourceRows} />

              <p className="rounded-lg bg-subtle p-4 text-sm">
                Your employer also pays <strong>{rupees(result.totalEps)}</strong> into the Employees&apos;
                Pension Scheme (EPS) over these years. That isn&apos;t part of your EPF balance: EPS pays a
                monthly pension from age {EPS_END_AGE} once you have 10 years of service, not a lump sum.
              </p>

              <BreakdownTable caption="Each month, to start with" columns={["A month"]} rows={monthRows} />

              <YearTable years={result.years} />
            </>
          )}

          <CalculatorNotes title="Good to know" notes={notes} />

          <NextStepLink toolSlug="pf-calculator" label="Work out your in-hand salary" />
        </ResultsCard>
      }
    />
  );
}

/** The balance year by year, collapsed by default as it can run to 40 rows. */
function YearTable({ years }: { years: PfYear[] }) {
  return (
    <details className="rounded-lg border border-border p-4 text-sm">
      <summary className="cursor-pointer font-bold">Year by year</summary>
      <div className="-mx-1 mt-3 overflow-x-auto px-1">
        <table className="w-full text-xs">
          <caption className="sr-only">EPF balance at the end of each year</caption>
          <thead>
            <tr className="border-b border-border text-muted">
              <th scope="col" className="py-1.5 pr-2 text-left font-semibold">
                Age
              </th>
              <th scope="col" className="py-1.5 pl-2 text-right font-semibold">
                Basic a month
              </th>
              <th scope="col" className="py-1.5 pl-2 text-right font-semibold">
                Paid in
              </th>
              <th scope="col" className="py-1.5 pl-2 text-right font-semibold">
                Interest
              </th>
              <th scope="col" className="py-1.5 pl-2 text-right font-semibold">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {years.map((year) => (
              <tr key={year.year} className="border-b border-border last:border-0">
                <th scope="row" className="py-1.5 pr-2 text-left font-normal">
                  {Math.floor(year.age)}
                  {year.months < 12 && <span className="text-muted"> ({plural(year.months, "month")})</span>}
                </th>
                <td className="py-1.5 pl-2 text-right whitespace-nowrap tabular-nums">
                  {rupees(year.monthlyBasic)}
                </td>
                <td className="py-1.5 pl-2 text-right whitespace-nowrap tabular-nums">
                  {rupees(year.employee + year.employerEpf)}
                </td>
                <td className="py-1.5 pl-2 text-right whitespace-nowrap tabular-nums">
                  {rupees(year.interest)}
                </td>
                <td className="py-1.5 pl-2 text-right font-semibold whitespace-nowrap tabular-nums">
                  {rupees(year.closingBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        &quot;Paid in&quot; is your contributions (including any VPF) plus your employer&apos;s share to EPF.
        Each year runs for 12 months from today.
      </p>
    </details>
  );
}
