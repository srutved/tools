import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A titled group of fields in a tool's editor. */
export function FormSection({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  /** Optional control shown next to the title, e.g. "Add item". */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-white p-5", className)}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/**
 * Label + control + hint/error, wired up for accessibility. Pass the control's id as `htmlFor`
 * and give the control `aria-invalid` / `aria-describedby={describedBy(id)}`.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p id={describedBy(htmlFor)} className="mt-1 text-sm font-medium text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={describedBy(htmlFor)} className="mt-1 text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export const describedBy = (id: string) => `${id}-description`;

/** Responsive grid for placing fields side by side. */
export function FieldRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>;
}
