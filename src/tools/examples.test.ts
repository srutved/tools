/**
 * Every landing-page example must be a complete, valid document: "Use this example" followed by
 * "Download PDF" should work without the user having to fix anything first.
 */

import { describe, expect, it } from "vitest";
import { COVER_LETTER_EXAMPLES } from "./cover-letter-builder/examples";
import { coverLetterExportSchema } from "./cover-letter-builder/schema";
import { INVOICE_FORMATS, QUOTATION_FORMATS } from "./invoice-generator/examples";
import { computeInvoice } from "./invoice-generator/lib/calculations";
import { invoiceExportSchema } from "./invoice-generator/schema";
import { INVOICE_TEMPLATES } from "./invoice-generator/templates/registry";
import { RESUME_EXAMPLES } from "./resume-builder/examples";
import { prepareResume } from "./resume-builder/lib/prepare";
import { resumeExportSchema } from "./resume-builder/schema";
import { RESUME_TEMPLATES } from "./resume-builder/templates/registry";

const issuesOf = (result: {
  success: boolean;
  error?: { issues: { path: PropertyKey[]; message: string }[] };
}) =>
  result.success ? [] : result.error!.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);

describe("resume examples", () => {
  for (const example of RESUME_EXAMPLES) {
    it(example.slug, () => {
      expect(issuesOf(resumeExportSchema.safeParse(example.document))).toEqual([]);
      expect(RESUME_TEMPLATES.some((template) => template.id === example.document.templateId)).toBe(true);
      expect(prepareResume(example.document).sections.length).toBeGreaterThan(3);
    });
  }

  it("have unique slugs", () => {
    expect(new Set(RESUME_EXAMPLES.map((example) => example.slug)).size).toBe(RESUME_EXAMPLES.length);
  });
});

describe("cover letter examples", () => {
  for (const example of COVER_LETTER_EXAMPLES) {
    it(example.slug, () => {
      expect(issuesOf(coverLetterExportSchema.safeParse(example.document))).toEqual([]);
      expect(RESUME_TEMPLATES.some((template) => template.id === example.document.templateId)).toBe(true);
    });
  }

  it("have unique slugs", () => {
    expect(new Set(COVER_LETTER_EXAMPLES.map((example) => example.slug)).size).toBe(
      COVER_LETTER_EXAMPLES.length,
    );
  });
});

describe("invoice and quotation formats", () => {
  for (const [kind, formats] of [
    ["invoice", INVOICE_FORMATS],
    ["quote", QUOTATION_FORMATS],
  ] as const) {
    for (const example of formats) {
      it(`${kind}: ${example.slug}`, () => {
        expect(example.document.kind).toBe(kind);
        expect(issuesOf(invoiceExportSchema.safeParse(example.document))).toEqual([]);
        expect(INVOICE_TEMPLATES.some((template) => template.id === example.document.templateId)).toBe(true);
        expect(computeInvoice(example.document).totals.total).toBeGreaterThan(0);
      });
    }
  }
});
