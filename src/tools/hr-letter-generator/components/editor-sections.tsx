"use client";

import {
  Award,
  DoorOpen,
  FileCheck2,
  Handshake,
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";
import { get, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { EntryList } from "@/components/tool/entry-list";
import { FieldRow, FormSection } from "@/components/tool/form";
import { NumberField, SelectField, TextAreaField, TextField } from "@/components/tool/form-fields";
import { ImageField } from "@/components/tool/image-field";
import { Button } from "@/components/ui/button";
import { formatMoney, getCurrencyOptions, POPULAR_CURRENCIES } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { breakdownFromCtc, createBreakdownRow, createCustomTerm } from "../defaults";
import { breakdownAnnualTotal } from "../lib/letters";
import type { HrLetter, LetterKind } from "../schema";

function useLetterValue<K extends keyof HrLetter>(name: K): HrLetter[K] {
  return useWatch<HrLetter, K>({ name });
}

const KINDS: { kind: LetterKind; label: string; description: string; icon: LucideIcon }[] = [
  { kind: "offer", label: "Offer letter", description: "Offer a job or internship.", icon: Handshake },
  {
    kind: "appointment",
    label: "Appointment letter",
    description: "Formal terms on joining.",
    icon: FileCheck2,
  },
  {
    kind: "experience",
    label: "Experience letter",
    description: "Certify past work or an internship.",
    icon: Award,
  },
  { kind: "relieving", label: "Relieving letter", description: "Confirm a resignation.", icon: DoorOpen },
  {
    kind: "increment",
    label: "Increment letter",
    description: "A salary revision or promotion.",
    icon: TrendingUp,
  },
];

export function LetterTypeSection() {
  const { setValue } = useFormContext<HrLetter>();
  const kind = useLetterValue("kind");

  return (
    <FormSection title="Letter">
      <div role="radiogroup" aria-label="Type of letter" className="grid gap-2 sm:grid-cols-3">
        {KINDS.map((option) => {
          const selected = option.kind === kind;
          return (
            <button
              key={option.kind}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setValue("kind", option.kind, { shouldDirty: true })}
              className={cn(
                "flex flex-col items-start rounded-lg border p-3 text-left transition-colors",
                selected ? "border-brand bg-brand-soft" : "border-border hover:border-brand/60",
              )}
            >
              <option.icon
                className={cn("size-5", selected ? "text-brand-strong" : "text-muted")}
                aria-hidden
              />
              <span className="mt-2 text-sm font-bold">{option.label}</span>
              <span className="mt-0.5 text-xs text-muted">{option.description}</span>
            </button>
          );
        })}
      </div>
      <FieldRow>
        {kind !== "relieving" && kind !== "increment" ? (
          <SelectField<HrLetter> name="employmentType" label="Type of role">
            <option value="full-time">Full-time employment</option>
            <option value="part-time">Part-time employment</option>
            <option value="contract">Fixed-term contract</option>
            <option value="internship">Internship</option>
          </SelectField>
        ) : (
          <div className="hidden sm:block" />
        )}
        <TextField<HrLetter> name="letterDate" label="Date of the letter" type="date" />
      </FieldRow>
      <TextField<HrLetter>
        name="reference"
        label="Reference number (optional)"
        placeholder="e.g. BT/HR/2026/041"
        className="sm:w-1/2"
      />
    </FormSection>
  );
}

export function CompanySection() {
  return (
    <FormSection title="Company" description="Printed as the letterhead.">
      <ImageField<HrLetter> name="company.logo" label="Logo (optional)" />
      <TextField<HrLetter>
        name="company.name"
        label="Company name"
        placeholder="e.g. Bluefin Technologies Pvt Ltd"
        autoComplete="organization"
      />
      <TextAreaField<HrLetter>
        name="company.address"
        label="Address"
        rows={2}
        placeholder="e.g. 4th Floor, Prestige Tech Park, Outer Ring Road, Bengaluru, Karnataka 560103"
      />
      <FieldRow>
        <TextField<HrLetter>
          name="company.email"
          label="Email (optional)"
          type="email"
          placeholder="e.g. hr@company.com"
        />
        <TextField<HrLetter>
          name="company.phone"
          label="Phone (optional)"
          type="tel"
          placeholder="e.g. +91 80 4123 5678"
        />
      </FieldRow>
      <TextField<HrLetter>
        name="company.website"
        label="Website (optional)"
        placeholder="e.g. www.company.com"
        className="sm:w-1/2"
      />
    </FormSection>
  );
}

export function EmployeeSection() {
  const kind = useLetterValue("kind");
  const internship = useLetterValue("employmentType") === "internship";
  const candidate = kind === "offer";
  const withAddress = kind !== "experience";
  const withId = kind !== "offer" && kind !== "appointment";

  return (
    <FormSection title={candidate ? (internship ? "Intern" : "Candidate") : "Employee"}>
      <FieldRow>
        <TextField<HrLetter> name="employee.name" label="Full name" placeholder="e.g. Priya Nair" />
        <SelectField<HrLetter>
          name="employee.pronoun"
          label="Refer to them as"
          hint="Used where the letter mentions them, e.g. “we wish them success”."
        >
          <option value="they">They / them</option>
          <option value="she">She / her</option>
          <option value="he">He / him</option>
        </SelectField>
      </FieldRow>
      {withId && (
        <TextField<HrLetter>
          name="employee.employeeId"
          label="Employee ID (optional)"
          placeholder="e.g. BT-0142"
          className="sm:w-1/2"
        />
      )}
      {withAddress && (
        <TextAreaField<HrLetter>
          name="employee.address"
          label="Address (optional)"
          rows={2}
          placeholder="e.g. 21, 3rd Cross, Jayanagar 4th Block, Bengaluru, Karnataka 560011"
        />
      )}
    </FormSection>
  );
}

const REMARKS_PLACEHOLDERS: Partial<Record<LetterKind, string>> = {
  experience:
    "e.g. During their time with us, Priya led the redesign of our mobile app and was a dependable, well-liked member of the team.",
  relieving:
    "e.g. Your full and final settlement of ₹1,24,500 will be paid on 30 October 2026. You have returned your laptop and ID card, and no dues are outstanding.",
};

export function RoleSection() {
  const kind = useLetterValue("kind");
  const internship = useLetterValue("employmentType") === "internship";
  const joining = kind === "offer" || kind === "appointment";

  return (
    <FormSection title={kind === "increment" ? "Role" : internship ? "Internship" : "Role and dates"}>
      <FieldRow>
        <TextField<HrLetter>
          name="designation"
          label={kind === "increment" ? "Current designation" : "Designation"}
          placeholder={internship ? "e.g. Marketing Intern" : "e.g. Senior Product Designer"}
        />
        {kind === "increment" ? (
          <TextField<HrLetter>
            name="newDesignation"
            label="New designation (optional)"
            placeholder="e.g. Design Lead"
            hint="Fill in for a promotion; leave blank for a salary revision."
          />
        ) : (
          <TextField<HrLetter> name="department" label="Department (optional)" placeholder="e.g. Design" />
        )}
      </FieldRow>

      {kind === "increment" && (
        <TextField<HrLetter> name="effectiveDate" label="Effective from" type="date" className="sm:w-1/2" />
      )}

      {kind !== "increment" && (
        <FieldRow>
          <TextField<HrLetter>
            name="joiningDate"
            label={joining ? (internship ? "Start date" : "Joining date") : "Date of joining"}
            type="date"
          />
          {(!joining || internship) && (
            <TextField<HrLetter>
              name="endDate"
              label={joining ? "End date" : "Last working day"}
              type="date"
            />
          )}
          {kind === "offer" && !internship && (
            <TextField<HrLetter>
              name="offerValidUntil"
              label="Accept by (optional)"
              type="date"
              hint="The date the offer expires."
            />
          )}
        </FieldRow>
      )}
      {kind === "offer" && internship && (
        <TextField<HrLetter>
          name="offerValidUntil"
          label="Accept by (optional)"
          type="date"
          className="sm:w-1/2"
        />
      )}
      {kind === "relieving" && (
        <TextField<HrLetter>
          name="resignationDate"
          label="Resignation date (optional)"
          type="date"
          className="sm:w-1/2"
        />
      )}

      {joining && (
        <>
          <FieldRow>
            <TextField<HrLetter>
              name="location"
              label="Place of work (optional)"
              placeholder="e.g. our Bengaluru office"
            />
            <TextField<HrLetter>
              name="reportingTo"
              label="Reports to (optional)"
              placeholder="e.g. Arjun Mehta, Design Lead"
            />
          </FieldRow>
          <TextField<HrLetter>
            name="workingHours"
            label="Working hours (optional)"
            placeholder="e.g. Monday to Friday, 9:30 am to 6:30 pm"
          />
        </>
      )}

      {(kind === "experience" || kind === "relieving") && (
        <TextAreaField<HrLetter>
          name="remarks"
          label={kind === "experience" ? "About their work (optional)" : "Settlement and handover (optional)"}
          rows={3}
          placeholder={REMARKS_PLACEHOLDERS[kind]}
          hint="Leave blank for the standard wording."
        />
      )}
    </FormSection>
  );
}

function BreakdownRows() {
  const { control, getValues, formState } = useFormContext<HrLetter>();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "salaryBreakdown",
    keyName: "key",
  });
  const rows = useLetterValue("salaryBreakdown");
  const pay = useLetterValue("pay");
  const currency = useLetterValue("currency");
  const annual = breakdownAnnualTotal({ salaryBreakdown: rows ?? [] });
  const mismatch = fields.length > 0 && pay > 0 && Math.abs(annual - pay) >= 1;
  const listError = get(formState.errors, "salaryBreakdown");

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold">Salary breakdown (optional)</p>
          <p className="text-xs text-muted">Monthly amounts, printed as Annexure A with yearly totals.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={!(pay > 0)}
          onClick={() => replace(breakdownFromCtc(getValues("pay")))}
        >
          <Sparkles /> Fill from CTC
        </Button>
      </div>
      <datalist id="salary-components">
        {[
          "Basic salary",
          "House rent allowance (HRA)",
          "Special allowance",
          "Dearness allowance (DA)",
          "Conveyance allowance",
          "Leave travel allowance (LTA)",
          "Employer's PF contribution",
          "Gratuity",
          "Performance bonus",
        ].map((label) => (
          <option key={label} value={label} />
        ))}
      </datalist>
      <div className="mt-3 space-y-3">
        {fields.map((field, index) => (
          <div key={field.key} className="flex items-start gap-2">
            <div className="grid flex-1 gap-2 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <TextField<HrLetter>
                name={`salaryBreakdown.${index}.label`}
                label={index === 0 ? "Component" : `Component ${index + 1}`}
                placeholder="e.g. Basic salary"
                list="salary-components"
              />
              <NumberField<HrLetter>
                name={`salaryBreakdown.${index}.monthly`}
                label="Per month"
                placeholder="e.g. 40000"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="mt-7"
              onClick={() => remove(index)}
              aria-label={`Remove salary component ${index + 1}`}
            >
              <Trash2 className="text-muted" />
            </Button>
          </div>
        ))}
      </div>
      {listError?.message && (
        <p className="mt-2 text-sm font-medium text-danger">{String(listError.message)}</p>
      )}
      {mismatch && (
        <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          The breakdown adds up to {formatMoney(annual, currency)} a year, but the CTC is{" "}
          {formatMoney(pay, currency)}.
        </p>
      )}
      <Button variant="outline" size="sm" className="mt-3" onClick={() => append(createBreakdownRow())}>
        <Plus /> Add component
      </Button>
    </div>
  );
}

