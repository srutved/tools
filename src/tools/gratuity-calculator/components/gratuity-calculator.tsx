"use client";

import { useState, type ReactNode } from "react";
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
import { Field, FieldRow, FormAlert, FormSection } from "@/components/tool/form";
import { Input } from "@/components/ui/input";
import { todayIso } from "@/lib/date";
import { parseAmount } from "@/lib/parse-amount";
import {
  calculateGratuity,
  DAYS_PER_YEAR,
  formatService,
  formatYears,
  GRATUITY_CAP,
  type EmploymentType,
} from "../lib/gratuity";

const EMPLOYMENT_TYPES: ChoiceOption<EmploymentType>[] = [
  { value: "permanent", label: "Permanent", description: "Eligible after 5 years of continuous service." },
  { value: "fixed-term", label: "Fixed-term", description: "Eligible after 1 year, paid pro rata." },
];

/** The line under the dates showing the length of service, which describes both date fields. */
const SERVICE_ID = "gratuity-service";

type Coverage = "yes" | "no";

const COVERAGE: ChoiceOption<Coverage>[] = [
  {
    value: "yes",
    label: "Yes",
    description: "10 or more employees. 15 days' wages a year, on a 26-day month.",
  },
  { value: "no", label: "No", description: "Fewer than 10. Usually half a month's wages a year." },
];

