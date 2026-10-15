import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { PpfCalculator } from "@/tools/ppf-calculator/components/ppf-calculator";
import { PPF_CALCULATOR_CONTENT as content } from "@/tools/ppf-calculator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("ppf-calculator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function PpfCalculatorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <PpfCalculator />
    </ToolPage>
  );
}
