/**
 * Renders every invoice template to a real PDF as both an invoice (with a UPI QR code) and a
 * quotation, plus every landing-page format example (each must fit on one page), so a template
 * that crashes the PDF engine fails CI. Set PDF_OUT=<folder> to also
 * write the files out for a visual check.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { generateQrDataUrl } from "@/lib/qr";
import { INVOICE_FORMATS, QUOTATION_FORMATS } from "../examples";
import { computeInvoice } from "../lib/calculations";
import { sampleFor } from "../sample";
import type { Invoice } from "../schema";
import { InvoiceDocument } from "./invoice-document";
import { INVOICE_TEMPLATES } from "./registry";

// Load the fonts from disk instead of over HTTP.
vi.mock("@/config/site", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  BASE_PATH: fileURLToPath(new URL("../../../../public", import.meta.url)),
}));

async function render(invoice: Invoice): Promise<{ pdf: Buffer; text: string }> {
  const { PdfPage, renderPdf } = await import("@/lib/document/pdf");
  const computed = computeInvoice(invoice);
  const qrCode = computed.upiUri ? await generateQrDataUrl(computed.upiUri) : null;
  const blob = await renderPdf({
    title: "Test",
    author: "Test",
    children: createElement(InvoiceDocument, { invoice, computed, qrCode, Page: PdfPage }),
  });
  const pdf = Buffer.from(await blob.arrayBuffer());
  return { pdf, text: pdf.toString("latin1") };
}

describe("invoice templates render to PDF", () => {
  const outDir = process.env.PDF_OUT;
  if (outDir) mkdirSync(outDir, { recursive: true });

  for (const template of INVOICE_TEMPLATES) {
    it(template.id, { timeout: 30_000 }, async () => {
      for (const kind of ["invoice", "quote"] as const) {
        const { pdf } = await render({ ...sampleFor(kind), templateId: template.id });
        if (outDir) writeFileSync(join(outDir, `${kind}-${template.id}.pdf`), pdf);
        expect(pdf.length).toBeGreaterThan(1000);
      }
    });
  }

  it("continues long item tables onto more pages", { timeout: 60_000 }, async () => {
    const sample = sampleFor("invoice");
    const items = Array.from({ length: 45 }, (_, index) => ({
      ...sample.items[index % sample.items.length],
      id: `long-${index}`,
      description: `${sample.items[index % sample.items.length].description} - phase ${index + 1}`,
    }));
    for (const templateId of ["classic-slate", "sidebar-emerald", "bold-orange"]) {
      const { pdf, text } = await render({ ...sample, templateId, items });
      if (outDir) writeFileSync(join(outDir, `invoice-long-${templateId}.pdf`), pdf);
      expect(text.match(/\/Type\s*\/Page\b/g)?.length ?? 0).toBeGreaterThan(1);
    }
  });

  for (const format of [...INVOICE_FORMATS, ...QUOTATION_FORMATS]) {
    it(`format: ${format.document.kind} ${format.slug}`, { timeout: 30_000 }, async () => {
      const { pdf, text } = await render(format.document);
      if (outDir) writeFileSync(join(outDir, `format-${format.document.kind}-${format.slug}.pdf`), pdf);
      // Landing-page examples are short enough to fit on one A4 page.
      expect(text.match(/\/Type\s*\/Page\b/g)?.length ?? 0).toBe(1);
    });
  }

  it("leaves the payment QR code off quotations", () => {
    expect(computeInvoice(sampleFor("invoice")).upiUri).not.toBeNull();
    expect(
      computeInvoice({ ...sampleFor("quote"), payment: sampleFor("invoice").payment }).upiUri,
    ).toBeNull();
  });
});
