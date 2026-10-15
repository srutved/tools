"use client";

import { useMemo } from "react";
import { ScaledPage } from "@/components/document/scaled-page";
import { TemplateGallery } from "@/components/tool/template-gallery";
import { WebPage } from "@/lib/document/web";
import { prepareRentReceipts } from "../lib/receipts";
import { SAMPLE_RENT_RECEIPT } from "../sample";
import type { RentReceipt } from "../schema";
import { ReceiptDocument } from "../templates/receipt-document";
import { RECEIPT_TEMPLATES, type ReceiptTemplate } from "../templates/registry";

/** A live, scaled-down render of the receipts in a given design (the first page area). */
export function ReceiptThumbnail({ receipt, templateId }: { receipt: RentReceipt; templateId: string }) {
  const prepared = useMemo(() => prepareRentReceipts(receipt), [receipt]);
  return (
    <ScaledPage firstPageOnly className="rounded-md border border-border bg-white shadow-xs">
      <ReceiptDocument templateId={templateId} data={prepared} Page={WebPage} />
    </ScaledPage>
  );
}

const GALLERY_TEMPLATES = RECEIPT_TEMPLATES.map((template) => ({
  ...template,
  accent: template.theme.accent,
}));

interface ReceiptTemplateGalleryProps {
  receipt?: RentReceipt;
  selectedId?: string;
  onSelect?: (template: ReceiptTemplate) => void;
}

export function ReceiptTemplateGallery({ receipt, ...props }: ReceiptTemplateGalleryProps) {
  const preview = receipt?.tenantName.trim() ? receipt : SAMPLE_RENT_RECEIPT;
  return (
    <TemplateGallery
      templates={GALLERY_TEMPLATES}
      renderThumbnail={(template) => <ReceiptThumbnail receipt={preview} templateId={template.id} />}
      {...props}
    />
  );
}
