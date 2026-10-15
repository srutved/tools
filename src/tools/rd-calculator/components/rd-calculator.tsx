"use client";

import { useState } from "react";
import {
  AmountField,
  BreakdownTable,
  CalculatorLayout,
  CalculatorNotes,
  formatRupees as rupees,
  NextStepLink,
  ResultHeadline,
  ResultsCard,
} from "@/components/tool/calculator";
import { ScheduleTable, SplitBar } from "@/components/tool/calculator-charts";
import { FieldRow, FormSection } from "@/components/tool/form";
import { formatPercent, formatTenure, yearRowLabel } from "@/lib/finance";
import { parseAmount } from "@/lib/parse-amount";
import { calculateRd, MAX_RD_MONTHS } from "../lib/rd";

export function RdCalculator() {
  const [monthly, setMonthly] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");

  const enteredMonths = parseAmount(months);
  const result = calculateRd({
    monthly: parseAmount(monthly),
    annualRate: parseAmount(rate),
    months: enteredMonths,
  });
  const hasDeposit = result.months > 0;

  const notes = [
    enteredMonths > MAX_RD_MONTHS &&
      `Banks offer RDs of up to ${MAX_RD_MONTHS / 12} years, so the tenure has been capped at ${MAX_RD_MONTHS} months.`,
    enteredMonths > 0 &&
      enteredMonths <= MAX_RD_MONTHS &&
      (enteredMonths < 6 || Math.round(enteredMonths) % 3 !== 0) &&
      "Most banks offer RDs from 6 months to 10 years, in multiples of 3 months. Check which tenures your bank allows.",
    "Interest is compounded every quarter, as at most banks and the post office. A missed instalment can mean a penalty, and the bank's own figure may differ by a few rupees because of rounding.",
    "RD interest is taxable at your slab rate, and TDS applies as it does for fixed deposits. Rates here are examples: check the current rate with your bank.",
  ].filter((note): note is string => Boolean(note));

  return (
    <CalculatorLayout
      inputs={
        <FormSection
          title="Your recurring deposit"
          description="The amount you'll save each month, the rate and the term."
        >
          <AmountField
            id="rd-monthly"
            label="Monthly deposit"
            value={monthly}
            onChange={setMonthly}
            prefix="₹"
            suffix="a month"
            placeholder="e.g. 5,000"
          />
          <FieldRow>
            <AmountField
              id="rd-rate"
              label="Interest rate"
              value={rate}
              onChange={setRate}
              suffix="% a year"
              placeholder="e.g. 7"
              hint="The rate your bank or post office offers."
            />
            <AmountField
              id="rd-months"
              label="Tenure"
              value={months}
              onChange={setMonths}
              suffix="months"
              placeholder="e.g. 12"
              hint="Usually 6 to 120 months, in steps of 3. A post office RD runs for 60 months."
            />
          </FieldRow>
        </FormSection>
      }
      results={
        <ResultsCard>
          <ResultHeadline
            label="Maturity amount"
            value={rupees(result.maturity)}
            detail={
              hasDeposit
                ? `After ${formatTenure(result.months)} at ${formatPercent(result.annualRate)} a year`
                : "Enter the monthly deposit, rate and tenure"
            }
          />

          <BreakdownTable
            caption="At maturity"
            columns={["Amount"]}
            rows={[
              { label: "Total deposited", values: [rupees(result.invested)] },
              { label: "Interest earned", values: [rupees(result.interest)] },
              { label: "Maturity amount", values: [rupees(result.maturity)], tone: "highlight" },
            ]}
          />

          <SplitBar
            title="Deposits vs interest"
            format={rupees}
            parts={[
              { label: "Deposits", value: result.invested, tone: "principal" },
              { label: "Interest", value: result.interest, tone: "growth" },
            ]}
          />

          <CalculatorNotes title="Good to know" notes={notes} />

          <NextStepLink toolSlug="rd-calculator" label="Try the SIP calculator" />
        </ResultsCard>
      }
      details={
        <ScheduleTable
          title="Year by year"
          description="What you'll have deposited and what the RD is worth at the end of each year."
          firstColumn="Year"
          columns={["Deposited so far", "Interest so far", "Value"]}
          rows={result.yearly.map((year) => ({
            key: year.year,
            label: yearRowLabel(year.year, result.months),
            values: [rupees(year.deposited), rupees(year.interest), rupees(year.value)],
            bar: [
              { label: "Deposits", value: year.deposited, tone: "principal" },
              { label: "Interest", value: year.interest, tone: "growth" },
            ],
          }))}
          barMax={result.maturity}
          legend={[
            { label: "Deposits", tone: "principal" },
            { label: "Interest", tone: "growth" },
          ]}
          rowNoun="years"
          emptyText="Enter the monthly deposit, rate and tenure to see how the RD grows."
        />
      }
    />
  );
}
