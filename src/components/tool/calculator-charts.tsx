"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Simple visuals for the loan and savings calculators: a stacked bar that splits a total into its
 * parts, and a year-by-year table with a small bar on each row. Plain divs, no chart library. The
 * bars are decoration only: every figure is also written out as text beside or next to them.
 */

/** Colours for the parts of a bar, e.g. what you put in versus what it earned. */
export type ChartTone = "principal" | "deposits" | "growth";

const TONE_CLASSES: Record<ChartTone, string> = {
  principal: "bg-brand-strong",
  deposits: "bg-sky-500",
  growth: "bg-amber-400",
};

export interface ChartPart {
  label: string;
  value: number;
  tone: ChartTone;
}

const share = (value: number, total: number) => (total > 0 ? Math.max(value, 0) / total : 0);

/** A whole-number percentage that never shows "0%" for a part that's there but small. */
function percentLabel(value: number, total: number): string {
  const percent = share(value, total) * 100;
  if (percent > 0 && percent < 1) return "<1%";
  return `${Math.round(percent)}%`;
}

function Swatch({ tone }: { tone: ChartTone }) {
  return <span className={cn("size-3 shrink-0 rounded-sm", TONE_CLASSES[tone])} aria-hidden />;
}

/** The coloured bar itself, `max` setting what a full-width bar is worth. */
function Bar({ parts, max, className }: { parts: ChartPart[]; max: number; className?: string }) {
  return (
    <div className={cn("flex w-full overflow-hidden rounded-full bg-subtle", className)} aria-hidden>
      {parts.map((part) =>
        part.value > 0 && max > 0 ? (
          <div
            key={part.label}
            className={TONE_CLASSES[part.tone]}
            style={{ width: `${Math.min(share(part.value, max), 1) * 100}%` }}
          />
        ) : null,
      )}
    </div>
  );
}

/**
 * How a total splits into its parts, e.g. principal versus interest: one stacked bar, with each
 * part's amount and share listed beside it.
 */
export function SplitBar({
  title,
  parts,
  format,
}: {
  title: string;
  parts: ChartPart[];
  format: (amount: number) => string;
}) {
  const total = parts.reduce((sum, part) => sum + Math.max(part.value, 0), 0);
  return (
    <figure>
      <figcaption className="text-sm font-bold">{title}</figcaption>
      <Bar parts={parts} max={total} className="mt-2 h-4" />
      <ul className="mt-3 space-y-1.5 text-sm">
        {parts.map((part) => (
          <li key={part.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Swatch tone={part.tone} />
              {part.label}
            </span>
            <span className="text-right whitespace-nowrap tabular-nums">
              {format(part.value)}
              {total > 0 && <span className="ml-1.5 text-muted">({percentLabel(part.value, total)})</span>}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export interface ScheduleRow {
  key: string | number;
  /** First column, e.g. "Year 1". */
  label: ReactNode;
  /** One value per column. */
  values: string[];
  /** Optional bar for the row, scaled against the table's `barMax`. */
  bar?: ChartPart[];
}

/**
 * A period-by-period table (years or months). Long tables show the first rows with a button to
 * reveal the rest, so the page stays short until someone wants the detail.
 */
export function ScheduleTable({
  title,
  description,
  firstColumn,
  columns,
  rows,
  barMax = 0,
  legend,
  rowNoun,
  visibleRows = 10,
  emptyText,
  action,
}: {
  title: string;
  description?: ReactNode;
  /** Heading for the label column, e.g. "Year". */
  firstColumn: string;
  /** Headings for the value columns. */
  columns: string[];
  rows: ScheduleRow[];
  /** What a full-width row bar is worth; 0 hides the bar column. */
  barMax?: number;
  /** Explains the bar colours, e.g. invested and returns. */
  legend?: { label: string; tone: ChartTone }[];
  /** Plural used on the show-all button, e.g. "years" or "months". */
  rowNoun: string;
  /** How many rows to show before "Show all". */
  visibleRows?: number;
  /** Shown instead of the table when there are no rows yet. */
  emptyText: string;
  /** Optional control next to the title, e.g. a yearly/monthly switch. */
  action?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = rows.length > visibleRows + 2;
  const shown = collapsible && !expanded ? rows.slice(0, visibleRows) : rows;
  const showBars = barMax > 0 && rows.some((row) => row.bar);

  return (
    <section className="rounded-xl border border-border bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-bold">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
        {action}
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-lg bg-subtle p-4 text-sm text-muted">{emptyText}</p>
      ) : (
        <>
          {showBars && legend && (
            <ul className="mt-4 hidden flex-wrap gap-x-4 gap-y-1 text-xs text-muted md:flex">
              {legend.map((item) => (
                <li key={item.label} className="flex items-center gap-1.5">
                  <Swatch tone={item.tone} />
                  {item.label}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">{title}</caption>
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th scope="col" className="py-2 pr-3 text-left font-semibold">
                    {firstColumn}
                  </th>
                  {columns.map((column) => (
                    <th key={column} scope="col" className="px-3 py-2 text-right font-semibold">
                      {column}
                    </th>
                  ))}
                  {showBars && (
                    <th scope="col" className="hidden w-1/4 py-2 pl-3 text-left font-semibold md:table-cell">
                      <span aria-hidden>Growth</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {shown.map((row) => (
                  <tr key={row.key} className="border-b border-border last:border-0">
                    <th scope="row" className="py-2 pr-3 text-left font-normal whitespace-nowrap">
                      {row.label}
                    </th>
                    {row.values.map((value, column) => (
                      <td key={column} className="px-3 py-2 text-right whitespace-nowrap tabular-nums">
                        {value}
                      </td>
                    ))}
                    {showBars && (
                      <td className="hidden py-2 pl-3 align-middle md:table-cell">
                        {row.bar && <Bar parts={row.bar} max={barMax} className="h-2.5" />}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {collapsible && (
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
              className="mt-3 inline-flex items-center gap-1 rounded-md text-sm font-semibold text-brand-strong hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {expanded ? `Show the first ${visibleRows} ${rowNoun}` : `Show all ${rows.length} ${rowNoun}`}
              <ChevronDown
                className={cn("size-4 transition-transform", expanded && "rotate-180")}
                aria-hidden
              />
            </button>
          )}
        </>
      )}
    </section>
  );
}
