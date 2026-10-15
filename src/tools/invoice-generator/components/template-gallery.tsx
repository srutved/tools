"use client";

import { useMemo, type ReactNode } from "react";
import { ScaledPage } from "@/components/document/scaled-page";
import { TemplateGallery } from "@/components/tool/template-gallery";
import { WebPage } from "@/lib/document/web";
import { computeInvoice } from "../lib/calculations";
import type { DocumentKind } from "../lib/document-kind";
import { sampleFor } from "../sample";
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

const GALLERY_TEMPLATES = INVOICE_TEMPLATES.map((template) => ({
  ...template,
  accent: template.theme.accent,
}));

interface InvoiceTemplateGalleryProps {
  /** The user's invoice, so thumbnails show their own data; falls back to sample data. */
  invoice?: Invoice;
  /** Which sample to show before the user has content. */
  kind?: DocumentKind;
  selectedId?: string;
  onSelect?: (template: InvoiceTemplate) => void;
  renderAction?: (template: InvoiceTemplate) => ReactNode;
}

export function InvoiceTemplateGallery({ invoice, kind = "invoice", ...props }: InvoiceTemplateGalleryProps) {
  // Show the user's own invoice once it has some content; sample data reads better until then.
  const previewInvoice =
    invoice && invoice.from.name && invoice.items.some((item) => item.description)
      ? invoice
      : sampleFor(invoice?.kind ?? kind);

  return (
    <TemplateGallery
      templates={GALLERY_TEMPLATES}
      renderThumbnail={(template) => <TemplateThumbnail invoice={previewInvoice} templateId={template.id} />}
      {...props}
    />
  );
}