export function PaySection() {
  const kind = useLetterValue("kind");
  const internship = useLetterValue("employmentType") === "internship";
  const currencies = useMemo(() => getCurrencyOptions(), []);
  const popular = currencies.filter((option) => POPULAR_CURRENCIES.includes(option.code));
  if (kind === "experience" || kind === "relieving") return null;
  const increment = kind === "increment";

  return (
    <FormSection title={internship && !increment ? "Stipend and terms" : "Salary and terms"}>
      <FieldRow>
        <NumberField<HrLetter>
          name="pay"
          label={increment ? "Revised annual CTC" : internship ? "Monthly stipend" : "Annual CTC"}
          placeholder={internship && !increment ? "e.g. 15000" : "e.g. 1800000"}
        />
        {increment ? (
          <NumberField<HrLetter>
            name="previousPay"
            label="Current annual CTC (optional)"
            placeholder="e.g. 1500000"
            hint="Shows the old CTC and the percentage rise."
          />
        ) : (
          <SelectField<HrLetter> name="currency" label="Currency">
            <optgroup label="Popular">
              {popular.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.code} - {option.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="All currencies">
              {currencies.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.code} - {option.name}
                </option>
              ))}
            </optgroup>
          </SelectField>
        )}
      </FieldRow>
      {!increment && (
        <FieldRow>
          {internship ? (
            <div className="hidden sm:block" />
          ) : (
            <NumberField<HrLetter>
              name="probationMonths"
              label="Probation (months)"
              step={1}
              placeholder="e.g. 6"
              hint="0 for no probation."
            />
          )}
          <NumberField<HrLetter>
            name="noticeDays"
            label="Notice period (days)"
            step={1}
            placeholder="e.g. 30"
            hint="0 to leave it out."
          />
        </FieldRow>
      )}
      {!internship && <BreakdownRows />}
    </FormSection>
  );
}

