import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { sanitiseAmountInput } from "@/lib/parse-amount";
import { cn } from "@/lib/utils";
import { getTool } from "@/tools/registry";
import { describedBy, Field } from "./form";

/**
 * Building blocks shared by the calculators (GST, salary, HRA). Unlike the document tools they
 * need no storage or PDF: plain state, inputs on the left and live results on the right.
 */

/**
 * Inputs on the left; results on the right, pinned while scrolling on large screens. Stacked on phones.
 * Optional `details` (e.g. a year-by-year table) span the full width underneath, after the results.
 */
export function CalculatorLayout({
  inputs,
  results,
  details,
}: {
  inputs: ReactNode;
  results: ReactNode;
  details?: ReactNode;
}) {
  return (
    <div className="bg-subtle/60">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:items-start lg:px-8 lg:py-8">
        <div className="min-w-0 space-y-4">{inputs}</div>
        <div className="min-w-0 lg:sticky lg:top-20">{results}</div>
      </div>
      {details && (
        <div className="mx-auto max-w-7xl space-y-4 px-4 pb-6 sm:px-6 lg:px-8 lg:pb-8">{details}</div>
      )}
    </div>
  );
}

/** The results panel. */
export function ResultsCard({ title = "Results", children }: { title?: string; children: ReactNode }) {
  return (
    <Card className="p-5">
      <h2 className="font-bold">{title}</h2>
      <div className="mt-4 space-y-5">{children}</div>
    </Card>
  );
}

/** The one number people came for. Screen readers announce it as it changes. */
export function ResultHeadline({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-brand-soft p-4" aria-live="polite" aria-atomic="true">
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight break-words text-brand-strong tabular-nums">
        {value}
      </p>
      {detail && <p className="mt-1 text-sm text-muted">{detail}</p>}
    </div>
  );
}

interface AmountFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  hint?: ReactNode;
  /** Shown inside the field on the left, e.g. "₹". */
  prefix?: string;
  /** Shown inside the field on the right, e.g. "%" or "a month". */
  suffix?: string;
  className?: string;
}

/** A number field typed as text, so grouping commas and half-typed values ("12.") are fine. */
export function AmountField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  prefix,
  suffix,
  className,
}: AmountFieldProps) {
  return (
    <Field label={label} htmlFor={id} className={className}>
      <div className="relative">
        {prefix && (
          <span
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted"
            aria-hidden
          >
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(sanitiseAmountInput(event.target.value))}
          placeholder={placeholder}
          aria-describedby={
            [suffix && `${id}-unit`, hint && describedBy(id)].filter(Boolean).join(" ") || undefined
          }
          className={cn("tabular-nums", prefix && "pl-7", suffix && "pr-20")}
        />
        {suffix && (
          <span
            id={`${id}-unit`}
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted"
          >
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p id={describedBy(id)} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
    </Field>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { id: string; label: string }[];
  /** Shown until something is chosen. */
  placeholder?: string;
  hint?: ReactNode;
  className?: string;
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  hint,
  className,
}: SelectFieldProps) {
  return (
    <Field label={label} htmlFor={id} className={className}>
      <Select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={hint ? describedBy(id) : undefined}
        className={cn(!value && "text-muted")}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.id} value={option.id} className="text-foreground">
            {option.label}
          </option>
        ))}
      </Select>
      {hint && (
        <p id={describedBy(id)} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
    </Field>
  );
}

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface ChoiceGroupProps<T extends string> {
  /** Shared name for the radio buttons. */
  name: string;
  legend: string;
  options: readonly ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  hint?: ReactNode;
  /** Classes for the row of options, e.g. a grid for options with descriptions. */
  className?: string;
}

/**
 * Pick one of a few options, shown as chips or cards. Real radio buttons underneath, so arrow keys
 * and screen readers work as expected.
 */
export function ChoiceGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  hint,
  className,
}: ChoiceGroupProps<T>) {
  const hintId = `${name}-hint`;
  return (
    <fieldset className="min-w-0" aria-describedby={hint ? hintId : undefined}>
      <legend className="mb-1.5 text-sm font-semibold">{legend}</legend>
      <div className={cn("flex flex-wrap gap-2", className)}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer flex-col justify-center rounded-md border px-3 py-2 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-1",
                selected
                  ? "border-brand bg-brand-soft text-brand-strong"
                  : "border-border bg-white hover:border-brand/60",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className="font-semibold">{option.label}</span>
              {option.description && <span className="mt-0.5 text-xs text-muted">{option.description}</span>}
            </label>
          );
        })}
      </div>
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
    </fieldset>
  );
}

export interface BreakdownRow {
  label: ReactNode;
  /** One value per column. */
  values: string[];
  /** "total" for a bold summary line, "highlight" to pick out a row, "minus" for an amount taken off. */
  tone?: "total" | "highlight" | "minus";
}

/** A labelled table of amounts, e.g. a breakdown with monthly and yearly columns. */
export function BreakdownTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  /** Headings for the value columns. */
  columns: string[];
  rows: BreakdownRow[];
}) {
  return (
    <table className="w-full text-sm">
      <caption className="mb-2 text-left text-sm font-bold">{caption}</caption>
      <thead>
        <tr className="border-b border-border text-xs text-muted">
          <th scope="col" className="py-1.5 pr-2 text-left font-semibold">
            <span className="sr-only">Item</span>
          </th>
          {columns.map((column) => (
            <th key={column} scope="col" className="py-1.5 pl-2 text-right font-semibold">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr
            key={index}
            className={cn(
              "border-b border-border last:border-0",
              row.tone === "total" && "font-bold",
              row.tone === "highlight" && "bg-brand-soft font-semibold text-brand-strong",
            )}
          >
            <th
              scope="row"
              className={cn(
                "py-2 pr-2 text-left",
                row.tone === "total"
                  ? "font-bold"
                  : row.tone === "highlight"
                    ? "font-semibold"
                    : "font-normal",
              )}
            >
              {row.label}
            </th>
            {row.values.map((value, column) => (
              <td key={column} className="py-2 pl-2 text-right whitespace-nowrap tabular-nums">
                {row.tone === "minus" ? `− ${value}` : value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Short notes under the results, e.g. rules to be aware of. */
export function CalculatorNotes({ title, notes }: { title?: string; notes: ReactNode[] }) {
  if (notes.length === 0) return null;
  return (
    <div className="rounded-lg bg-subtle p-4 text-sm">
      {title && <p className="mb-2 font-bold">{title}</p>}
      <ul className="space-y-2">
        {notes.map((note, index) => (
          <li key={index} className="flex gap-2">
            <Info className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The tool people usually need next (from the registry's nextStep), as a button-style link. */
export function NextStepLink({ toolSlug, href, label }: { toolSlug: string; href?: string; label: string }) {
  const nextStep = getTool(toolSlug).nextStep;
  if (!nextStep) return null;
  return (
    <div className="border-t border-border pt-4">
      <p className="text-sm text-muted">{nextStep.text}</p>
      <Link href={href ?? `/${nextStep.slug}`} className={cn(buttonVariants({ size: "lg" }), "mt-3 w-full")}>
        {label}
        <ArrowRight aria-hidden />
      </Link>
    </div>
  );
}

/** Whole rupees with Indian grouping, e.g. ₹1,20,000. For salary figures, where paise are noise. */
export function formatRupees(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}
