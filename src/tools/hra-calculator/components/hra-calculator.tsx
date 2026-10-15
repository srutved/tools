"use client";

import { useState } from "react";
import {
  AmountField,
  BreakdownTable,
  CalculatorLayout,
  CalculatorNotes,
  ChoiceGroup,
  NextStepLink,
  ResultHeadline,
  ResultsCard,
  SelectField,
  type ChoiceOption,
} from "@/components/tool/calculator";
import { FieldRow, FormSection } from "@/components/tool/form";
import { Badge } from "@/components/ui/card";
import { formatMoney } from "@/lib/currency";
import { amountToInput, parseAmount } from "@/lib/parse-amount";
import {
  becameMetroIn2026,
  calculateHraExemption,
  cityLabel,
  DEFAULT_HRA_TAX_YEAR,
  HRA_CITIES,
  HRA_TAX_YEARS,
  type HraCity,
  type HraLimit,
  type HraTaxYear,
} from "../lib/hra";

type Period = "monthly" | "yearly";

const PERIODS: ChoiceOption<Period>[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

/** Rent above this a year means the employer needs the landlord's PAN. */
const LANDLORD_PAN_LIMIT = 100000;

const rupees = (amount: number) => formatMoney(amount, "INR");

export function HraCalculator() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [basic, setBasic] = useState("");
  const [hra, setHra] = useState("");
  const [rent, setRent] = useState("");
  const [city, setCity] = useState<HraCity | "">("");
  const [taxYear, setTaxYear] = useState<HraTaxYear>(DEFAULT_HRA_TAX_YEAR);

  // Switching between monthly and yearly converts what's been typed, so the figures keep their meaning.
  const changePeriod = (next: Period) => {
    if (next === period) return;
    const factor = next === "yearly" ? 12 : 1 / 12;
    const convert = (value: string) => amountToInput(parseAmount(value) * factor);
    setBasic(convert);
    setHra(convert);
    setRent(convert);
    setPeriod(next);
  };

  const result = calculateHraExemption({
    basic: parseAmount(basic),
    hraReceived: parseAmount(hra),
    rentPaid: parseAmount(rent),
    city,
    taxYear,
  });

  // Show every amount both monthly and yearly, whichever way it was entered.
  const toMonthly = period === "monthly" ? 1 : 1 / 12;
  const toYearly = period === "monthly" ? 12 : 1;
  const both = (amount: number) => [rupees(amount * toMonthly), rupees(amount * toYearly)];
  const yearlyRent = parseAmount(rent) * toYearly;
  const monthlyRent = Math.round(parseAmount(rent) * toMonthly);
  const yearLabel = HRA_TAX_YEARS.find((year) => year.id === taxYear)!.label;

  const limitLabels: Record<HraLimit, string> = {
    actualHra: "HRA received",
    rentOverTenPercent: "Rent paid minus 10% of basic + DA",
    percentOfBasic: `${result.basicPercent}% of basic + DA (${result.metro ? "metro" : "non-metro"})`,
  };
  const limitRows = (Object.keys(limitLabels) as HraLimit[]).map((key) => ({
    label:
      key === result.least ? (
        <span className="flex flex-wrap items-center gap-2">
          {limitLabels[key]} <Badge>Lowest</Badge>
        </span>
      ) : (
        limitLabels[key]
      ),
    values: both(result.limits[key]),
    tone: key === result.least ? ("highlight" as const) : undefined,
  }));

  const cityNote =
    city === ""
      ? "Choose your city: the limit is 50% of basic + DA in a metro and 40% elsewhere. Until then, 40% is used."
      : becameMetroIn2026(city)
        ? taxYear === "2025-26"
          ? `${cityLabel(city)} counts as a metro only from FY 2026-27, so the 40% limit applies for FY 2025-26.`
          : `${cityLabel(city)} counts as a metro from FY 2026-27, so the 50% limit applies.`
        : null;

  const notes = [
    cityNote,
    "The HRA exemption is only available under the old tax regime. In the new regime, all of your HRA is taxable.",
    yearlyRent > LANDLORD_PAN_LIMIT
      ? `Your rent is over ${rupees(LANDLORD_PAN_LIMIT)} a year, so your employer will need your landlord's PAN.`
      : `If your rent is over ${rupees(LANDLORD_PAN_LIMIT)} a year, your employer will need your landlord's PAN.`,
    "Keep rent receipts (and ideally a rent agreement): your employer will ask for them as proof.",
  ].filter((note): note is string => Boolean(note));

  const amountHint = period === "monthly" ? "a month" : "a year";

  return (
    <CalculatorLayout
      inputs={
        <>
          <FormSection
            title="Your salary and rent"
            description="Use the figures from your payslip and rent agreement."
          >
            <ChoiceGroup
              name="hra-period"
              legend="Enter amounts"
              options={PERIODS}
              value={period}
              onChange={changePeriod}
              hint="Switching converts the amounts you've already entered."
            />
            <AmountField
              id="hra-basic"
              label="Basic salary + DA"
              value={basic}
              onChange={setBasic}
              prefix="₹"
              suffix={amountHint}
              placeholder={period === "monthly" ? "e.g. 50,000" : "e.g. 6,00,000"}
              hint="Dearness allowance (DA) counts only if it's part of your retirement benefits. Most private-sector salaries have none."
            />
            <AmountField
              id="hra-received"
              label="HRA received"
              value={hra}
              onChange={setHra}
              prefix="₹"
              suffix={amountHint}
              placeholder={period === "monthly" ? "e.g. 20,000" : "e.g. 2,40,000"}
              hint="The house rent allowance on your payslip."
            />
            <AmountField
              id="hra-rent"
              label="Rent paid"
              value={rent}
              onChange={setRent}
              prefix="₹"
              suffix={amountHint}
              placeholder={period === "monthly" ? "e.g. 25,000" : "e.g. 3,00,000"}
            />
          </FormSection>
          <FormSection title="City and year">
            <FieldRow>
              <SelectField
                id="hra-city"
                label="City you live in"
                value={city}
                onChange={(value) => setCity(value as HraCity)}
                options={HRA_CITIES}
                placeholder="Choose your city"
                hint="Where the rented home is."
              />
              <SelectField
                id="hra-tax-year"
                label="Tax year"
                value={taxYear}
                onChange={(value) => setTaxYear(value as HraTaxYear)}
                options={HRA_TAX_YEARS}
                hint="FY 2026-27 runs from April 2026 to March 2027."
              />
            </FieldRow>
          </FormSection>
        </>
      }
      results={
        <ResultsCard>
          <ResultHeadline
            label={`Tax-free HRA for ${yearLabel}`}
            value={rupees(result.exempt * toYearly)}
            detail={`${rupees(result.exempt * toMonthly)} a month · Taxable HRA ${rupees(result.taxable * toYearly)} a year`}
          />

          <BreakdownTable
            caption="The exemption is the lowest of"
            columns={["Monthly", "Yearly"]}
            rows={limitRows}
          />

          <BreakdownTable
            caption="Your HRA"
            columns={["Monthly", "Yearly"]}
            rows={[
              { label: "HRA received", values: both(result.limits.actualHra) },
              { label: "Exempt (tax-free) HRA", values: both(result.exempt), tone: "highlight" },
              { label: "Taxable HRA", values: both(result.taxable), tone: "total" },
            ]}
          />

          <CalculatorNotes title="Good to know" notes={notes} />

          <NextStepLink
            toolSlug="hra-calculator"
            href={monthlyRent > 0 ? `/rent-receipt-generator?rent=${monthlyRent}` : undefined}
            label="Make rent receipts"
          />
        </ResultsCard>
      }
    />
  );
}
