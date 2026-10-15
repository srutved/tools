import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { FdCalculator } from "@/tools/fd-calculator/components/fd-calculator";
import { FD_CALCULATOR_CONTENT as content } from "@/tools/fd-calculator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("fd-calculator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function FdCalculatorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <FdCalculator />
    </ToolPage>
  );
}
