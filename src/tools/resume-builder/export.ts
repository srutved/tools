"use client";

import { createElement } from "react";
import { toFileName } from "@/lib/browser";
import { prepareResume } from "./lib/prepare";
import type { Resume } from "./schema";
import { ResumeDocument } from "./templates/resume-document";

/** Renders a resume to a PDF Blob. The PDF engine and fonts load only when this runs. */
export async function renderResumePdf(resume: Resume): Promise<{ blob: Blob; fileName: string }> {
  const prepared = prepareResume(resume);
  const { PdfPage, renderPdf } = await import("@/lib/document/pdf");

  const blob = await renderPdf({
    title: [prepared.name, prepared.headline, "Resume"].filter(Boolean).join(" - "),
    author: prepared.name,
    children: createElement(ResumeDocument, {
      templateId: resume.templateId,
      resume: prepared,
      Page: PdfPage,
    }),
  });

  return { blob, fileName: `${toFileName(`${prepared.name} Resume`, "Resume")}.pdf` };
}
