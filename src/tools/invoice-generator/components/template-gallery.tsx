"use client";

import { Check } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { ScaledPage } from "@/components/document/scaled-page";
import { WebPage } from "@/lib/document/web";
import { cn } from "@/lib/utils";
import { computeInvoice } from "../lib/calculations";
import { SAMPLE_INVOICE } from "../sample";
import type { Invoice } from "../schema";
import { INVOICE_TEMPLATES, InvoiceDocument, type InvoiceTemplate } from "../templates";

/** A live, scaled-down render of an invoice in a given template. */
export function TemplateThumbnail({ invoice, templateId }: { invoice: Invoice; templateId: string }) {
  const themed = useMemo(() => ({ ...invoice, templateId }), [invoice, templateId]);
  const computed = useMemo(() => computeInvoice(themed), [themed]);
  return (
    <ScaledPage className="rounded-md border border-border bg-white shadow-xs">
      <InvoiceDocument invoice={themed} computed={computed} qrCode={null} Page={WebPage} />
    </ScaledPage>
  );
}

interface TemplateGalleryProps {
  /** The user's invoice, so thumbnails show their own data; falls back to sample data. */
  invoice?: Invoice;
  selectedId?: string;
  onSelect?: (template: InvoiceTemplate) => void;
  /** Rendered under each thumbnail instead of selection behaviour, e.g. a "Use template" link. */
  renderAction?: (template: InvoiceTemplate) => ReactNode;
}

export function TemplateGallery({ invoice, selectedId, onSelect, renderAction }: TemplateGalleryProps) {
  // Show the user's own invoice once it has some content; sample data reads better until then.
  const previewInvoice =
    invoice && invoice.from.name && invoice.items.some((item) => item.description) ? invoice : SAMPLE_INVOICE;

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {INVOICE_TEMPLATES.map((template) => {
        const selected = template.id === selectedId;
        const content = (
          <>
            <div
              className={cn(
                "rounded-lg p-1 transition-colors",
                selected ? "bg-brand" : "group-hover:bg-brand/40",
              )}
            >
              <TemplateThumbnail invoice={previewInvoice} templateId={template.id} />
            </div>
            <div className="mt-2 flex items-start justify-between gap-2">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-bold">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: template.theme.accent }}
                    aria-hidden
                  />
                  {template.name}
                </p>
                <p className="mt-0.5 text-xs text-muted">{template.description}</p>
              </div>
              {selected && <Check className="size-4 shrink-0 text-brand" aria-label="Selected" />}
            </div>
          </>
        );
        return (
          <li key={template.id}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(template)}
                aria-pressed={selected}
                className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-brand"
              >
                {content}
              </button>
            ) : (
              <div className="group">
                {content}
                {renderAction?.(template)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
