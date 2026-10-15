"use client";

import { Info } from "lucide-react";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FieldRow, FormSection } from "@/components/tool/form";
import { NumberField, SelectField, TextAreaField, TextField } from "@/components/tool/form-fields";
import { ImageField } from "@/components/tool/image-field";
import { MonthField } from "@/components/tool/month-field";
import { Button } from "@/components/ui/button";
import { addMonths, currentMonth, financialYear, formatMonth } from "@/lib/date";
import { MAX_MONTHS, prepareRentReceipts } from "../lib/receipts";
import { PAYMENT_MODE_LABELS, PAYMENT_MODES, type RentReceipt } from "../schema";

const THIS_YEAR = Number(currentMonth().slice(0, 4));
const YEARS = Array.from({ length: 6 }, (_, index) => THIS_YEAR - 4 + index);

export function PartiesSection() {
  const monthlyRent = useWatch<RentReceipt, "monthlyRent">({ name: "monthlyRent" });
  const pan = useWatch<RentReceipt, "landlordPan">({ name: "landlordPan" });
  const panNeeded = (Number(monthlyRent) || 0) * 12 > 100_000;

  return (
    <FormSection title="Tenant and landlord">
      <FieldRow>
        <TextField<RentReceipt>
          name="tenantName"
          label="Tenant's name"
          placeholder="e.g. Rahul Verma"
          hint="The person paying the rent: you, if you are claiming HRA."
          autoComplete="name"
        />
        <TextField<RentReceipt>
          name="landlordName"
          label="Landlord's name"
          placeholder="e.g. Sunita Kapoor"
        />
      </FieldRow>
      <TextField<RentReceipt>
        name="landlordPan"
        label={panNeeded ? "Landlord's PAN" : "Landlord's PAN (optional)"}
        placeholder="e.g. ABCPK1234F"
        hint="10 characters: five letters, four digits, one letter."
        className="sm:w-1/2"
      />
      {panNeeded && !pan?.trim() && (
        <p className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            Your rent is over ₹1,00,000 a year, so your employer will need the landlord&apos;s PAN to allow
            the HRA exemption. Without one, the landlord can give a signed declaration instead.
          </span>
        </p>
      )}
      <TextAreaField<RentReceipt>
        name="landlordAddress"
        label="Landlord's address (optional)"
        rows={2}
        placeholder="e.g. 22 Park Street, Kolkata, West Bengal 700016"
        hint="Only if it differs from the rented property."
      />
    </FormSection>
  );
}

export function RentSection() {
  return (
    <FormSection title="Property and rent">
      <TextAreaField<RentReceipt>
        name="propertyAddress"
        label="Rented property's address"
        rows={2}
        placeholder="e.g. Flat 402, Lotus Residency, 5th Cross, Indiranagar, Bengaluru, Karnataka 560038"
      />
      <FieldRow>
        <NumberField<RentReceipt> name="monthlyRent" label="Monthly rent (₹)" placeholder="e.g. 25000" />
        <SelectField<RentReceipt> name="paymentMode" label="Paid by">
          {PAYMENT_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {PAYMENT_MODE_LABELS[mode].replace(/^./, (letter) => letter.toUpperCase())}
            </option>
          ))}
        </SelectField>
      </FieldRow>
    </FormSection>
  );
}

export function PeriodSection() {
  const { setValue } = useFormContext<RentReceipt>();
  const values = useWatch<RentReceipt>() as RentReceipt;
  const prepared = useMemo(() => prepareRentReceipts(values), [values]);
  const count = prepared.receipts.length;

  const setRange = ({ from, to }: { from: string; to: string }) => {
    setValue("from", from, { shouldDirty: true });
    setValue("to", to, { shouldDirty: true });
  };
  const thisYear = financialYear();
  const lastYear = financialYear(addMonths(thisYear.from, -1));

  return (
    <FormSection title="Months" description="One receipt is made for each month.">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setRange(thisYear)}>
          FY {thisYear.from.slice(0, 4)}-{thisYear.to.slice(2, 4)}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setRange(lastYear)}>
          FY {lastYear.from.slice(0, 4)}-{lastYear.to.slice(2, 4)}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRange({ from: currentMonth(), to: currentMonth() })}
        >
          This month only
        </Button>
      </div>
      <FieldRow>
        <MonthField<RentReceipt> name="from" label="From" years={YEARS} />
        <MonthField<RentReceipt> name="to" label="To" years={YEARS} />
      </FieldRow>
      <FieldRow>
        <NumberField<RentReceipt>
          name="paymentDay"
          label="Paid on day"
          min={1}
          step={1}
          placeholder="5"
          hint="Each receipt is dated on this day of its month."
        />
        <TextField<RentReceipt>
          name="numberPrefix"
          label="Receipt number prefix"
          placeholder="e.g. RR-"
          hint="Receipts are numbered RR-01, RR-02 and so on."
        />
      </FieldRow>
      {count > 0 && (
        <p className="rounded-lg bg-subtle p-3 text-sm">
          <span className="font-bold">
            {count} {count === 1 ? "receipt" : "receipts"}
          </span>{" "}
          from {formatMonth(values.from)} to {prepared.receipts[count - 1].period}, totalling{" "}
          <span className="font-bold">{prepared.total}</span>.
          {count === MAX_MONTHS && ` Receipts are capped at ${MAX_MONTHS} months per set.`}
        </p>
      )}
    </FormSection>
  );
}

export function SignatureSection() {
  return (
    <FormSection
      title="Signature"
      description="Add the landlord's signature, or leave it blank and have them sign the printed receipts."
    >
      <ImageField<RentReceipt>
        name="signature"
        label="Landlord's signature (optional)"
        hint="A photo or scan of the signature on white paper works best. It stays on your device."
      />
    </FormSection>
  );
}
