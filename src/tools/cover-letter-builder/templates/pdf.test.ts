/**
 * Renders every cover letter design to a real PDF, with a normal and a two-page letter, so a design
 * that crashes the PDF engine fails CI. Set PDF_OUT=<folder> to also write the files out.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { generateQrDataUrl } from "@/lib/qr";
import { RESUME_TEMPLATES } from "@/tools/resume-builder/templates/registry";
import { prepareCoverLetter } from "../lib/prepare";
import { SAMPLE_COVER_LETTER } from "../sample";
import type { CoverLetter } from "../schema";
import { CoverLetterDocument } from "./cover-letter-document";

// Load the fonts from disk instead of over HTTP.
vi.mock("@/config/site", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  BASE_PATH: fileURLToPath(new URL("../../../../public", import.meta.url)),
}));

const photo = await generateQrDataUrl("photo");

const LONG_LETTER: CoverLetter = {
  ...SAMPLE_COVER_LETTER,
  basics: { ...SAMPLE_COVER_LETTER.basics, photo },
  body: Array.from({ length: 3 }, () => SAMPLE_COVER_LETTER.body).join("\n\n"),
};

async function render(letter: CoverLetter, templateId: string): Promise<Buffer> {
  const { PdfPage, renderPdf } = await import("@/lib/document/pdf");
  const blob = await renderPdf({
    title: "Test",
    author: "Test",
    children: createElement(CoverLetterDocument, {
      templateId,
      letter: prepareCoverLetter(letter),
      Page: PdfPage,
    }),
  });
  return Buffer.from(await blob.arrayBuffer());
}

const pageCount = (pdf: Buffer) => pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)?.length ?? 0;

describe("cover letter designs render to PDF", () => {
  const outDir = process.env.PDF_OUT;
  if (outDir) mkdirSync(outDir, { recursive: true });

  for (const template of RESUME_TEMPLATES) {
    it(template.id, { timeout: 30_000 }, async () => {
      const short = await render(SAMPLE_COVER_LETTER, template.id);
      const long = await render(LONG_LETTER, template.id);
      if (outDir) {
        writeFileSync(join(outDir, `letter-${template.id}.pdf`), short);
        writeFileSync(join(outDir, `letter-${template.id}-long.pdf`), long);
      }
      expect(pageCount(short)).toBe(1);
      expect(pageCount(long)).toBeGreaterThan(1);
    });
  }
});
