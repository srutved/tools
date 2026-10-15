import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { CoverLetterBuilder } from "@/tools/cover-letter-builder/components/cover-letter-builder";
import { COVER_LETTER_BUILDER_CONTENT as content } from "@/tools/cover-letter-builder/content";
import { getTool } from "@/tools/registry";

const tool = getTool("cover-letter-builder");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function CoverLetterBuilderPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <CoverLetterBuilder />
    </ToolPage>
  );
}
