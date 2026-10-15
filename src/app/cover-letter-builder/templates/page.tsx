import { TemplatesPage } from "@/components/tool/templates-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { TemplatesShowcase } from "@/tools/cover-letter-builder/components/templates-showcase";
import { getTool } from "@/tools/registry";
import { RESUME_TEMPLATES } from "@/tools/resume-builder/templates";

const tool = getTool("cover-letter-builder");
const description =
  "Browse free cover letter templates that match our resume templates: classic, modern, executive, sidebar and two-column designs. Fill one in online and download a PDF.";

export const metadata = buildMetadata({
  title: `${RESUME_TEMPLATES.length} Free Cover Letter Templates - Match Your Resume, PDF Download`,
  description,
  url: toolUrl(`${tool.slug}/templates`),
});

export default function CoverLetterTemplatesPage() {
  return (
    <TemplatesPage
      tool={tool}
      heading="Free Cover Letter Templates"
      intro={`${RESUME_TEMPLATES.length} designs, each matching one of our resume templates. Pick one, write your letter online and download a PDF - no sign-up, no watermark.`}
      description={description}
      itemNoun="cover letter template"
      templates={RESUME_TEMPLATES}
    >
      <TemplatesShowcase />
    </TemplatesPage>
  );
}
