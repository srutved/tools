import { TemplatesPage } from "@/components/tool/templates-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { getTool } from "@/tools/registry";
import { TemplatesShowcase } from "@/tools/resume-builder/components/templates-showcase";
import { RESUME_TEMPLATES } from "@/tools/resume-builder/templates";

const tool = getTool("resume-builder");
const description =
  "Browse free resume templates: ATS-friendly classic and executive designs, modern templates with a photo, sidebar and two-column layouts. Fill one in online and download a PDF.";

export const metadata = buildMetadata({
  title: `${RESUME_TEMPLATES.length} Free Resume Templates - ATS-Friendly, PDF Download`,
  description,
  url: toolUrl(`${tool.slug}/templates`),
});

export default function ResumeTemplatesPage() {
  return (
    <TemplatesPage
      tool={tool}
      heading="Free Resume Templates"
      intro={`${RESUME_TEMPLATES.length} professional designs, all free. Pick one, fill it in online and download a PDF in minutes - no sign-up, no watermark, no paywall.`}
      description={description}
      itemNoun="resume template"
      templates={RESUME_TEMPLATES}
    >
      <TemplatesShowcase />
    </TemplatesPage>
  );
}
