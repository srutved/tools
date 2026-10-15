/** Renders every rent receipt design to a real PDF. Set PDF_OUT=<folder> to write the files out. */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { generateQrDataUrl } from "@/lib/qr";
import { prepareRentReceipts } from "../lib/receipts";
import { SAMPLE_RENT_RECEIPT } from "../sample";
import { ReceiptDocument } from "./receipt-document";
import { RECEIPT_TEMPLATES } from "./registry";

// Load the fonts from disk instead of over HTTP.
vi.mock("@/config/site", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  BASE_PATH: fileURLToPath(new URL("../../../../public", import.meta.url)),
}));

// Any PNG stands in for a signature image.
const signature = await generateQrDataUrl("signature");

describe("rent receipt designs render to PDF", () => {
  const outDir = process.env.PDF_OUT;
  if (outDir) mkdirSync(outDir, { recursive: true });

  for (const template of RECEIPT_TEMPLATES) {
    it(template.id, { timeout: 30_000 }, async () => {
      const { PdfPage, renderPdf } = await import("@/lib/document/pdf");
      const data = prepareRentReceipts({ ...SAMPLE_RENT_RECEIPT, paymentMode: "cash", signature });
      const blob = await renderPdf({
        title: "Test",
        author: "Test",
        children: createElement(ReceiptDocument, { templateId: template.id, data, Page: PdfPage }),
      });
      const pdf = Buffer.from(await blob.arrayBuffer());
      if (outDir) writeFileSync(join(outDir, `rent-${template.id}.pdf`), pdf);
      // Twelve receipts at about three per page.
      expect(pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)?.length ?? 0).toBeGreaterThanOrEqual(4);
    });
  }
});
