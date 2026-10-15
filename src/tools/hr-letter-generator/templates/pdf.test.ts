/** Renders every letter design, and every kind of letter, to a real PDF. Set PDF_OUT=<folder> to write them out. */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { generateQrDataUrl } from "@/lib/qr";
import { prepareLetter } from "../lib/letters";
import { SAMPLE_HR_LETTER } from "../sample";
import { LETTER_KINDS, type HrLetter } from "../schema";
import { LetterDocument } from "./letter-document";
import { LETTER_TEMPLATES } from "./registry";

// Load the fonts from disk instead of over HTTP.
vi.mock("@/config/site", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  BASE_PATH: fileURLToPath(new URL("../../../../public", import.meta.url)),
}));

// Any PNG stands in for a logo and a signature.
const image = await generateQrDataUrl("logo");

async function render(letter: HrLetter) {
  const { PdfPage, renderPdf } = await import("@/lib/document/pdf");
  const blob = await renderPdf({
    title: "Test",
    author: "Test",
    children: createElement(LetterDocument, {
      templateId: letter.templateId,
      letter: prepareLetter(letter),
      Page: PdfPage,
    }),
  });
  return Buffer.from(await blob.arrayBuffer());
}

const pages = (pdf: Buffer) => pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)?.length ?? 0;

describe("HR letters render to PDF", () => {
  const outDir = process.env.PDF_OUT;
  if (outDir) mkdirSync(outDir, { recursive: true });
  const write = (name: string, pdf: Buffer) => outDir && writeFileSync(join(outDir, name), pdf);

  for (const template of LETTER_TEMPLATES) {
    it(`design ${template.id}`, { timeout: 30_000 }, async () => {
      const pdf = await render({
        ...SAMPLE_HR_LETTER,
        templateId: template.id,
        company: { ...SAMPLE_HR_LETTER.company, logo: image },
        signatory: { ...SAMPLE_HR_LETTER.signatory, signature: image },
      });
      write(`letter-${template.id}.pdf`, pdf);
      // An offer with terms, acceptance and annexure: two pages at most.
      expect(pages(pdf)).toBeGreaterThanOrEqual(1);
      expect(pages(pdf)).toBeLessThanOrEqual(2);
    });
  }

  for (const kind of LETTER_KINDS) {
    it(`kind ${kind}`, { timeout: 30_000 }, async () => {
      const pdf = await render({
        ...SAMPLE_HR_LETTER,
        kind,
        templateId: "modern-blue",
        joiningDate: "2023-06-01",
        endDate: "2026-10-10",
        resignationDate: "2026-08-10",
        effectiveDate: "2027-04-01",
        previousPay: 1500000,
        employee: { ...SAMPLE_HR_LETTER.employee, employeeId: "BT-0142" },
      });
      write(`letter-kind-${kind}.pdf`, pdf);
      expect(pages(pdf)).toBeGreaterThanOrEqual(1);
    });
  }
});
