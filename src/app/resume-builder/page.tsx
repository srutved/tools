import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { ResumeBuilder } from "@/tools/resume-builder/components/resume-builder";
import { RESUME_BUILDER_CONTENT as content } from "@/tools/resume-builder/content";
import { getTool } from "@/tools/registry";

const tool = getTool("resume-builder");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function ResumeBuilderPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <ResumeBuilder />
    </ToolPage>
  );
}
