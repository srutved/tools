"use client";

import { useMemo, type ReactNode } from "react";
import { ScaledPage } from "@/components/document/scaled-page";
import { TemplateGallery } from "@/components/tool/template-gallery";
import { WebPage } from "@/lib/document/web";
import { prepareResume } from "../lib/prepare";
import { SAMPLE_RESUME } from "../sample";
import type { Resume } from "../schema";
import { RESUME_TEMPLATES, ResumeDocument, templateTags, type ResumeTemplate } from "../templates";

/** A live, scaled-down render of a resume in a given template. */
export function ResumeThumbnail({ resume, templateId }: { resume: Resume; templateId: string }) {
  const prepared = useMemo(() => prepareResume(resume), [resume]);
  return (
    <ScaledPage className="rounded-md border border-border bg-white shadow-xs">
      <ResumeDocument templateId={templateId} resume={prepared} Page={WebPage} />
    </ScaledPage>
  );
}

const GALLERY_TEMPLATES = RESUME_TEMPLATES.map((template) => ({
  ...template,
  accent: template.theme.accent,
  tags: templateTags(template),
}));

/** The user's resume once it has some content; sample data reads better until then. */
export function hasResumeContent(resume: Resume | undefined): resume is Resume {
  return Boolean(resume?.basics.name.trim() && resume.experience.some((job) => job.role || job.company));
}

interface ResumeTemplateGalleryProps {
  /** The user's resume, so thumbnails show their own details; falls back to sample data. */
  resume?: Resume;
  selectedId?: string;
  onSelect?: (template: ResumeTemplate) => void;
  renderAction?: (template: ResumeTemplate) => ReactNode;
}

export function ResumeTemplateGallery({ resume, ...props }: ResumeTemplateGalleryProps) {
  const previewResume = hasResumeContent(resume) ? resume : SAMPLE_RESUME;
  return (
    <TemplateGallery
      templates={GALLERY_TEMPLATES}
      renderThumbnail={(template) => <ResumeThumbnail resume={previewResume} templateId={template.id} />}
      {...props}
    />
  );
}
