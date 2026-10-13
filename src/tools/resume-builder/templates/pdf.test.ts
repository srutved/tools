/**
 * Renders every resume template to a real PDF, with a short and a long (multi-page) resume, so a
 * template that crashes the PDF engine fails CI. Set PDF_OUT=<folder> to also write the files out
 * for a visual check.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { generateQrDataUrl } from "@/lib/qr";
import { createId } from "@/lib/utils";
import { prepareResume } from "../lib/prepare";
import { SAMPLE_RESUME } from "../sample";
import type { Resume } from "../schema";
import { RESUME_TEMPLATES } from "./registry";
import { ResumeDocument } from "./resume-document";

// Load the fonts from disk instead of over HTTP.
vi.mock("@/config/site", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  BASE_PATH: fileURLToPath(new URL("../../../../public", import.meta.url)),
}));

// Any square PNG stands in for a profile photo.
const photo = await generateQrDataUrl("photo");

const LONG_RESUME: Resume = {
  ...SAMPLE_RESUME,
  basics: {
    ...SAMPLE_RESUME.basics,
    photo,
    details: [{ id: "d1", label: "Nationality", value: "Indian" }],
  },
  sectionTitles: { experience: "Work History" },
  customSections: [
    {
      id: "c1",
      title: "Awards",
      format: "entries",
      placement: "main",
      text: "",
      entries: [
        {
          id: "x1",
          title: "Employee of the Year",
          subtitle: "Northwind",
          date: "2023",
          description: "Top performer",
        },
      ],
    },
    { id: "c2", title: "Interests", format: "list", placement: "side", text: "Chess\nRunning", entries: [] },
    {
      id: "c3",
      title: "References",
      format: "text",
      placement: "main",
      text: "Available on request.",
      entries: [],
    },
  ],
  summary: `${SAMPLE_RESUME.summary} ${SAMPLE_RESUME.summary}`,
  experience: Array.from({ length: 4 }, () =>
    SAMPLE_RESUME.experience.map((job) => ({
      ...job,
      id: createId(),
      description: `${job.description}\n${job.description}`,
    })),
  ).flat(),
  skills: [
    ...SAMPLE_RESUME.skills,
    { id: "s4", name: "Practices", skills: "Accessibility, Performance, Testing, Code review, Mentoring" },
  ],
};

async function render(resume: Resume, templateId: string): Promise<Buffer> {
  const { PdfPage, renderPdf } = await import("@/lib/document/pdf");
  const blob = await renderPdf({
    title: "Test",
    author: "Test",
    children: createElement(ResumeDocument, { templateId, resume: prepareResume(resume), Page: PdfPage }),
  });
  return Buffer.from(await blob.arrayBuffer());
}

const pageCount = (pdf: Buffer) => pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)?.length ?? 0;

describe("resume templates render to PDF", () => {
  const outDir = process.env.PDF_OUT;
  if (outDir) mkdirSync(outDir, { recursive: true });

  for (const template of RESUME_TEMPLATES) {
    it(template.id, { timeout: 30_000 }, async () => {
      const short = await render(SAMPLE_RESUME, template.id);
      const long = await render(LONG_RESUME, template.id);
      if (outDir) {
        writeFileSync(join(outDir, `${template.id}.pdf`), short);
        writeFileSync(join(outDir, `${template.id}-long.pdf`), long);
      }
      expect(pageCount(short)).toBe(1);
      expect(pageCount(long)).toBeGreaterThan(1);
    });
  }
});
