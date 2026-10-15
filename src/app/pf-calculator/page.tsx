import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { PfCalculator } from "@/tools/pf-calculator/components/pf-calculator";
import { PF_CALCULATOR_CONTENT as content } from "@/tools/pf-calculator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("pf-calculator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function PfCalculatorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <PfCalculator />
    </ToolPage>
  );
}
