"use client";

import { createElement } from "react";
import { toFileName } from "@/lib/browser";
import { preparePayslip } from "./lib/payslip";
import type { SalarySlip } from "./schema";
import { PayslipDocument } from "./templates/payslip-document";

/** Renders the salary slip to a PDF Blob. The PDF engine and fonts load only when this runs. */
export async function renderSalarySlipPdf(slip: SalarySlip): Promise<{ blob: Blob; fileName: string }> {
  const prepared = preparePayslip(slip);
  const { PdfPage, renderPdf } = await import("@/lib/document/pdf");
  const blob = await renderPdf({
    title: `Payslip - ${slip.employee.name} - ${prepared.period}`,
    author: prepared.companyName,
    children: createElement(PayslipDocument, { templateId: slip.templateId, slip: prepared, Page: PdfPage }),
  });
  const name = `Payslip ${slip.employee.name} ${slip.month}`;
  return { blob, fileName: `${toFileName(name, "Payslip")}.pdf` };
}
