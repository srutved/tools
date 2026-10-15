"use client";

import { get, useFormContext, useWatch, type FieldValues, type Path, type PathValue } from "react-hook-form";
import { Select } from "@/components/ui/input";
import { describedBy, Field } from "./form";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface MonthFieldProps<T extends FieldValues> {
  /** A string field holding "YYYY-MM". */
  name: Path<T>;
  label: string;
  hint?: string;
  /** Years offered, e.g. [2024, 2025, 2026, 2027]. */
  years: number[];
}

/**
 * Month and year as two selects, stored as "YYYY-MM". Native month inputs aren't supported in
 * every browser (Firefox and Safari show a plain text box), so this works the same everywhere.
 */
export function MonthField<T extends FieldValues>({ name, label, hint, years }: MonthFieldProps<T>) {
  const { setValue, formState } = useFormContext<T>();
  const value = (useWatch<T>({ name }) as string | undefined) ?? "";
  const [year, month] = value.split("-");
  const error = get(formState.errors, name)?.message as string | undefined;
  const id = `field-${name.replace(/\./g, "-")}`;

  const update = (nextYear: string, nextMonth: string) =>
    setValue(name, `${nextYear}-${nextMonth}` as PathValue<T, Path<T>>, {
      shouldDirty: true,
      shouldValidate: formState.isSubmitted,
    });

  return (
    <Field label={label} htmlFor={id} hint={hint} error={error}>
      <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-2">
        <Select
          id={id}
          value={month ?? ""}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id)}
          onChange={(event) => update(year || String(years[0]), event.target.value)}
        >
          {MONTHS.map((monthName, index) => (
            <option key={monthName} value={String(index + 1).padStart(2, "0")}>
              {monthName}
            </option>
          ))}
        </Select>
        <Select
          aria-label={`${label} year`}
          value={year ?? ""}
          onChange={(event) => update(event.target.value, month || "01")}
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>
    </Field>
  );
}
