"use client";

import { useState } from "react";
import {
  AmountField,
  BreakdownTable,
  CalculatorLayout,
  ChoiceGroup,
  NextStepLink,
  ResultHeadline,
  ResultsCard,
  type BreakdownRow,
  type ChoiceOption,
} from "@/components/tool/calculator";
import { FormSection } from "@/components/tool/form";
import { formatMoney } from "@/lib/currency";
import { parseAmount } from "@/lib/parse-amount";
import {
  calculateGst,
  DEFAULT_GST_RATE,
  formatRate,
  GST_RATES,
  type GstMode,
  type GstSupply,
} from "../lib/gst";

const MODES: ChoiceOption<GstMode>[] = [
  { value: "add", label: "Add GST", description: "The amount doesn't include GST yet." },
  { value: "remove", label: "Remove GST", description: "The amount already includes GST." },
];

const SUPPLIES: ChoiceOption<GstSupply>[] = [
  { value: "intra", label: "Within the state", description: "CGST + SGST, half each." },
  { value: "inter", label: "To another state", description: "IGST, all of it." },
];

const CUSTOM = "custom";
type RateChoice = `${(typeof GST_RATES)[number]}` | typeof CUSTOM;

const RATES: ChoiceOption<RateChoice>[] = [
  ...GST_RATES.map((rate) => ({ value: `${rate}` as RateChoice, label: formatRate(rate) })),
  { value: CUSTOM, label: "Custom" },
];

const rupees = (amount: number) => formatMoney(amount, "INR");

export function GstCalculator() {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<GstMode>("add");
  const [rateChoice, setRateChoice] = useState<RateChoice>(`${DEFAULT_GST_RATE}` as RateChoice);
  const [customRate, setCustomRate] = useState("");
  const [supply, setSupply] = useState<GstSupply>("intra");

  const rate = rateChoice === CUSTOM ? parseAmount(customRate) : Number(rateChoice);
  const result = calculateGst({ amount: parseAmount(amount), rate, mode, supply });
  const half = formatRate(result.rate / 2);
  const rateNumber = formatRate(result.rate).replace("%", "");

  const taxRows: BreakdownRow[] =
    supply === "intra"
      ? [
          { label: `CGST @ ${half}`, values: [rupees(result.cgst)] },
          { label: `SGST @ ${half}`, values: [rupees(result.sgst)] },
        ]
      : [{ label: `IGST @ ${formatRate(result.rate)}`, values: [rupees(result.igst)] }];

  return (
    <CalculatorLayout
      inputs={
        <FormSection title="Amount and rate">
          <ChoiceGroup
            name="gst-mode"
            legend="What do you want to do?"
            options={MODES}
            value={mode}
            onChange={setMode}
            className="grid sm:grid-cols-2"
          />
          <AmountField
            id="gst-amount"
            label={mode === "add" ? "Amount before GST" : "Amount including GST"}
            value={amount}
            onChange={setAmount}
            prefix="₹"
            placeholder={mode === "add" ? "e.g. 10,000" : "e.g. 11,800"}
          />
          <ChoiceGroup
            name="gst-rate"
            legend="GST rate"
            options={RATES}
            value={rateChoice}
            onChange={setRateChoice}
            hint="5% and 18% are the main rates since 22 September 2025; 40% is for luxury and sin goods."
          />
          {rateChoice === CUSTOM && (
            <AmountField
              id="gst-custom-rate"
              label="Custom rate"
              value={customRate}
              onChange={setCustomRate}
              suffix="%"
              placeholder="e.g. 12"
              hint="For any other rate, such as 12% or 28% on an invoice from before 22 September 2025."
              className="sm:w-1/2"
            />
          )}
          <ChoiceGroup
            name="gst-supply"
            legend="Where is the supply?"
            options={SUPPLIES}
            value={supply}
            onChange={setSupply}
            hint="Decided by the place of supply: usually where the goods are delivered or the customer is."
            className="grid sm:grid-cols-2"
          />
        </FormSection>
      }
      results={
        <ResultsCard>
          {mode === "add" ? (
            <ResultHeadline
              label="Total including GST"
              value={rupees(result.total)}
              detail={`Includes ${rupees(result.gst)} GST at ${formatRate(result.rate)}`}
            />
          ) : (
            <ResultHeadline
              label="Amount before GST"
              value={rupees(result.base)}
              detail={`${rupees(result.gst)} of the amount is GST at ${formatRate(result.rate)}`}
            />
          )}

          <BreakdownTable
            caption="Breakdown"
            columns={["Amount"]}
            rows={[
              { label: "Amount before GST", values: [rupees(result.base)] },
              ...taxRows,
              { label: "Total GST", values: [rupees(result.gst)] },
              { label: "Total including GST", values: [rupees(result.total)], tone: "highlight" },
            ]}
          />

          <div className="rounded-lg bg-subtle p-4 text-sm">
            <p className="font-bold">Formula used</p>
            {mode === "add" ? (
              <p className="mt-1 break-words tabular-nums">
                GST = {rupees(result.base)} × {formatRate(result.rate)} = {rupees(result.gst)}
                <br />
                Total = {rupees(result.base)} + {rupees(result.gst)} = {rupees(result.total)}
              </p>
            ) : (
              <p className="mt-1 break-words tabular-nums">
                Amount before GST = {rupees(result.total)} × 100 ÷ (100 + {rateNumber}) ={" "}
                {rupees(result.base)}
                <br />
                GST = {rupees(result.total)} − {rupees(result.base)} = {rupees(result.gst)}
              </p>
            )}
          </div>

          <NextStepLink toolSlug="gst-calculator" label="Make a GST invoice" />
        </ResultsCard>
      }
    />
  );
}
