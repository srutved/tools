"use client";

import { createElement } from "react";
import { toFileName } from "@/lib/browser";
import { prepareLetter } from "./lib/letters";
import type { HrLetter } from "./schema";
import { LetterDocument } from "./templates/letter-document";

/** Renders an HR letter to a PDF Blob. The PDF engine and fonts load only when this runs. */
export async function renderHrLetterPdf(letter: HrLetter): Promise<{ blob: Blob; fileName: string }> {
  const prepared = prepareLetter(letter);
  const { PdfPage, renderPdf } = await import("@/lib/document/pdf");
  const blob = await renderPdf({
    title: `${prepared.title} - ${letter.employee.name}`,
    author: prepared.company.name,
    children: createElement(LetterDocument, {
      templateId: letter.templateId,
      letter: prepared,
      Page: PdfPage,
    }),
  });
  const name = `${prepared.title} ${letter.employee.name}`;
  return { blob, fileName: `${toFileName(name, "HR-Letter")}.pdf` };
}
