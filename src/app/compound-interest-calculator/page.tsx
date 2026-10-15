import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { CompoundInterestCalculator } from "@/tools/compound-interest-calculator/components/compound-interest-calculator";
import { COMPOUND_INTEREST_CALCULATOR_CONTENT as content } from "@/tools/compound-interest-calculator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("compound-interest-calculator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function CompoundInterestCalculatorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <CompoundInterestCalculator />
    </ToolPage>
  );
}
