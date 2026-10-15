import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { GratuityCalculator } from "@/tools/gratuity-calculator/components/gratuity-calculator";
import { GRATUITY_CALCULATOR_CONTENT as content } from "@/tools/gratuity-calculator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("gratuity-calculator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function GratuityCalculatorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <GratuityCalculator />
    </ToolPage>
  );
}
