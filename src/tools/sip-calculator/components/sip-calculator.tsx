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
import { calculateSip, MAX_SIP_YEARS } from "../lib/sip";

export function SipCalculator() {
  const [monthly, setMonthly] = useState("");
  const [annualReturn, setAnnualReturn] = useState("");
  const [years, setYears] = useState("");
  const [stepUp, setStepUp] = useState("");

  const stepUpRate = parseAmount(stepUp);
  const result = calculateSip({
    monthly: parseAmount(monthly),
    annualReturn: parseAmount(annualReturn),
    years: parseAmount(years),
    stepUp: stepUpRate,
  });
  const hasStepUp = stepUpRate > 0 && result.yearly.length > 1;

  const notes = [
    parseAmount(years) > MAX_SIP_YEARS &&
      `The calculator projects up to ${MAX_SIP_YEARS} years, so the period has been capped.`,
    "This is an illustration, not a promise. Mutual fund investments are subject to market risk: real returns go up and down from year to year and can be negative.",
    "Read the scheme documents, and check the fund's costs and past performance, before you invest. Past returns don't guarantee future ones.",
    "Tax on gains and any exit load aren't included.",
  ].filter((note): note is string => Boolean(note));

  return (
    <CalculatorLayout
      inputs={
        <FormSection title="Your SIP" description="How much you'll invest each month, and for how long.">
          <AmountField
            id="sip-monthly"
            label="Monthly investment"
            value={monthly}
            onChange={setMonthly}
            prefix="₹"
            suffix="a month"
            placeholder="e.g. 10,000"
          />
          <FieldRow>
            <AmountField
              id="sip-return"
              label="Expected return"
              value={annualReturn}
              onChange={setAnnualReturn}
              suffix="% a year"
              placeholder="e.g. 12"
              hint="An assumption, not a promise. Try a lower figure too."
            />
            <AmountField
              id="sip-years"
              label="Investment period"
              value={years}
              onChange={setYears}
              suffix="years"
              placeholder="e.g. 10"
            />
          </FieldRow>
          <AmountField
            id="sip-step-up"
            label="Yearly step-up (optional)"
            value={stepUp}
            onChange={setStepUp}
            suffix="% a year"
            placeholder="e.g. 10"
            hint="Raise your SIP by this much every year, for example in line with pay rises. Leave blank for a fixed amount."
            className="sm:w-1/2"
          />
        </FormSection>
      }
      results={
        <ResultsCard>
          <ResultHeadline
            label="Estimated value"
            value={rupees(result.value)}
            detail={
              result.months > 0
                ? `After ${formatTenure(result.months)} at an assumed ${formatPercent(parseAmount(annualReturn))} a year`
                : "Enter your monthly investment, expected return and period"
            }
          />

          <BreakdownTable
            caption="Your SIP at the end"
            columns={["Amount"]}
            rows={[
              { label: "Amount invested", values: [rupees(result.invested)] },
              { label: "Estimated returns", values: [rupees(result.returns)] },
              { label: "Estimated value", values: [rupees(result.value)], tone: "highlight" },
            ]}
          />

          <SplitBar
            title="Invested vs estimated returns"
            format={rupees}
            parts={[
              { label: "Invested", value: result.invested, tone: "principal" },
              { label: "Estimated returns", value: result.returns, tone: "growth" },
            ]}
          />

          <CalculatorNotes title="Please note" notes={notes} />

          <NextStepLink toolSlug="sip-calculator" label="Try the PPF calculator" />
        </ResultsCard>
      }
      details={
        <ScheduleTable
          title="Year by year"
          description="What you'll have put in and what it could be worth at the end of each year, at the return you entered."
          firstColumn="Year"
          columns={[...(hasStepUp ? ["Monthly SIP"] : []), "Invested so far", "Est. returns", "Est. value"]}
          rows={result.yearly.map((year) => ({
            key: year.year,
            label: yearRowLabel(year.year, result.months),
            values: [
              ...(hasStepUp ? [rupees(year.monthly)] : []),
              rupees(year.invested),
              rupees(year.returns),
              rupees(year.value),
            ],
            bar: [
              { label: "Invested", value: year.invested, tone: "principal" },
              { label: "Estimated returns", value: year.returns, tone: "growth" },
            ],
          }))}
          barMax={Math.max(result.value, result.invested)}
          legend={[
            { label: "Invested", tone: "principal" },
            { label: "Estimated returns", tone: "growth" },
          ]}
          rowNoun="years"
          emptyText="Enter your monthly investment, expected return and period to see how it could grow."
        />
      }
    />
  );
}
