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
import { FormAlert, FormSection } from "@/components/tool/form";
import { formatPercent } from "@/lib/finance";
import { parseAmount } from "@/lib/parse-amount";
import {
  calculatePpf,
  PPF_DEFAULT_RATE,
  PPF_EXTENSION_YEARS,
  PPF_MAX_DEPOSIT,
  PPF_MIN_DEPOSIT,
  PPF_TENURES,
  PPF_TERM_YEARS,
} from "../lib/ppf";

type Tenure = `${(typeof PPF_TENURES)[number]}`;

const extensionLabel = (count: number) => `+${count} extension${count > 1 ? "s" : ""}`;

const TENURES: ChoiceOption<Tenure>[] = PPF_TENURES.map((years) => ({
  value: `${years}` as Tenure,
  label: `${years} years`,
  description:
    years === PPF_TERM_YEARS
      ? "No extension"
      : extensionLabel((years - PPF_TERM_YEARS) / PPF_EXTENSION_YEARS),
}));

export function PpfCalculator() {
  const [deposit, setDeposit] = useState("");
  const [rate, setRate] = useState(`${PPF_DEFAULT_RATE}`);
  const [tenure, setTenure] = useState<Tenure>(`${PPF_TERM_YEARS}` as Tenure);

  const result = calculatePpf({
    yearlyDeposit: parseAmount(deposit),
    annualRate: parseAmount(rate),
    years: Number(tenure),
  });
  const hasDeposit = result.years > 0;
  const extended = Number(tenure) > PPF_TERM_YEARS;

  const notes = [
    `The rate is set by the government every quarter, so your actual interest will change if it does. ${formatPercent(PPF_DEFAULT_RATE)} is the rate for October to December 2026.`,
    "Assumes you deposit the same amount every year by 5 April, so it earns interest for the whole year. Interest is credited once a year, at the end of March.",
    extended
      ? "After 15 years you can extend the account in blocks of 5 years. This assumes you keep depositing during the extension; you can also extend without new deposits."
      : "After 15 years you can withdraw everything, or extend the account in blocks of 5 years. Pick a longer tenure above to see the difference.",
    "PPF is EEE: deposits can qualify for a deduction under the old tax regime, and the interest and the maturity amount are tax-free.",
  ];

  return (
    <CalculatorLayout
      inputs={
        <FormSection
          title="Your PPF account"
          description="How much you'll deposit each financial year (April to March)."
        >
          <AmountField
            id="ppf-deposit"
            label="Yearly deposit"
            value={deposit}
            onChange={setDeposit}
            prefix="₹"
            suffix="a year"
            placeholder="e.g. 1,50,000"
            hint={`At least ${rupees(PPF_MIN_DEPOSIT)} and at most ${rupees(PPF_MAX_DEPOSIT)} each financial year.`}
          />
          {result.capped && (
            <FormAlert>
              PPF accepts at most {rupees(PPF_MAX_DEPOSIT)} a year (including any account you run for a
              child), and anything more earns no interest. The calculation uses {rupees(PPF_MAX_DEPOSIT)}.
            </FormAlert>
          )}
          {result.belowMinimum && (
            <FormAlert>
              The minimum is {rupees(PPF_MIN_DEPOSIT)} a year. Deposit less and the account becomes inactive
              until you pay the missed minimum plus a small penalty.
            </FormAlert>
          )}
          <AmountField
            id="ppf-rate"
            label="Interest rate"
            value={rate}
            onChange={setRate}
            suffix="% a year"
            placeholder={`e.g. ${PPF_DEFAULT_RATE}`}
            hint={`${formatPercent(PPF_DEFAULT_RATE)} for October to December 2026, unchanged for many quarters. The government reviews it every quarter, so change it to try other rates.`}
          />
          <ChoiceGroup
            name="ppf-tenure"
            legend="How long"
            options={TENURES}
            value={tenure}
            onChange={setTenure}
            hint="The account matures after 15 financial years. You can then extend it 5 years at a time."
            className="grid grid-cols-2 sm:grid-cols-3"
          />
        </FormSection>
      }
      results={
        <ResultsCard>
          <ResultHeadline
            label="Maturity value"
            value={rupees(result.maturity)}
            detail={
              hasDeposit
                ? `After ${result.years} years at ${formatPercent(result.annualRate)} a year, tax-free`
                : "Enter your yearly deposit"
            }
          />

          <BreakdownTable
            caption="At maturity"
            columns={["Amount"]}
            rows={[
              { label: "Total deposited", values: [rupees(result.invested)] },
              { label: "Interest earned", values: [rupees(result.interest)] },
              { label: "Maturity value", values: [rupees(result.maturity)], tone: "highlight" },
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

          <NextStepLink toolSlug="ppf-calculator" label="Try the SIP calculator" />
        </ResultsCard>
      }
      details={
        <ScheduleTable
          title="Year by year"
          description="Each financial year's deposit, the interest credited at the end of it and the closing balance."
          firstColumn="Year"
          columns={["Deposit", "Interest", "Closing balance"]}
          rows={result.yearly.map((year) => ({
            key: year.year,
            label: `Year ${year.year}`,
            values: [rupees(year.deposit), rupees(year.interest), rupees(year.closing)],
            bar: [
              { label: "Deposits", value: year.totalDeposits, tone: "principal" },
              { label: "Interest", value: year.closing - year.totalDeposits, tone: "growth" },
            ],
          }))}
          barMax={result.maturity}
          legend={[
            { label: "Deposits so far", tone: "principal" },
            { label: "Interest so far", tone: "growth" },
          ]}
          rowNoun="years"
          visibleRows={15}
          emptyText="Enter your yearly deposit to see the account grow year by year."
        />
      }
    />
  );
}