export function CustomTermsSection() {
  const kind = useLetterValue("kind");
  const terms = kind === "offer" || kind === "appointment";
  return (
    <EntryList<HrLetter, "customTerms">
      name="customTerms"
      title={terms ? "Extra terms" : "Extra paragraphs"}
      description={
        terms
          ? "Anything else: a joining bonus, a laptop, shift duty, background verification..."
          : "Anything else you'd like the letter to say."
      }
      addLabel={terms ? "Add term" : "Add paragraph"}
      create={createCustomTerm}
      summarize={(term) => term.title || term.text.slice(0, 50)}
      fallbackTitle={terms ? "New term" : "New paragraph"}
      renderFields={(index) => (
        <>
          <TextField<HrLetter>
            name={`customTerms.${index}.title`}
            label={terms ? "Heading" : "Heading (optional)"}
            placeholder="e.g. Joining bonus"
            hint={
              terms ? undefined : "With a heading it's numbered like a term; without, it's a plain paragraph."
            }
          />
          <TextAreaField<HrLetter>
            name={`customTerms.${index}.text`}
            label="Text"
            rows={3}
            placeholder="e.g. You will receive a one-time joining bonus of ₹50,000 with your first salary."
          />
        </>
      )}
    />
  );
}

export function SignatorySection() {
  return (
    <FormSection title="Signed by" description="Who signs for the company, usually HR or a director.">
      <FieldRow>
        <TextField<HrLetter> name="signatory.name" label="Name" placeholder="e.g. Meera Iyer" />
        <TextField<HrLetter> name="signatory.title" label="Title" placeholder="e.g. Head of People" />
      </FieldRow>
      <ImageField<HrLetter>
        name="signatory.signature"
        label="Signature (optional)"
        hint="A photo or scan of the signature on white paper. It stays on your device."
      />
    </FormSection>
  );
}
