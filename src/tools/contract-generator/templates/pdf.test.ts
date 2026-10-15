/**
 * Renders every contract design to a real PDF, and every contract template in one design, so a
 * change that crashes the PDF engine fails CI. Set PDF_OUT=<folder> to write the files out.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { CONTRACT_EXAMPLES, SAMPLE_CONTRACT } from "../examples";
import { prepareContract } from "../lib/clauses";
import type { Contract } from "../schema";
import { ContractDocument } from "./contract-document";
import { CONTRACT_TEMPLATES } from "./registry";

// Load the fonts from disk instead of over HTTP.
vi.mock("@/config/site", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  BASE_PATH: fileURLToPath(new URL("../../../../public", import.meta.url)),
}));

async function render(contract: Contract, templateId: string): Promise<Buffer> {
  const { PdfPage, renderPdf } = await import("@/lib/document/pdf");
  const blob = await renderPdf({
    title: "Test",
    author: "Test",
    children: createElement(ContractDocument, {
      templateId,
      contract: prepareContract(contract),
      Page: PdfPage,
    }),
  });
  return Buffer.from(await blob.arrayBuffer());
}

const pageCount = (pdf: Buffer) => pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)?.length ?? 0;

describe("contract designs render to PDF", () => {
  const outDir = process.env.PDF_OUT;
  if (outDir) mkdirSync(outDir, { recursive: true });

  for (const template of CONTRACT_TEMPLATES) {
    it(template.id, { timeout: 30_000 }, async () => {
      const pdf = await render(SAMPLE_CONTRACT, template.id);
      if (outDir) writeFileSync(join(outDir, `contract-${template.id}.pdf`), pdf);
      // A full service agreement runs to a few pages.
      expect(pageCount(pdf)).toBeGreaterThan(1);
    });
  }

  for (const example of CONTRACT_EXAMPLES) {
    it(`template: ${example.slug}`, { timeout: 30_000 }, async () => {
      const pdf = await render(example.document, example.document.templateId);
      if (outDir) writeFileSync(join(outDir, `contract-example-${example.slug}.pdf`), pdf);
      expect(pageCount(pdf)).toBeGreaterThan(0);
    });
  }
});
