/** Renders every payslip design to a real PDF. Set PDF_OUT=<folder> to write the files out. */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { generateQrDataUrl } from "@/lib/qr";
import { preparePayslip } from "../lib/payslip";
import { SAMPLE_SALARY_SLIP } from "../sample";
import { PayslipDocument } from "./payslip-document";
import { PAYSLIP_TEMPLATES } from "./registry";

// Load the fonts from disk instead of over HTTP.
vi.mock("@/config/site", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  BASE_PATH: fileURLToPath(new URL("../../../../public", import.meta.url)),
}));

// Any PNG stands in for a logo.
const logo = await generateQrDataUrl("logo");

describe("payslip designs render to PDF", () => {
  const outDir = process.env.PDF_OUT;
  if (outDir) mkdirSync(outDir, { recursive: true });

  for (const template of PAYSLIP_TEMPLATES) {
    it(template.id, { timeout: 30_000 }, async () => {
      const { PdfPage, renderPdf } = await import("@/lib/document/pdf");
      const slip = preparePayslip({
        ...SAMPLE_SALARY_SLIP,
        company: { ...SAMPLE_SALARY_SLIP.company, logo },
        notes: "Includes arrears of ₹2,000 for August.",
      });
      const blob = await renderPdf({
        title: "Test",
        author: "Test",
        children: createElement(PayslipDocument, { templateId: template.id, slip, Page: PdfPage }),
      });
      const pdf = Buffer.from(await blob.arrayBuffer());
      if (outDir) writeFileSync(join(outDir, `payslip-${template.id}.pdf`), pdf);
      expect(pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)?.length ?? 0).toBe(1);
    });
  }
});
