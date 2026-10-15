import { ChevronDown } from "lucide-react";
import type { Faq } from "@/lib/seo";

/** Expandable questions and answers. Pair it with faqJsonLd() for search results. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mt-6 space-y-3">
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="group rounded-xl border border-border bg-white p-5 open:border-brand"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
            {faq.question}
            <ChevronDown
              className="size-5 shrink-0 text-brand transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <p className="mt-3 text-muted">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
