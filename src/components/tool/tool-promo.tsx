import { ArrowRight } from "lucide-react";
import { contactUrlFrom } from "@/config/site";
import type { ToolDefinition } from "@/tools/registry";

/** A low-key note under each tool about the custom software Srutved builds for that kind of user. */
export function ToolPromo({ tool }: { tool: ToolDefinition }) {
  if (!tool.promo) return null;
  return (
    <aside className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          <span className="font-bold">{tool.promo.heading}</span>{" "}
          <span className="text-muted">{tool.promo.text}</span>
        </p>
        <a
          href={contactUrlFrom(tool.slug)}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-strong hover:underline"
        >
          Talk to Srutved <ArrowRight className="size-4" aria-hidden />
        </a>
      </div>
    </aside>
  );
}
