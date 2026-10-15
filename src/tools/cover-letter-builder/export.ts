"use client";

import { createElement } from "react";
import { toFileName } from "@/lib/browser";
import { prepareCoverLetter } from "./lib/prepare";
import type { CoverLetter } from "./schema";
import { CoverLetterDocument } from "./templates/cover-letter-document";

/** Renders a cover letter to a PDF Blob. The PDF engine and fonts load only when this runs. */
export async function renderCoverLetterPdf(letter: CoverLetter): Promise<{ blob: Blob; fileName: string }> {
  const prepared = prepareCoverLetter(letter);
  const { PdfPage, renderPdf } = await import("@/lib/document/pdf");

  const blob = await renderPdf({
    title: [prepared.name, "Cover Letter"].filter(Boolean).join(" - "),
    author: prepared.name,
    children: createElement(CoverLetterDocument, {
      templateId: letter.templateId,
      letter: prepared,
      Page: PdfPage,
    }),
  });

  return { blob, fileName: `${toFileName(`${prepared.name} Cover Letter`, "Cover-Letter")}.pdf` };
}
