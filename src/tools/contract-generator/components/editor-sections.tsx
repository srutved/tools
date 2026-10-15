"use client";

import { FileSignature, FileText, ShieldCheck, TriangleAlert, type LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { EntryList } from "@/components/tool/entry-list";
import { FieldRow, FormSection } from "@/components/tool/form";
import {
  CheckboxField,
  NumberField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/tool/form-fields";
import { formatMoney, getCurrencyOptions, POPULAR_CURRENCIES } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { createCustomClause, createDeliverable, createMilestone } from "../defaults";
import { defaultTitle, partyRoles } from "../lib/clauses";
import type { Contract, ContractKind } from "../schema";

function useContractValue<K extends keyof Contract>(name: K): Contract[K] {
  return useWatch<Contract, K>({ name });
}

/** Shown at the top of the editor: what this tool is, and isn't. */
export function LegalNotice() {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>
        <span className="font-bold">A starting point, not legal advice.</span> These plain-English templates
        suit everyday freelance and business work. For high-value or unusual agreements, have a lawyer review
        the final version.
      </span>
    </p>
  );
}

const KINDS: { kind: ContractKind; label: string; description: string; icon: LucideIcon }[] = [
  {
    kind: "service",
    label: "Service agreement",
    description: "Freelance or agency work for a client.",
    icon: FileSignature,
  },
  { kind: "nda", label: "NDA", description: "Keep shared information confidential.", icon: ShieldCheck },
  {
    kind: "sow",
    label: "Statement of work",
    description: "Scope, timeline and fees for one project.",
    icon: FileText,
  },
];

export function ContractTypeSection() {
  const { setValue } = useFormContext<Contract>();
  const kind = useContractValue("kind");
  const ndaType = useContractValue("ndaType");

  return (
    <FormSection title="Contract type">
      <div role="radiogroup" aria-label="Contract type" className="grid gap-3 sm:grid-cols-3">
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
        <TextField<Contract>
          name="title"
          label="Title (optional)"
          placeholder={`e.g. ${defaultTitle({ kind, ndaType })}`}
          hint="Leave blank for the standard title."
        />
        <TextField<Contract> name="effectiveDate" label="Agreement date" type="date" />
      </FieldRow>
    </FormSection>
  );
}

function PartyFields({ party, title, hint }: { party: "you" | "other"; title: string; hint?: string }) {
  return (
    <FormSection title={title} description={hint}>
      <TextField<Contract>
        name={`${party}.name`}
        label="Name or company"
        placeholder={
          party === "you" ? "e.g. Riya Sharma or Bluefin Studio LLP" : "e.g. Brightside Cafe Pvt Ltd"
        }
      />
      <TextAreaField<Contract>
        name={`${party}.address`}
        label="Address"
        rows={2}
        placeholder="e.g. 14 FC Road, Shivajinagar, Pune, Maharashtra 411004"
      />
      <TextField<Contract>
        name={`${party}.email`}
        label="Email"
        type="email"
        placeholder="e.g. owner@company.com"
      />
      <FieldRow>
        <TextField<Contract>
          name={`${party}.signatory`}
          label="Signed by (optional)"
          placeholder="e.g. Aman Gupta"
          hint="For companies: who signs. Leave blank if signing yourself."
        />
        <TextField<Contract>
          name={`${party}.signatoryTitle`}
          label="Their title"
          placeholder="e.g. Director"
        />
      </FieldRow>
    </FormSection>
  );
}

export function PartiesSections() {
  const kind = useContractValue("kind");
  const ndaType = useContractValue("ndaType");
  const roles = partyRoles({ kind, ndaType });
  const mutual = kind === "nda" && ndaType === "mutual";
  return (
    <>
      <PartyFields party="you" title={mutual ? "You" : `You (${roles.you})`} />
      <PartyFields party="other" title={mutual ? "The other party" : roles.other} />
    </>
  );
}

export function NdaSection() {
  return (
    <FormSection title="Confidentiality">
      <SelectField<Contract> name="ndaType" label="Who shares information?">
        <option value="one-way">Only you (one-way NDA)</option>
        <option value="mutual">Both parties (mutual NDA)</option>
      </SelectField>
      <TextAreaField<Contract>
        name="purpose"
        label="Purpose"
        rows={2}
        placeholder="e.g. evaluating a potential partnership between the Parties"
        hint="Completes the sentence “…for the purpose of”. The narrower, the better protected you are."
      />
      <NumberField<Contract>
        name="confidentialityYears"
        label="Years confidentiality lasts"
        placeholder="3"
        hint="From each disclosure. 2-5 years is common."
        className="sm:w-1/2"
      />
    </FormSection>
  );
}

export function WorkSection() {
  const kind = useContractValue("kind");
  const sow = kind === "sow";
  return (
    <>
      {sow && (
        <FormSection title="Project">
          <TextField<Contract>
            name="projectName"
            label="Project name"
            placeholder="e.g. FreshBasket grocery delivery app - MVP"
          />
          <TextAreaField<Contract>
            name="overview"
            label="Overview (optional)"
            rows={3}
            placeholder="e.g. A short description of the project and its goals."
          />
          <TextField<Contract>
            name="masterAgreement"
            label="Master agreement (optional)"
            placeholder="e.g. the Master Services Agreement dated 1 June 2026"
            hint="If this SOW falls under one, its general terms apply instead of repeating them here."
          />
        </FormSection>
      )}
      <FormSection title={sow ? "Scope of work" : "The work"}>
        <TextAreaField<Contract>
          name="scope"
          label="Services"
          rows={5}
          placeholder={
            "e.g. Logo design with 3 concepts\nMenu card design\nTemplates for 10 social media posts"
          }
          hint="One service or task per line - each becomes a numbered item."
        />
        {sow && (
          <>
            <TextAreaField<Contract>
              name="outOfScope"
              label="Out of scope (optional)"
              rows={3}
              placeholder={"e.g. Content writing\nOngoing maintenance"}
              hint="One per line."
            />
            <TextAreaField<Contract>
              name="assumptions"
              label="Assumptions (optional)"
              rows={3}
              placeholder="e.g. The Client provides brand assets by 20 October 2026"
              hint="One per line."
            />
            <TextAreaField<Contract>
              name="acceptanceCriteria"
              label="Acceptance criteria (optional)"
              rows={3}
              placeholder="e.g. The app runs on Android 10 and later"
              hint="One per line."
            />
          </>
        )}
        <FieldRow>
          <TextField<Contract> name="startDate" label="Start date" type="date" />
          <TextField<Contract>
            name="endDate"
            label="End date (optional)"
            type="date"
            hint="Leave blank to run until the work is done."
          />
        </FieldRow>
      </FormSection>
      <EntryList<Contract, "deliverables">
        name="deliverables"
        title="Deliverables (optional)"
        description="Specific things you'll hand over, with due dates."
        addLabel="Add deliverable"
        create={createDeliverable}
        summarize={(item) => item.description}
        fallbackTitle="New deliverable"
        renderFields={(index) => (
          <FieldRow className="sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <TextField<Contract>
              name={`deliverables.${index}.description`}
              label="Deliverable"
              placeholder="e.g. Three logo concepts"
            />
            <TextField<Contract>
              name={`deliverables.${index}.date`}
              label="Due"
              placeholder="e.g. 30 October 2026"
            />
          </FieldRow>
        )}
      />
      <FormSection title="Revisions and ownership">
        <NumberField<Contract>
          name="revisions"
          label="Rounds of revisions included"
          placeholder="2"
          className="sm:w-1/2"
        />
        <SelectField<Contract> name="ipOwnership" label="Who owns the finished work?">
          <option value="assign-on-payment">The client, once they&apos;ve paid in full</option>
          <option value="licence">You - the client gets a licence to use it</option>
        </SelectField>
        <CheckboxField<Contract> name="portfolioUse" label="I may show the work in my portfolio" />
      </FormSection>
    </>
  );
}

export function PaymentSection() {
  const payment = useContractValue("payment");
  const currencies = useMemo(() => getCurrencyOptions(), []);
  const popular = currencies.filter((option) => POPULAR_CURRENCIES.includes(option.code));
  const structure = payment?.structure ?? "fixed";
  const total = (payment?.milestones ?? []).reduce(
    (sum, milestone) => sum + (Number(milestone.amount) || 0),
    0,
  );

  return (
    <>
      <FormSection title="Fees and payment">
        <FieldRow>
          <SelectField<Contract> name="payment.currency" label="Currency">
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
          <SelectField<Contract> name="payment.structure" label="How you're paid">
            <option value="fixed">Fixed fee</option>
            <option value="hourly">Hourly rate</option>
            <option value="milestones">Milestones</option>
          </SelectField>
        </FieldRow>
        {structure === "fixed" && (
          <NumberField<Contract>
            name="payment.amount"
            label="Total fee"
            placeholder="e.g. 30000"
            className="sm:w-1/2"
          />
        )}
        {structure === "hourly" && (
          <FieldRow>
            <NumberField<Contract> name="payment.amount" label="Hourly rate" placeholder="e.g. 1500" />
            <NumberField<Contract>
              name="payment.hoursCap"
              label="Hours cap (optional)"
              placeholder="0"
              hint="Hours you can bill without asking first. 0 = no cap."
            />
          </FieldRow>
        )}
        <FieldRow>
          <NumberField<Contract>
            name="payment.dueDays"
            label="Days to pay each invoice"
            placeholder="15"
            step={1}
          />
          <NumberField<Contract>
            name="payment.lateFeePercent"
            label="Late interest, % per month (optional)"
            placeholder="0"
            hint="1.5% a month is common. 0 = none."
          />
        </FieldRow>
      </FormSection>
      {structure === "milestones" && (
        <EntryList<Contract, "payment.milestones">
          name="payment.milestones"
          title="Milestones"
          description={`Total: ${formatMoney(total, payment?.currency || "INR")}`}
          addLabel="Add milestone"
          create={createMilestone}
          summarize={(milestone) => milestone.description}
          fallbackTitle="New milestone"
          renderFields={(index) => (
            <FieldRow className="sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <TextField<Contract>
                name={`payment.milestones.${index}.description`}
                label="When"
                placeholder="e.g. Advance on signing"
              />
              <NumberField<Contract>
                name={`payment.milestones.${index}.amount`}
                label="Amount"
                placeholder="e.g. 15000"
              />
            </FieldRow>
          )}
        />
      )}
    </>
  );
}

export function TermsSection() {
  const kind = useContractValue("kind");
  const nda = kind === "nda";
  return (
    <FormSection title="Legal terms" description="Balanced defaults that suit most agreements.">
      {!nda && (
        <FieldRow>
          <NumberField<Contract>
            name="noticeDays"
            label="Notice to end the agreement (days)"
            placeholder="15"
            step={1}
          />
          <NumberField<Contract>
            name="confidentialityYears"
            label="Years confidentiality lasts"
            placeholder="3"
            hint="After the agreement ends."
          />
        </FieldRow>
      )}
      <FieldRow>
        <TextField<Contract>
          name="governingLaw"
          label="Governing law"
          placeholder="e.g. the laws of India"
          hint="Completes “This Agreement is governed by…”."
        />
        <TextField<Contract>
          name="jurisdiction"
          label="City for disputes"
          placeholder="e.g. Bengaluru, Karnataka"
        />
      </FieldRow>
      <SelectField<Contract> name="disputes" label="If you can't agree">
        <option value="courts">Go to the courts in that city</option>
        <option value="arbitration">Use arbitration in that city</option>
      </SelectField>
      {!nda && (
        <CheckboxField<Contract> name="limitLiability" label="Limit each party's liability to the fees" />
      )}
      <CheckboxField<Contract>
        name="nonSolicitation"
        label="Neither party may poach the other's staff (12 months)"
      />
    </FormSection>
  );
}

export function CustomClausesSection() {
  return (
    <EntryList<Contract, "customClauses">
      name="customClauses"
      title="Extra clauses"
      description="Anything else you've agreed: travel, retainer terms, account access, warranties..."
      addLabel="Add clause"
      create={createCustomClause}
      summarize={(clause) => clause.title}
      fallbackTitle="New clause"
      renderFields={(index) => (
        <>
          <TextField<Contract>
            name={`customClauses.${index}.title`}
            label="Heading"
            placeholder="e.g. Support after launch"
          />
          <TextAreaField<Contract>
            name={`customClauses.${index}.text`}
            label="Text"
            rows={4}
            placeholder="e.g. For 30 days after launch, the Service Provider will fix bugs free of charge."
            hint="Separate paragraphs with a blank line."
          />
        </>
      )}
    />
  );
}
