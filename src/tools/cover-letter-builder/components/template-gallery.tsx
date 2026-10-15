"use client";

import { useMemo, type ReactNode } from "react";
import { ScaledPage } from "@/components/document/scaled-page";
import { TemplateGallery } from "@/components/tool/template-gallery";
import { WebPage } from "@/lib/document/web";
import { LAYOUT_FEATURES, RESUME_TEMPLATES, type ResumeTemplate } from "@/tools/resume-builder/templates";
import { prepareCoverLetter } from "../lib/prepare";
import { SAMPLE_COVER_LETTER } from "../sample";
import type { CoverLetter } from "../schema";
import { CoverLetterDocument } from "../templates/cover-letter-document";

/** A live, scaled-down render of a cover letter in a given design. */
export function CoverLetterThumbnail({ letter, templateId }: { letter: CoverLetter; templateId: string }) {
  const prepared = useMemo(() => prepareCoverLetter(letter), [letter]);
  return (
    <ScaledPage className="rounded-md border border-border bg-white shadow-xs">
      <CoverLetterDocument templateId={templateId} letter={prepared} Page={WebPage} />
    </ScaledPage>
  );
}

const GALLERY_TEMPLATES = RESUME_TEMPLATES.map((template) => ({
  ...template,
  accent: template.theme.accent,
  tags: LAYOUT_FEATURES[template.layout].photo ? ["Photo"] : [],
}));

interface CoverLetterTemplateGalleryProps {
  /** The user's letter, so thumbnails show their own details; falls back to sample data. */
  letter?: CoverLetter;
  selectedId?: string;
  onSelect?: (template: ResumeTemplate) => void;
  renderAction?: (template: ResumeTemplate) => ReactNode;
}

export function CoverLetterTemplateGallery({ letter, ...props }: CoverLetterTemplateGalleryProps) {
  const preview = letter?.basics.name.trim() && letter.body.trim() ? letter : SAMPLE_COVER_LETTER;
  return (
    <TemplateGallery
      templates={GALLERY_TEMPLATES}
      renderThumbnail={(template) => <CoverLetterThumbnail letter={preview} templateId={template.id} />}
      {...props}
    />
  );
}
