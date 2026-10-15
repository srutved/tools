"use client";

import { useMemo } from "react";
import { ScaledPage } from "@/components/document/scaled-page";
import { TemplateGallery } from "@/components/tool/template-gallery";
import { WebPage } from "@/lib/document/web";
import { prepareLetter } from "../lib/letters";
import { SAMPLE_HR_LETTER } from "../sample";
import type { HrLetter } from "../schema";
import { LetterDocument } from "../templates/letter-document";
import { LETTER_TEMPLATES, type LetterTemplate } from "../templates/registry";

/** A live, scaled-down render of a letter in a given design (its first page area). */
export function LetterThumbnail({ letter, templateId }: { letter: HrLetter; templateId: string }) {
  const prepared = useMemo(() => prepareLetter(letter), [letter]);
  return (
    <ScaledPage firstPageOnly className="rounded-md border border-border bg-white shadow-xs">
      <LetterDocument templateId={templateId} letter={prepared} Page={WebPage} />
    </ScaledPage>
  );
}

const GALLERY_TEMPLATES = LETTER_TEMPLATES.map((template) => ({
  ...template,
  accent: template.theme.accent,
}));

interface LetterTemplateGalleryProps {
  letter?: HrLetter;
  selectedId?: string;
  onSelect?: (template: LetterTemplate) => void;
}

export function LetterTemplateGallery({ letter, ...props }: LetterTemplateGalleryProps) {
  const preview = letter?.company.name.trim() ? letter : SAMPLE_HR_LETTER;
  return (
    <TemplateGallery
      templates={GALLERY_TEMPLATES}
      renderThumbnail={(template) => <LetterThumbnail letter={preview} templateId={template.id} />}
      {...props}
    />
  );
}
