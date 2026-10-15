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
import { ScheduleTable, SplitBar, type ChartPart } from "@/components/tool/calculator-charts";
import { FieldRow, FormSection } from "@/components/tool/form";
import { formatPercent, formatTenure, yearRowLabel } from "@/lib/finance";
import { parseAmount } from "@/lib/parse-amount";
import {
  calculateCompoundInterest,
  MAX_CI_YEARS,
  type CompoundFrequency,
  type DepositFrequency,
} from "../lib/compound-interest";

const FREQUENCIES: ChoiceOption<CompoundFrequency>[] = [
  { value: "yearly", label: "Yearly" },
  { value: "half-yearly", label: "Half-yearly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "monthly", label: "Monthly" },
  { value: "daily", label: "Daily" },
];

const FREQUENCY_WORDS: Record<CompoundFrequency, string> = {
  yearly: "once a year",
  "half-yearly": "every six months",
  quarterly: "every quarter",
  monthly: "every month",
  daily: "every day",
};

const DEPOSITS: ChoiceOption<DepositFrequency>[] = [
  { value: "none", label: "None" },
  { value: "monthly", label: "Every month" },
  { value: "yearly", label: "Every year" },
];

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [compounding, setCompounding] = useState<CompoundFrequency>("yearly");
  const [depositFrequency, setDepositFrequency] = useState<DepositFrequency>("none");
  const [deposit, setDeposit] = useState("");

  const result = calculateCompoundInterest({
    principal: parseAmount(principal),
    annualRate: parseAmount(rate),
    years: parseAmount(years),
    compounding,
    depositFrequency,
    deposit: parseAmount(deposit),
  });
  const hasMoney = result.balance > 0 && result.years > 0;
  const hasDeposits = result.deposits > 0;
  const months = Math.round(result.years * 12);
  const extra = Math.max(result.interest - result.simpleInterest, 0);

  const rows: BreakdownRow[] = [
    { label: "Principal", values: [rupees(result.principal)] },
    ...(hasDeposits ? [{ label: "Regular deposits", values: [rupees(result.deposits)] }] : []),
    { label: "Interest earned", values: [rupees(result.interest)] },
    { label: "Final balance", values: [rupees(result.balance)], tone: "highlight" },
  ];

  const parts: ChartPart[] = [
    { label: "Principal", value: result.principal, tone: "principal" },
    ...(hasDeposits ? [{ label: "Deposits", value: result.deposits, tone: "deposits" } as const] : []),
    { label: "Interest", value: result.interest, tone: "growth" },
  ];

  const notes = [
    parseAmount(years) > MAX_CI_YEARS &&
      `The calculator projects up to ${MAX_CI_YEARS} years, so the period has been capped.`,
    hasDeposits &&
      `Regular deposits are added at the end of each ${depositFrequency === "monthly" ? "month" : "year"} and earn interest from then on.`,
    "Tax on the interest isn't included. The rate is an example: real rates can change over time.",
  ].filter((note): note is string => Boolean(note));

  return (
    <CalculatorLayout
      inputs={
        <>
          <FormSection
            title="Your money"
            description="What you start with, the interest rate and for how long."
          >
            <AmountField
              id="ci-principal"
              label="Principal"
              value={principal}
              onChange={setPrincipal}
              prefix="₹"
              placeholder="e.g. 1,00,000"
              hint="The amount you start with."
            />
            <FieldRow>
              <AmountField
                id="ci-rate"
                label="Interest rate"
                value={rate}
                onChange={setRate}
                suffix="% a year"
                placeholder="e.g. 8"
              />
              <AmountField
                id="ci-years"
                label="Time period"
                value={years}
                onChange={setYears}
                suffix="years"
                placeholder="e.g. 10"
                hint="Part years work too, e.g. 2.5."
              />
            </FieldRow>
            <ChoiceGroup
              name="ci-compounding"
              legend="Compounded"
              options={FREQUENCIES}
              value={compounding}
              onChange={setCompounding}
              hint="How often interest is added to the balance. Bank FDs are usually quarterly."
            />
          </FormSection>

          <FormSection
            title="Regular deposits"
            description="Optional: add the same amount every month or year."
          >
            <ChoiceGroup
              name="ci-deposit-frequency"
              legend="Add money"
              options={DEPOSITS}
              value={depositFrequency}
              onChange={setDepositFrequency}
            />
            {depositFrequency !== "none" && (
              <AmountField
                id="ci-deposit"
                label={depositFrequency === "monthly" ? "Monthly deposit" : "Yearly deposit"}
                value={deposit}
                onChange={setDeposit}
                prefix="₹"
                suffix={depositFrequency === "monthly" ? "a month" : "a year"}
                placeholder={depositFrequency === "monthly" ? "e.g. 5,000" : "e.g. 50,000"}
                className="sm:w-1/2"
              />
            )}
          </FormSection>
        </>
      }
      results={
        <ResultsCard>
          <ResultHeadline
            label="Final balance"
            value={rupees(result.balance)}
            detail={
              hasMoney
                ? `After ${formatTenure(months)} at ${formatPercent(result.annualRate)}, compounded ${FREQUENCY_WORDS[compounding]}`
                : "Enter the principal, rate and time period"
            }
          />

          <BreakdownTable caption="Where the balance comes from" columns={["Amount"]} rows={rows} />

          <SplitBar title="What you put in vs interest" format={rupees} parts={parts} />

          <div className="rounded-lg bg-subtle p-4 text-sm">
            <p className="font-bold">Compared with simple interest</p>
            <p className="mt-1">
              At the same rate without compounding, you&apos;d earn{" "}
              <strong className="tabular-nums">{rupees(result.simpleInterest)}</strong> in interest.
              Compounding adds <strong className="tabular-nums">{rupees(extra)}</strong> more, because
              interest earns interest.
            </p>
          </div>

          <CalculatorNotes notes={notes} />

          <NextStepLink toolSlug="compound-interest-calculator" label="Try the FD calculator" />
        </ResultsCard>
      }
      details={
        <ScheduleTable
          title="Year by year"
          description="What you've put in, the interest earned so far and the balance at the end of each year."
          firstColumn="Year"
          columns={["Put in so far", "Interest so far", "Balance"]}
          rows={result.yearly.map((point) => {
            const year = Math.ceil(point.years);
            return {
              key: point.years,
              label: yearRowLabel(year, Math.round(point.years * 12)),
              values: [rupees(point.putIn), rupees(point.interest), rupees(point.balance)],
              bar: [
                { label: "Put in", value: point.putIn, tone: "principal" },
                { label: "Interest", value: point.interest, tone: "growth" },
              ],
            };
          })}
          barMax={result.balance}
          legend={[
            { label: "Principal and deposits", tone: "principal" },
            { label: "Interest", tone: "growth" },
          ]}
          rowNoun="years"
          emptyText="Enter the principal (or a regular deposit), rate and time period to see the growth year by year."
        />
      }
    />
  );
}