export function GratuityCalculator() {
  const [joiningDate, setJoiningDate] = useState("");
  const [leavingDate, setLeavingDate] = useState("");
  const [basicDa, setBasicDa] = useState("");
  const [totalPay, setTotalPay] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("permanent");
  const [coverage, setCoverage] = useState<Coverage>("yes");

  const covered = coverage === "yes";
  const result = calculateGratuity({
    joiningDate,
    leavingDate,
    basicDa: parseAmount(basicDa),
    totalPay: parseAmount(totalPay),
    employmentType,
    covered,
  });
  const { service } = result;
  const hasWages = result.wages > 0;
  const ready = service !== null && hasWages;

  const serviceHint =
    result.datesProblem === "order"
      ? "The last working day is before the date of joining."
      : service
        ? `Service: ${formatService(service)}.`
        : "Your first and last working days both count.";

  const headlineDetail = !service
    ? "Enter your dates of joining and leaving."
    : !hasWages
      ? "Enter your monthly basic salary + DA."
      : `For ${formatYears(result.yearsCounted)} of service, on ${rupees(result.wages)} a month`;

  const notEligibleMessage =
    service && !result.eligible
      ? employmentType === "permanent"
        ? `Gratuity is payable to permanent employees after ${formatYears(result.minimumYears)} of continuous service, and you have ${formatService(service)}. The figure above is what it would be. The five-year rule doesn't apply if employment ends because of death or disablement.`
        : `Fixed-term employees qualify after ${formatYears(result.minimumYears)} of service, and you have ${formatService(service)}. The figure above is what it would be.`
      : null;

  const serviceRule = !service
    ? null
    : covered
      ? result.roundedUp
        ? `The extra ${formatService({ years: 0, months: service.months, days: service.days })} is more than six months, so it counts as a full year.`
        : service.months > 0 || service.days > 0
          ? "The last part-year is six months or less, so it isn't counted."
          : null
      : service.months > 0 || service.days > 0
        ? "Without a covered employer, only completed years are counted."
        : null;

  const notes: ReactNode[] = [
    result.wagesRaised &&
      `Your basic + DA (${rupees(parseAmount(basicDa))}) is less than half your total pay (${rupees(parseAmount(totalPay))}), so half of it, ${rupees(result.wages)}, is used as wages. Under the labour codes, allowances above 50% of pay count as wages.`,
    !covered &&
      "Employers not covered by the gratuity law don't have to pay gratuity, but many do under their own policy or your contract. Half a month's wages for each completed year is the usual basis, and the one the tax rules use.",
    result.aboveCap
      ? `By law, an employer has to pay at most ${rupees(GRATUITY_CAP)}. Anything above that depends on your employer's own scheme.`
      : `By law, an employer has to pay at most ${rupees(GRATUITY_CAP)} in gratuity.`,
    `Gratuity is tax-free up to ${rupees(GRATUITY_CAP)} in total over your working life for private-sector employees, and fully tax-free for government employees. Tax-free gratuity you've received from an earlier employer uses up part of the limit.`,
    "An estimate, not legal or tax advice. Your employer works out the final amount, so check the figures with them.",
  ].filter(Boolean);

  return (
    <CalculatorLayout
      inputs={
        <>
          <FormSection title="Your service" description="From your appointment and relieving letters.">
            <FieldRow>
              <DateField
                id="gratuity-joining"
                label="Date of joining"
                value={joiningDate}
                onChange={setJoiningDate}
              />
              <DateField
                id="gratuity-leaving"
                label="Last working day"
                value={leavingDate}
                onChange={setLeavingDate}
                invalid={result.datesProblem === "order"}
                action={
                  <button
                    type="button"
                    onClick={() => setLeavingDate(todayIso())}
                    className="font-semibold text-brand-strong underline-offset-2 hover:underline"
                  >
                    Use today&apos;s date
                  </button>
                }
              />
            </FieldRow>
            <p
              id={SERVICE_ID}
              className={
                result.datesProblem === "order" ? "text-sm font-medium text-danger" : "text-sm text-muted"
              }
            >
              {serviceHint}
            </p>
            <ChoiceGroup
              name="gratuity-employment"
              legend="Employment type"
              options={EMPLOYMENT_TYPES}
              value={employmentType}
              onChange={setEmploymentType}
              className="grid sm:grid-cols-2"
            />
            <ChoiceGroup
              name="gratuity-covered"
              legend="Is your employer covered by the gratuity law?"
              options={COVERAGE}
              value={coverage}
              onChange={setCoverage}
              hint="The law covers shops and businesses that have had 10 or more employees on any day in the last 12 months. Once covered, always covered."
              className="grid sm:grid-cols-2"
            />
          </FormSection>

          <FormSection title="Your wages" description="As on your last payslip, a month.">
            <FieldRow>
              <AmountField
                id="gratuity-basic"
                label="Basic salary + DA"
                value={basicDa}
                onChange={setBasicDa}
                prefix="₹"
                suffix="a month"
                placeholder="e.g. 50,000"
                hint="Last drawn basic pay plus dearness allowance (DA), if any."
              />
              <AmountField
                id="gratuity-total-pay"
                label="Total monthly pay (optional)"
                value={totalPay}
                onChange={setTotalPay}
                prefix="₹"
                suffix="a month"
                placeholder="e.g. 1,00,000"
                hint="Gross pay before deductions. If basic + DA is less than half of it, half is used instead."
              />
            </FieldRow>
          </FormSection>
        </>
      }
      results={
        <ResultsCard>
          <ResultHeadline
            label={result.eligible || !ready ? "Your gratuity" : "Your gratuity (not yet payable)"}
            value={rupees(ready ? result.gratuity : 0)}
            detail={headlineDetail}
          />

          {ready && notEligibleMessage && <FormAlert>{notEligibleMessage}</FormAlert>}

          {ready && (
            <>
              <BreakdownTable
                caption="How it's worked out"
                columns={["Figure"]}
                rows={[
                  { label: "Length of service", values: [formatService(service)] },
                  { label: "Years counted", values: [formatYears(result.yearsCounted)] },
                  { label: "Monthly wages used", values: [rupees(result.wages)] },
                  { label: "Gratuity", values: [rupees(result.gratuity)], tone: "highlight" },
                ]}
              />

              <div className="rounded-lg border border-border p-4 text-sm">
                <p className="font-bold">The formula</p>
                <p className="mt-2 tabular-nums">
                  {rupees(result.wages)} × {DAYS_PER_YEAR} × {result.yearsCounted} ÷ {result.divisor} ={" "}
                  <strong>{rupees(result.gratuity)}</strong>
                </p>
                <p className="mt-2 text-muted">
                  Monthly wages × {DAYS_PER_YEAR} days × years of service ÷{" "}
                  {covered
                    ? "26 working days in a month."
                    : "30 days in a month, which is half a month's wages for each year."}
                  {serviceRule && ` ${serviceRule}`}
                </p>
              </div>

              <BreakdownTable
                caption="Income tax (private sector)"
                columns={["Amount"]}
                rows={[
                  { label: `Tax-free (up to ${rupees(GRATUITY_CAP)})`, values: [rupees(result.taxFree)] },
                  { label: "Taxable, added to your income", values: [rupees(result.taxable)] },
                  { label: "Total gratuity", values: [rupees(result.gratuity)], tone: "total" },
                ]}
              />
            </>
          )}

          <CalculatorNotes title="Good to know" notes={notes} />

          <NextStepLink toolSlug="gratuity-calculator" label="Make a relieving letter" />
        </ResultsCard>
      }
    />
  );
}

/**
 * A native date picker (supported by every current browser), described by the service line under
 * both dates, with an optional action under it.
 */
function DateField({
  id,
  label,
  value,
  onChange,
  action,
  invalid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  action?: ReactNode;
  invalid?: boolean;
}) {
  return (
    <Field label={label} htmlFor={id}>
      <Input
        id={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={SERVICE_ID}
      />
      {action && <div className="mt-1 text-xs">{action}</div>}
    </Field>
  );
}
