"use client";

import { useMemo } from "react";
import { ScaledPage } from "@/components/document/scaled-page";
import { TemplateGallery } from "@/components/tool/template-gallery";
import { WebPage } from "@/lib/document/web";
import { preparePayslip } from "../lib/payslip";
import { SAMPLE_SALARY_SLIP } from "../sample";
import type { SalarySlip } from "../schema";
import { PayslipDocument } from "../templates/payslip-document";
import { PAYSLIP_TEMPLATES, type PayslipTemplate } from "../templates/registry";

/** A live, scaled-down render of a payslip in a given design. */
export function PayslipThumbnail({ slip, templateId }: { slip: SalarySlip; templateId: string }) {
  const prepared = useMemo(() => preparePayslip(slip), [slip]);
  return (
    <ScaledPage firstPageOnly className="rounded-md border border-border bg-white shadow-xs">
      <PayslipDocument templateId={templateId} slip={prepared} Page={WebPage} />
    </ScaledPage>
  );
}

const GALLERY_TEMPLATES = PAYSLIP_TEMPLATES.map((template) => ({
  ...template,
  accent: template.theme.accent,
}));

interface PayslipTemplateGalleryProps {
  slip?: SalarySlip;
  selectedId?: string;
  onSelect?: (template: PayslipTemplate) => void;
}

export function PayslipTemplateGallery({ slip, ...props }: PayslipTemplateGalleryProps) {
  const preview = slip?.employee.name.trim() ? slip : SAMPLE_SALARY_SLIP;
  return (
    <TemplateGallery
      templates={GALLERY_TEMPLATES}
      renderThumbnail={(template) => <PayslipThumbnail slip={preview} templateId={template.id} />}
      {...props}
    />
  );
}
