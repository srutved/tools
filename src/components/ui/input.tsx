import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Shared look for every text-like control, so inputs, selects and textareas line up exactly. */
export const fieldControlClass =
  "w-full rounded-md border border-border bg-white px-3 text-sm shadow-xs transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-danger/15";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldControlClass, "h-10", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea className={cn(fieldControlClass, "min-h-20 py-2 leading-relaxed", className)} {...props} />
  );
}

/** Native select: accessible, fast with hundreds of options, and uses the phone's own picker. */
export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(fieldControlClass, "h-10 pr-8", className)} {...props} />;
}
