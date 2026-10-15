import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { EmiCalculator } from "@/tools/emi-calculator/components/emi-calculator";
import { EMI_CALCULATOR_CONTENT as content } from "@/tools/emi-calculator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("emi-calculator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function EmiCalculatorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <EmiCalculator />
    </ToolPage>
  );
}
