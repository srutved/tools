"use client";

import { ArrowRight, CircleCheck, X } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getTool } from "@/tools/registry";

/** Shown after a download: confirms it worked and suggests the tool people usually need next. */
export function ExportedBanner({ toolSlug, onDismiss }: { toolSlug: string; onDismiss: () => void }) {
  const next = getTool(toolSlug).nextStep;
  const nextTool = next ? getTool(next.slug) : null;

  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-xl border border-brand/30 bg-brand-soft p-4 text-sm"
    >
      <CircleCheck className="mt-0.5 size-5 shrink-0 text-brand-strong" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-bold">Your PDF is ready.</p>
        {next && nextTool && (
          <>
            <p className="mt-0.5 text-muted">{next.text}</p>
            <Link
              href={`/${nextTool.slug}`}
              className={buttonVariants({ variant: "outline", size: "sm", className: "mt-3" })}
            >
              Open the {nextTool.name.toLowerCase()} <ArrowRight />
            </Link>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-md p-1 text-muted hover:bg-white hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
