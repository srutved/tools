import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { HrLetterGenerator } from "@/tools/hr-letter-generator/components/hr-letter-generator";
import { HR_LETTER_GENERATOR_CONTENT as content } from "@/tools/hr-letter-generator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("hr-letter-generator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function HrLetterGeneratorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <HrLetterGenerator />
    </ToolPage>
  );
}
