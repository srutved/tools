"use client";

import type { ReactNode } from "react";
import { get, useFormContext, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import { Input, Select, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { describedBy, Field } from "./form";

/**
 * Form fields bound to the surrounding react-hook-form context. Generic over the form's values, so
 * every tool gets type-checked field names, consistent labels, hints and error messages for free.
 */

interface BaseFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  hint?: string;
  className?: string;
  /** Extra react-hook-form rules or onChange handling. */
  rules?: RegisterOptions<T, Path<T>>;
}

function useFieldState<T extends FieldValues>(name: Path<T>) {
  const form = useFormContext<T>();
  const error = get(form.formState.errors, name)?.message as string | undefined;
  const id = `field-${name.replace(/\./g, "-")}`;
  const aria = { id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy(id) };
  return { form, error, id, aria };
}

export function TextField<T extends FieldValues>({
  name,
  label,
  hint,
  className,
  rules,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  list,
}: BaseFieldProps<T> & {
  type?: "text" | "email" | "tel" | "url" | "date";
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
  /** Id of a <datalist> with suggestions. */
  list?: string;
}) {
  const { form, error, id, aria } = useFieldState<T>(name);
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error} className={className}>
      <Input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        list={list}
        {...aria}
        {...form.register(name, rules)}
      />
    </Field>
  );
}

export function TextAreaField<T extends FieldValues>({
  name,
  label,
  hint,
  className,
  rules,
  placeholder,
  rows = 3,
}: BaseFieldProps<T> & { placeholder?: string; rows?: number }) {
  const { form, error, id, aria } = useFieldState<T>(name);
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error} className={className}>
      <Textarea placeholder={placeholder} rows={rows} {...aria} {...form.register(name, rules)} />
    </Field>
  );
}

export function NumberField<T extends FieldValues>({
  name,
  label,
  hint,
  className,
  min = 0,
  step = "any",
  placeholder,
}: BaseFieldProps<T> & { min?: number; step?: number | "any"; placeholder?: string }) {
  const { form, error, id, aria } = useFieldState<T>(name);
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error} className={className}>
      <Input
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        placeholder={placeholder}
        {...aria}
        {...form.register(name, { valueAsNumber: true })}
      />
    </Field>
  );
}

export function SelectField<T extends FieldValues>({
  name,
  label,
  hint,
  className,
  rules,
  children,
}: BaseFieldProps<T> & { children: ReactNode }) {
  const { form, error, id, aria } = useFieldState<T>(name);
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error} className={className}>
      <Select {...aria} {...form.register(name, rules)}>
        {children}
      </Select>
    </Field>
  );
}

export function CheckboxField<T extends FieldValues>({
  name,
  label,
  className,
  rules,
}: Omit<BaseFieldProps<T>, "hint">) {
  const { form, id } = useFieldState<T>(name);
  return (
    <label
      htmlFor={id}
      className={cn("flex cursor-pointer items-center gap-2 text-sm font-semibold", className)}
    >
      <input
        id={id}
        type="checkbox"
        className="size-4 rounded border-border accent-brand"
        {...form.register(name, rules)}
      />
      {label}
    </label>
  );
}
