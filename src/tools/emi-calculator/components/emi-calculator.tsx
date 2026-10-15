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
import { ScheduleTable, SplitBar, type ScheduleRow } from "@/components/tool/calculator-charts";
import { FieldRow, FormSection } from "@/components/tool/form";
import { formatPercent, formatTenure, yearRowLabel } from "@/lib/finance";
import { amountToInput, parseAmount } from "@/lib/parse-amount";
import { cn } from "@/lib/utils";
import { calculateEmi, LOAN_PRESETS, MAX_LOAN_MONTHS } from "../lib/emi";

type TenureUnit = "years" | "months";
type ScheduleView = "yearly" | "monthly";

const TENURE_UNITS: ChoiceOption<TenureUnit>[] = [
  { value: "years", label: "Years" },
  { value: "months", label: "Months" },
];

const SCHEDULE_VIEWS: ChoiceOption<ScheduleView>[] = [
  { value: "yearly", label: "Year by year" },
  { value: "monthly", label: "Month by month" },
];

export function EmiCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [unit, setUnit] = useState<TenureUnit>("years");
  const [view, setView] = useState<ScheduleView>("yearly");

  // Switching between years and months converts what's been typed, so the tenure keeps its meaning.
  const changeUnit = (next: TenureUnit) => {
    if (next === unit) return;
    setTenure((value) =>
      next === "months"
        ? amountToInput(parseAmount(value) * 12, 0)
        : amountToInput(parseAmount(value) / 12, 2),
    );
    setUnit(next);
  };

  const applyPreset = (preset: (typeof LOAN_PRESETS)[number]) => {
    setRate(String(preset.rate));
    setTenure(String(preset.years));
    setUnit("years");
  };

  const months = unit === "years" ? parseAmount(tenure) * 12 : parseAmount(tenure);
  const result = calculateEmi({ principal: parseAmount(principal), annualRate: parseAmount(rate), months });
  const hasLoan = result.emi > 0;

  const yearlyRows: ScheduleRow[] = result.yearly.map((year) => ({
    key: year.year,
    label: yearRowLabel(year.year, result.months),
    values: [rupees(year.principal), rupees(year.interest), rupees(year.balance)],
    bar: [
      { label: "Principal", value: year.principal, tone: "principal" },
      { label: "Interest", value: year.interest, tone: "growth" },
    ],
  }));
  const monthlyRows: ScheduleRow[] = result.schedule.map((month) => ({
    key: month.month,
    label: `Month ${month.month}`,
    values: [rupees(month.principal), rupees(month.interest), rupees(month.balance)],
    bar: [
      { label: "Principal", value: month.principal, tone: "principal" },
      { label: "Interest", value: month.interest, tone: "growth" },
    ],
  }));
  const yearlyMax = Math.max(0, ...result.yearly.map((year) => year.principal + year.interest));

  const notes = [
    months > MAX_LOAN_MONTHS &&
      `The calculator works out loans of up to ${MAX_LOAN_MONTHS / 12} years, so the tenure has been capped.`,
    "Lenders may round the EMI, and the first and last EMIs can differ slightly depending on the date the loan is paid out.",
    "Interest rates here are examples. Check the rate, processing fee and other charges with your lender before you borrow.",
  ].filter((note): note is string => Boolean(note));

  return (
    <CalculatorLayout
      inputs={
        <FormSection
          title="Your loan"
          description="The amount you want to borrow, the rate and how long for."
        >
          <div>
            <p className="mb-1.5 text-sm font-semibold" id="emi-presets-label">
              Fill in a typical example
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="emi-presets-label">
              {LOAN_PRESETS.map((preset) => {
                const active =
                  unit === "years" && rate === String(preset.rate) && tenure === String(preset.years);
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col rounded-md border px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none",
                      active
                        ? "border-brand bg-brand-soft text-brand-strong"
                        : "border-border bg-white hover:border-brand/60",
                    )}
                  >
                    <span className="font-semibold">{preset.label}</span>
                    <span className="mt-0.5 text-xs text-muted">
                      ~{formatPercent(preset.rate)} for {preset.years} years
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1 text-xs text-muted">
              Typical figures to get you started, not offers. Your lender&apos;s rate may be higher or lower.
            </p>
          </div>
          <AmountField
            id="emi-principal"
            label="Loan amount"
            value={principal}
            onChange={setPrincipal}
            prefix="₹"
            placeholder="e.g. 25,00,000"
          />
          <AmountField
            id="emi-rate"
            label="Interest rate"
            value={rate}
            onChange={setRate}
            suffix="% a year"
            placeholder="e.g. 8.5"
            hint="The yearly rate on your loan offer or sanction letter."
          />
          <FieldRow>
            <ChoiceGroup
              name="emi-tenure-unit"
              legend="Enter the tenure in"
              options={TENURE_UNITS}
              value={unit}
              onChange={changeUnit}
              hint="Switching converts what you've typed."
            />
            <AmountField
              id="emi-tenure"
              label="Loan tenure"
              value={tenure}
              onChange={setTenure}
              suffix={unit}
              placeholder={unit === "years" ? "e.g. 20" : "e.g. 240"}
            />
          </FieldRow>
        </FormSection>
      }
      results={
        <ResultsCard>
          <ResultHeadline
            label="Monthly EMI"
            value={rupees(result.emi)}
            detail={
              hasLoan
                ? `For ${formatTenure(result.months)} at ${formatPercent(result.annualRate)} a year`
                : "Enter the loan amount, rate and tenure"
            }
          />

          <BreakdownTable
            caption="Over the whole loan"
            columns={["Amount"]}
            rows={[
              { label: "Loan amount (principal)", values: [rupees(result.principal)] },
              { label: "Total interest", values: [rupees(result.totalInterest)] },
              { label: "Total you'll pay", values: [rupees(result.totalPayment)], tone: "highlight" },
            ]}
          />

          <SplitBar
            title="Principal vs interest"
            format={rupees}
            parts={[
              { label: "Principal", value: result.principal, tone: "principal" },
              { label: "Interest", value: result.totalInterest, tone: "growth" },
            ]}
          />

          <CalculatorNotes title="Good to know" notes={notes} />

          <NextStepLink toolSlug="emi-calculator" label="Try the FD calculator" />
        </ResultsCard>
      }
      details={
        <ScheduleTable
          key={view}
          title="Repayment schedule"
          description={
            view === "yearly"
              ? "How much of each year's EMIs goes to principal and to interest, and what's left to repay."
              : "Each EMI split into principal and interest, with the loan left after it."
          }
          action={
            <ChoiceGroup
              name="emi-schedule-view"
              legend="Show"
              options={SCHEDULE_VIEWS}
              value={view}
              onChange={setView}
            />
          }
          firstColumn={view === "yearly" ? "Loan year" : "Month"}
          columns={["Principal paid", "Interest paid", "Loan left"]}
          rows={view === "yearly" ? yearlyRows : monthlyRows}
          barMax={view === "yearly" ? yearlyMax : result.emi}
          legend={[
            { label: "Principal", tone: "principal" },
            { label: "Interest", tone: "growth" },
          ]}
          rowNoun={view === "yearly" ? "years" : "months"}
          visibleRows={view === "yearly" ? 10 : 12}
          emptyText="Enter the loan amount, rate and tenure to see the repayment schedule."
        />
      }
    />
  );
}
