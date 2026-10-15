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
  type ChoiceOption,
} from "@/components/tool/calculator";
import { ScheduleTable, SplitBar } from "@/components/tool/calculator-charts";
import { FieldRow, FormSection } from "@/components/tool/form";
import { formatPercent, formatTenure, yearRowLabel } from "@/lib/finance";
import { parseAmount } from "@/lib/parse-amount";
import { calculateFd, MAX_FD_MONTHS, type Compounding, type FdPayout } from "../lib/fd";

const COMPOUNDINGS: ChoiceOption<Compounding>[] = [
  { value: "quarterly", label: "Quarterly" },
  { value: "monthly", label: "Monthly" },
  { value: "half-yearly", label: "Half-yearly" },
  { value: "yearly", label: "Yearly" },
];

const COMPOUNDING_WORDS: Record<Compounding, string> = {
  quarterly: "every quarter",
  monthly: "every month",
  "half-yearly": "every six months",
  yearly: "once a year",
};

const PAYOUTS: ChoiceOption<FdPayout>[] = [
  { value: "cumulative", label: "Cumulative", description: "Interest is reinvested and paid at maturity." },
  { value: "monthly", label: "Monthly payout", description: "Interest paid to you every month." },
  { value: "quarterly", label: "Quarterly payout", description: "Interest paid to you every quarter." },
];

export function FdCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [compounding, setCompounding] = useState<Compounding>("quarterly");
  const [payout, setPayout] = useState<FdPayout>("cumulative");

  const totalMonths = parseAmount(years) * 12 + parseAmount(months);
  const result = calculateFd({
    principal: parseAmount(principal),
    annualRate: parseAmount(rate),
    months: totalMonths,
    compounding,
    payout,
  });
  const cumulative = payout === "cumulative";
  const hasDeposit = result.principal > 0 && result.months > 0;
  const tenure = formatTenure(result.months);
  const period = payout === "monthly" ? "month" : "quarter";

  const notes = [
    totalMonths > MAX_FD_MONTHS &&
      `The calculator works out deposits of up to ${MAX_FD_MONTHS / 12} years, so the tenure has been capped.`,
    !cumulative &&
      "Payouts here are simple interest on the deposit. Some banks pay a little less each month than a quarter's interest ÷ 3, because they discount it for paying early.",
    "FD interest is taxable at your slab rate, and banks deduct TDS once your interest crosses the yearly threshold. If your total income is below the taxable limit, you can ask the bank not to deduct it by giving a self-declaration.",
    "Senior citizens usually get around 0.25% to 0.5% more. Rates here are examples: check the current rate with your bank.",
  ].filter((note): note is string => Boolean(note));

  return (
    <CalculatorLayout
      inputs={
        <>
          <FormSection
            title="Your deposit"
            description="The amount, the bank's rate and how long you'll keep it."
          >
            <AmountField
              id="fd-principal"
              label="Deposit amount"
              value={principal}
              onChange={setPrincipal}
              prefix="₹"
              placeholder="e.g. 1,00,000"
            />
            <AmountField
              id="fd-rate"
              label="Interest rate"
              value={rate}
              onChange={setRate}
              suffix="% a year"
              placeholder="e.g. 7"
              hint="The rate your bank offers for this tenure."
            />
            <FieldRow>
              <AmountField
                id="fd-years"
                label="Tenure: years"
                value={years}
                onChange={setYears}
                suffix="years"
                placeholder="e.g. 5"
              />
              <AmountField
                id="fd-months"
                label="Tenure: months"
                value={months}
                onChange={setMonths}
                suffix="months"
                placeholder="e.g. 6"
                hint="Optional, on top of the years."
              />
            </FieldRow>
          </FormSection>

          <FormSection title="How interest is paid">
            <ChoiceGroup
              name="fd-payout"
              legend="Interest payout"
              options={PAYOUTS}
              value={payout}
              onChange={setPayout}
              className="grid sm:grid-cols-3"
            />
            {cumulative && (
              <ChoiceGroup
                name="fd-compounding"
                legend="Compounding"
                options={COMPOUNDINGS}
                value={compounding}
                onChange={setCompounding}
                hint="Most Indian banks compound FD interest every quarter."
              />
            )}
          </FormSection>
        </>
      }
      results={
        <ResultsCard>
          {cumulative ? (
            <ResultHeadline
              label="Maturity amount"
              value={rupees(result.maturity)}
              detail={
                hasDeposit
                  ? `Including ${rupees(result.totalInterest)} interest over ${tenure}`
                  : "Enter the deposit, rate and tenure"
              }
            />
          ) : (
            <ResultHeadline
              label={payout === "monthly" ? "Interest every month" : "Interest every quarter"}
              value={rupees(result.periodicPayout)}
              detail={
                hasDeposit
                  ? `${rupees(result.totalInterest)} in all over ${tenure}, and your ${rupees(result.principal)} back at maturity`
                  : "Enter the deposit, rate and tenure"
              }
            />
          )}

          <BreakdownTable
            caption={cumulative ? "At maturity" : "Over the whole term"}
            columns={["Amount"]}
            rows={
              cumulative
                ? [
                    { label: "Deposit", values: [rupees(result.principal)] },
                    { label: "Interest earned", values: [rupees(result.totalInterest)] },
                    { label: "Maturity amount", values: [rupees(result.maturity)], tone: "highlight" },
                  ]
                : [
                    { label: "Deposit", values: [rupees(result.principal)] },
                    { label: `Interest each ${period}`, values: [rupees(result.periodicPayout)] },
                    { label: "Total interest paid out", values: [rupees(result.totalInterest)] },
                    { label: "Paid back at maturity", values: [rupees(result.maturity)], tone: "highlight" },
                  ]
            }
          />

          <SplitBar
            title={cumulative ? "Deposit vs interest" : "Deposit vs interest paid out"}
            format={rupees}
            parts={[
              { label: "Deposit", value: result.principal, tone: "principal" },
              { label: "Interest", value: result.totalInterest, tone: "growth" },
            ]}
          />

          <CalculatorNotes title="Good to know" notes={notes} />

          <NextStepLink toolSlug="fd-calculator" label="Try the RD calculator" />
        </ResultsCard>
      }
      details={
        <ScheduleTable
          title="Year by year"
          description={
            cumulative
              ? `How the deposit grows at ${formatPercent(result.annualRate)}, compounded ${COMPOUNDING_WORDS[compounding]}.`
              : "The interest paid out to you each year. The deposit itself stays the same."
          }
          firstColumn="Year"
          columns={
            cumulative
              ? ["Interest this year", "Total interest", "Balance"]
              : ["Interest paid out", "Total paid out"]
          }
          rows={result.yearly.map((year) => ({
            key: year.year,
            label: yearRowLabel(year.year, result.months),
            values: cumulative
              ? [rupees(year.interest), rupees(year.totalInterest), rupees(year.balance)]
              : [rupees(year.interest), rupees(year.totalInterest)],
            bar: [
              { label: "Deposit", value: result.principal, tone: "principal" },
              { label: "Interest", value: year.totalInterest, tone: "growth" },
            ],
          }))}
          barMax={result.principal + result.totalInterest}
          legend={[
            { label: "Deposit", tone: "principal" },
            { label: cumulative ? "Interest" : "Interest paid out", tone: "growth" },
          ]}
          rowNoun="years"
          emptyText="Enter the deposit, rate and tenure to see how it grows."
        />
      }
    />
  );
}
